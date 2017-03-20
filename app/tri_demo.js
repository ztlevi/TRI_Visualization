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

let videoFile = null
let OBD_data = null

// load dataBase
let dbFile = "./app/db/example.db"
const db = new sqlite3.Database(dbFile)

const createWindow = () => {
    // Create browser window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadURL('file://' + __dirname + '/index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('init')
    })

    mainWindow.webContents.openDevTools()

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
        filters: [
            { name: 'MPEG 4', extensions: ['mp4'] },
            { name: 'AVI', extensions: ['avi'] }
        ]
    })
    
    if (!videoFiles) { return }
    
    videoFile = videoFiles[0]

    console.log("Server: user selected the video: " + path.win32.basename(videoFile))

    const OBD_file = path.win32.dirname(videoFile) + '/../data/OBD.json'
    if (!OBD_file) { return }

    OBD_data = JSON.parse(fs.readFileSync(OBD_file, 'utf8'))

    currentLat = OBD_data[0].lati
    currentLng = OBD_data[0].long

    console.log("Start GPS position:\t latittude: " + currentLat + "longitude: " + currentLng)

    mainWindow.webContents.send('update-gps', currentLat, currentLng)

    mainWindow.webContents.send('opened-video', videoFile)
}

// Get the current GPS and send the update-gps signal /////////////////////////
const getCurrentGPS = exports.getCurrentGPS = (reqTimeStamp) => {
    // if the time difference is greater than 1s
    // update the driver's current location on the google map
    if (Math.abs(Math.floor(reqTimeStamp) - Math.floor(lastReqTimestamp)) >= 1) {
        let data_index = Math.floor(reqTimeStamp)
        mainWindow.webContents.send('update-gps', OBD_data[data_index].lati,
                                    OBD_data[data_index].longi)
    }
}

// query shape points of a given link and sene the update-link signal /////////
const queryShapePoints = exports.queryShapePoints =  (data) => {
    db.all("SELECT shape_points from link_to_shape_points where link_ID="
           +data.link_ID, (err, row) => {
               let shape_points_text = row[0].shape_points
               let shape_points_array = shape_points_text.split(',')
               console.log("link ID: " + data.link_ID)
               console.log("Shape Point Array: " + shape_points_array)

               // update Links
               mainWindow.webContents.send('update-link', shape_points_array, data)
           }) 
}

// Get the current Link ///////////////////////////////////////////////////////
const getCurrentLink = exports.getCurrentLink = (reqTimeStamp) => {
    if (Math.abs(Math.floor(reqTimeStamp) - Math.floor(lastReqTimestamp)) >= 1) {
        let data_index = Math.floor(reqTimeStamp)

        let data = {}

        data.link_ID = OBD_data[data_index].linkID
        data.speed = OBD_data[data_index].speed
        data.lat = OBD_data[data_index].lati
        data.lng = OBD_data[data_index].longi

        // Query the database when the link_ID does not equal to the currentLink
        if (data.link_ID != currentLink) {
            queryShapePoints(data)
            console.log("Plot directions.\n Server: requset time: " + reqTimeStamp)
        }
    }
    // convert shape_points_text to shape_points_array
    
} 

// Update the lastReqTimestamp, currentLat and currentLng /////////////////////
const updateLocalVariables = exports.updateLocalVariables= (reqTimeStamp) => {
    let data_index = Math.floor(reqTimeStamp)

    currentLat = OBD_data[data_index].lati
    currentLng = OBD_data[data_index].longi
    currentLink = OBD_data[data_index].linkID
    lastReqTimestamp = reqTimeStamp

    console.log("Update Local Variables.\n Server: requset time: " + reqTimeStamp +
                "\t current GPS: latitude " + currentLat + "\t longitude: " +
                currentLng)
}
