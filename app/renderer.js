const {
    ipcRenderer
} = require('electron')

// Cache DOM elements
const mapDisplay = document.querySelector('#map')
const videoPlayer = document.querySelector('#video-player')

let map

// initialize the Google Map
const initMap = (lati, longi) => {
  map = new google.maps.Map(mapDisplay, {
    zoom: 15,
    center: new google.maps.LatLng(lati, longi),
    mapTypeId: 'roadmap'
  })
}

// update the GPS point
const updateGPSplot = (map, lati, longi) => {
  let driverLatLng = new google.maps.LatLng(lati, longi)
  let marker = new google.maps.Marker({
    position: driverLatLng,
    title: "driver's current location"
  })
  marker.setMap(map)

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
ipcRenderer.on('update-gps', (event, lati, longi) => {
    updateGPSplot(map, lati, longi)
})

// Listen to the update-link signal
ipcRenderer.on('update-link', (event, shape_points) => {
  updateLinkPlot(map, shap_points)
})

// listen to the video loading
videoPlayer.addEventListener('timeupdate', () => {
  console.log("event: timeupdate" + "\t current time: " + videoPlayer.currentTime)
})
