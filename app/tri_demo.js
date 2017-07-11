const {
    app,
    BrowserWindow,
    dialog,
    Menu
} = require('electron')

const fs = require('fs')
const path = require('path')

const sqlite3 = require('sqlite3').verbose()
const applicationMenu = require('./application-menu')

let mainWindow = null

// current variables means the last variables during the processing, and update
// them at the end of the 'timeupdate' signal of the video
let currentLat = 0.0
let currentLng = 0.0

let lastReqTimestamp = 0.00

let currentLink = 0

let currentSeg = null // global variable in the server to store the information of current road segmentation
let currentSeg_index = 0

let videoFile = null
let OBD_data = null
let infras_seg_result = null

// load dataBase
let dbFile = path.join(app.getAppPath(), 'app/db/link_static_info.db')
const db = new sqlite3.Database(dbFile)

var parse = require('csv-parse');
let csvHeader = null
let isCSVHeader = true
let realtimeInfo = []

let csvFile = path.join(app.getAppPath(), 'app/data/Synchronized_data_Yuanma_Trip6.csv')
fs.createReadStream(csvFile)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        if (isCSVHeader) {
            csvHeader = csvrow
            isCSVHeader = false
        }
        else if (Number.isInteger(parseFloat(csvrow[0]))) {
            realtimeInfo.push(csvrow)
        }
    })
    .on('end',function() {
      //do something wiht csvData
      console.log("Successfully load CSV data!")
    })

const createWindow = () => {
    // Create browser window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.maximize()

    mainWindow.loadURL('file://' + __dirname + '/index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('init')
    })

    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', () => {
    Menu.setApplicationMenu(applicationMenu)
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('active', () => {
    if (mainWindow == null) {
        Menu.setApplicationMenu(applicationMenu)
        createWindow()
    }
})

const openVideoFromUser = exports.openVideoFromUser = () => {
    console.log("user request to open video")

    const videoFiles = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
                name: 'MPEG 4',
                extensions: ['mp4']
            },
            {
                name: 'AVI',
                extensions: ['avi']
            }
        ]
    })

    if (!videoFiles) {
        return
    }

    videoFile = videoFiles[0]
    console.log(videoFile)

    console.log("Server: user selected the video: " + path.win32.basename(videoFile))

    const OBD_file = path.join(app.getAppPath(), 'app/data/OBD.json')
    const infras_seg_result_file = path.join(app.getAppPath(),
        'app/data/infras_segment_result.json')

    try {
        OBD_data = JSON.parse(fs.readFileSync(OBD_file, 'utf8'))
        infras_seg_result = JSON.parse(fs.readFileSync(infras_seg_result_file, 'utf8'))
    } catch (err) {
        console.log(err.message)
    }

    currentLat = OBD_data[0].lati
    currentLng = OBD_data[0].longi
    console.log("Start GPS position:\t latittude: " + currentLat + "longitude: " + currentLng)

    // store the status of the current segment
    currentSeg = infras_seg_result[currentSeg_index]

    mainWindow.webContents.send('update-gps', currentLat, currentLng)

    mainWindow.webContents.send('opened-video', videoFile)

    mainWindow.webContents.send('opened-csv', csvHeader, realtimeInfo)
}

// Get the current GPS and send the update-gps signal to update ////////////////
const updateCurrentGPS = (reqTimeStamp) => {
    // if the time difference is greater than 1s
    // update the driver's current location on the google map
    let data_index = Math.floor(reqTimeStamp)
    mainWindow.webContents.send('update-gps', OBD_data[data_index].lati,
        OBD_data[data_index].longi)
}

// query shape points of a given link and sene the update-link signal /////////
const queryShapePoints = (data) => {
    db.all("SELECT shape_points from link_to_shape_points where link_ID=" +
        data.link_ID, (err, row) => {
            let shape_points_text = row[0].shape_points
            let shape_points_array = shape_points_text.split(',')
            console.log("link ID: " + data.link_ID)
            console.log("Shape Point Array: " + shape_points_array)

            // update Links
            mainWindow.webContents.send('update-link', shape_points_array, data)
        })
}

// Get the current Link ///////////////////////////////////////////////////////
const updateCurrentLink = (reqTimeStamp) => {
    let data_index = Math.floor(reqTimeStamp)

    let data = {}

    data.link_ID = OBD_data[data_index].linkID
    // do not queryShapePoints if the currentlink equals data.link_ID
    if (data.link_ID != currentLink) {
        // check if currentLink is in the segment

        data.interval = Math.floor(reqTimeStamp) - Math.floor(lastReqTimestamp)
        data.speed = OBD_data[data_index].speed
        data.lat = OBD_data[data_index].lati
        data.lng = OBD_data[data_index].longi

        // Query the database when the link_ID does not equal to the currentLink
        queryShapePoints(data)
        console.log("Plot directions.\n Server: requset time: " + reqTimeStamp)
    }
}

// Update the lastReqTimestamp, currentLat and currentLng /////////////////////
const updateLocalVariables = (reqTimeStamp) => {
    let data_index = Math.floor(reqTimeStamp)

    currentLat = OBD_data[data_index].lati
    currentLng = OBD_data[data_index].longi
    currentLink = OBD_data[data_index].linkID
    lastReqTimestamp = reqTimeStamp

    console.log("Update Local Variables.\n Server: requset time: " + reqTimeStamp +
        "\t current GPS: latitude " + currentLat + "\t longitude: " +
        currentLng)
}

const updateRealtimeInfo = (reqTimeStamp) => {
    let data_index = Math.floor(reqTimeStamp)
    mainWindow.webContents.send('update-info', data_index)
}

// Update Map /////////////////////////////////////////////////////////////////
const updateMap = exports.updateMap = (reqTimeStamp) => {
    // set the update interval to 1s
    let interval = 1
    let realInterval = Math.abs(Math.floor(reqTimeStamp) - Math.floor(lastReqTimestamp))

    if (realInterval >= interval) {
        updateCurrentGPS(reqTimeStamp)
        updateCurrentLink(reqTimeStamp)
        updateLocalVariables(reqTimeStamp)
        // Update by 5s
        if (Math.floor(reqTimeStamp) % 5 == 0)
            updateRealtimeInfo(reqTimeStamp)
    }
}

// Update Segmentation information
const updateSegInfo = exports.updateSegInfo = (reqTimeStamp) => {
    console.assert(reqTimeStamp > currentSeg.start_time,
        "reqTimeStamp should be later than the start time of currentSeg.")

    if (reqTimeStamp > currentSeg.end_time) {
        currentSeg_index += 1
        currentSeg = infras_seg_result[currentSeg_index]
        console.log("enter into a new road_segmentation: " + currentSeg_index)
        console.log("segment infrastructure type: " + currentSeg.infras_type.toString())
    } else {
        console.log("stay in the same road_segmentation.")
    }
    mainWindow.webContents.send('draw_seg_info', currentSeg)
}
