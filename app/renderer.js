const {
    ipcRenderer,
    remote
} = require('electron')

mainProcess = remote.require('./tri_demo.js')
const TriMap = require('./src/triMap.js')

const mapDisplay = document.querySelector('#map')
const videoPlayer = document.querySelector('#video-player')
const videoCanvas = document.querySelector('#video-canvas')
const videoController = document.querySelector('#video-controller')
// select the canvas composition modes
const cModeSelector = document.querySelector('#c_model_selector')

let triMapper = null
let current_data = null
let current_shape_points_array = null
let current_segment_info = null

let c_mode = 'source-over'
let context = null
// flag variable for text masking on the video frame
let framed = true
let frame = $('#video-player img:first-of-type')[0]

// update the link section highlight
const updateLinkPlot = (map, shape_points) => {
    let directionsDisplay = new google.maps.DirectionsRender
    let directionsService = new google.maps.DirectionsService

    directionDisplay.setMap(map)
}

// Listen to the init signal
ipcRenderer.on('init', (event) => {
    let isl_lati = 42.31995
    let isl_longi = -83.233371

    triMapper = new TriMap(isl_lati, isl_longi, mapDisplay)
})

// Listen to the update-gps signal
ipcRenderer.on('update-gps', (event, currentLat, currentLng) => {
    console.log("event: update-gps")
    triMapper.updateGPSplot(currentLat, currentLng)
})

// Listen to the update-link signal
ipcRenderer.on('update-link', (event, shape_points_array, data) => {
    console.log("event: update-link")
    triMapper.renderPolyline(shape_points_array, data)
    // triMapper.updateLinkPlot(shape_points_array, data)
    current_shape_points_array = shape_points_array
    current_data = data
})

ipcRenderer.on('opened-video', (event, videoFile) => {
    console.log("event: opened-video")
    videoPlayer.src = videoFile
    $("#videoPath").text(videoFile.toString()) // use jQuery to show video name
    context = videoCanvas.getContext('2d')
    videoPlayer.addEventListener('play', drawFrame) // bind the video paly event to the frame drawing function
    videoPlayer.play()
})

// grab each frame
const drawFrame = () => {
    if (videoPlayer.paused || videoPlayer.ended) return false
    // update segmentation information
    let map_width = $("#map").width()
    $("#video-canvas").attr("width", map_width)
    $("#video-canvas").attr("height", map_width*0.56)
    let canvas_width = $("#video-canvas").width()
    let canvas_height = $("#video-canvas").height()

    let font_size = Math.round(map_width/50)
    context.clearRect(0, 0, canvas_width, canvas_height)
    context.globalCompositeOperation = c_mode
    context.drawImage(videoPlayer, 0, 0, videoPlayer.videoWidth, videoPlayer.videoHeight, 0, 0, canvas_width, canvas_height)
    if (framed && null !== current_segment_info) {
        // draw some text
        context.font = font_size + "px Verdana"
        context.fillStyle = "#FFFFFF"

        // set the absolute position of the info 
        var x = 0.72*canvas_width
        var y = 0.40*canvas_height
        var lineheight = font_size;
        var linkArrText = ""
        for (var i in current_segment_info.link_array)
            linkArrText += current_segment_info.link_array[i].linkID + "\n"

        let text = "Road infra level: " + current_segment_info.infras_type.toString() +
            "\nStart time: " + current_segment_info.start_time +
            "\nEnd time: " + current_segment_info.end_time +
            "\nLink array:\n" + linkArrText

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++)
            context.fillText(lines[i], x, y + (i * lineheight));
    }
    requestAnimationFrame(drawFrame) // recursive call this function
    return true
}

videoPlayer.addEventListener('timeupdate', () => {
    console.log("event: video-player -> ontimeupdate\n" + "currentTime: " + videoPlayer.currentTime)
    $("#currentTime").text(videoPlayer.currentTime)
    // update map information
    mainProcess.updateMap(videoPlayer.currentTime)
    // send request for querying information of current road segment
    mainProcess.updateSegInfo(videoPlayer.currentTime)
})

ipcRenderer.on('draw_seg_info', (event, currentSegInfo) => {
    current_segment_info = currentSegInfo // need deep copy?
})

// helper function
const log_state = (event) => {
    console.log(event.type)
    console.log('networkState: ' + event.target.networkState)
    console.log('readyState: ' + event.target.readyState)
}

// bind all four events to the log_state function.
videoPlayer.addEventListener('loadedmetadata', log_state)
videoPlayer.addEventListener('loadeddata', log_state)
videoPlayer.addEventListener('canplay', log_state)
videoPlayer.addEventListener('canplaythrough', log_state)

videoController.addEventListener('click', (event) => {
    let action = $(event.target).text().trim()
    switch (action) {
        case '|<':
            videoPlayer.currentTime = 0
            break
        case '<<':
            videoPlayer.playbackRate = videoPlayer.playbackRate * 0.5
            break
        case '||':
            videoPlayer.pause()
            break
        case '>':
            videoPlayer.playbackRate = 1.0
            videoPlayer.play()
            break
        case '>>':
            videoPlayer.playbackRate = videoPlayer.playbackRate * 2.0
            break
        case 'Framed':
            framed = false
            $(event.target).text('Frame')
            break
        case 'Frame':
            framed = true
            $(event.target).text('Framed')
            break
    }
    return false
})
