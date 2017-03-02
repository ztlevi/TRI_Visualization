const {
    ipcRenderer,
    remote
} = require('electron')

mainProcess = remote.require('./tri_demo')

// Cache DOM elements
const videoLoadButton = document.querySelector('#load-video')
const videoPlayButton = document.querySelector('#play-video')
const videoPauseButton = document.querySelector('#pause-video')

const mapDisplay = document.querySelector('#map')
const videoPlayer = document.querySelector('#video-player')

let map

let driverMarker

// initialize the Google Map
const initMap = (lati, longi) => {
    map = new google.maps.Map(mapDisplay, {
        zoom: 15,
        center: new google.maps.LatLng(lati, longi),
        mapTypeId: 'roadmap'
    })

    var image = 'img/marker.png';
    driverMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lati, longi),
        title: "driver's current location",
        icon: image,
        animation: google.maps.Animation.DROP
    })
}

// update the GPS point
const updateGPSplot = (map, currentLat, currentLng) => {

    driverMarker.setMap(null) 

    let driverLatLng = new google.maps.LatLng(currentLat, currentLng)

    driverMarker = new google.maps.Marker({
        position: driverLatLng,
        title: "driver's current location"
    })
    driverMarker.setMap(map)

    // draw a new line from previous GPS location to the current place
}

// update the link section highlight
const updateLinkPlot = (map, shape_points) => {
    let directionsDisplay = new google.maps.DirectionsRender
    let directionsService = new google.maps.DirectionsService

    directionDisplay.setMap(map)

    calculateAndDisplayRoute(directionsService, directionsDisplay, shape_points)
}

const calculateAndDisplayRoute = (directionsService, directionsDisplay, shape_points) => {
    directionServie.route({
        origin: shape_points[0],
        destination: shape_points[end],
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status == 'OK') {
            directionsDisplay.setDirections(response)
        } else {
            window.alert('Directions request failed due to ' + status)
        }
    })
}

// Listen to the init signal
ipcRenderer.on('init', (event) => {

    let isl_lati = 42.31995
    let isl_longi = -83.233371

    initMap(isl_lati, isl_longi)
})

// Listen to the update-gps signal
ipcRenderer.on('update-gps', (event, currentLat, currentLng) => {
    console.log("event: update-gps")
    updateGPSplot(map, currentLat, currentLng)
})

// Listen to the update-link signal
ipcRenderer.on('update-link', (event, shape_points) => {
    console.log("event: update-link")
    updateLinkPlot(map, shap_points)
})

ipcRenderer.on('opened-video', (event, videoFile) => {
    console.log("event: opened-video")
    videoPlayer.src = videoFile 
    videoPlayer.play()
})

videoPlayer.addEventListener('timeupdate', () => {
    console.log("event: video-player -> ontimeupdate\n" + "currentTime: " + videoPlayer.currentTime)

    mainProcess.getCurrentGPS(videoPlayer.currentTime)
})
