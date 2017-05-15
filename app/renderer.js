const {
    ipcRenderer,
    remote
} = require('electron')

mainProcess = remote.require('./tri_demo.js')
const TriMap = require('./src/triMap.js')

const mapDisplay = document.querySelector('#map')
const videoPlayer = document.querySelector('#video-player')

let triMapper = null
let current_data = null
let current_shape_points_array = null

const video = document.getElementById("video-player")
const canvas = document.getElementById("video-canvas")

let context = null

// let fc = new frameConverter(video, canvas, current_data,current_shape_points_array)

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
    current_shape_points_array = shape_points_array
    current_data = data
    //triMapper.updateLinkPlot(shape_points_array, data)
})

ipcRenderer.on('opened-video', (event, videoFile) => {
    console.log("event: opened-video")
    videoPlayer.src = videoFile 
    $("#videoPath").text(videoFile.toString())
    videoPlayer.play()
})

// grab each frame
videoPlayer.addEventListener('play', () => {
    if (videoPlayer.paused || videoPlayer.ended) return false
    context = canvas.msGetInputContext('2d')
})

videoPlayer.addEventListener('timeupdate', () => {
    console.log("event: video-player -> ontimeupdate\n" + "currentTime: " + videoPlayer.currentTime)
    $("#currentTime").text(videoPlayer.currentTime)
     // update segmentation information
    mainProcess.updateSegInfo(videoPlayer.currentTime)
    // update map information
    mainProcess.updateMap(videoPlayer.currentTime)
})

ipcRender.on('draw_seg_info', (event, currentSegInfo) => {

})