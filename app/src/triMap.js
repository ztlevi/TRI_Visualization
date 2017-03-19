class TriMap{
    constructor(Lat, Lng, mapDisplay){
        this.markerImage = './img/marker.png'
        this.map = new google.maps.Map(mapDisplay, {
            zoom: 15,
            center: new google.maps.LatLng(Lat, Lng),
            mapTypeId: 'roadmap'
        })

        this.driverMarker = new google.maps.Marker({
            position: new google.maps.LatLng(Lat, Lng),
            title: "driver's current location",

            icon: this.markerImage,
            animation: google.maps.Animation.DROP
        })

        this.directionsDisplay = new google.maps.DirectionsRenderer
        this.directionsDisplay.setMap(this.map)

        this.directionsService = new google.maps.DirectionsService
    }

    // update the GPS point
    updateGPSplot(currentLat, currentLng) {

        this.driverMarker.setMap(null) 

        let driverLatLng = new google.maps.LatLng(currentLat, currentLng)

        this.driverMarker = new google.maps.Marker({
            position: driverLatLng,
            title: "driver's current location",
            icon: this.markerImage,
        })
        this.driverMarker.setMap(this.map)
    }

    // plot the directions
    renderDirections(result) {
        console.log("test")
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);
    }

    updateLinkPlot(shape_points_array) {
        for (let i = 0; i+1 < shape_points_array.length; i++) {
            // get the start point of the direction
            let shape_points_GPS = shape_points_array[i]
            let shape_points = shape_points_GPS.split(' ')
            let start = {}
            start.lat = parseFloat(shape_points[0])
            start.lng = parseFloat(shape_points[1])

            // get teh end point of the direction
            let end = {}
            shape_points_GPS = shape_points_array[i+1]
            shape_points = shape_points_GPS.split(' ')
            end.lat = parseFloat(shape_points[0])
            end.lng = parseFloat(shape_points[1])

            console.log("Plot the direction" + start + ", " + end)

            // render Direction
            this.directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, (result, status) => {
                console.log(result)
                this.directionsDisplay.setDirections(result);
            })

            console.log("Plot directions.\n Start: " + start + "\t End: "
                        + end)
        }
    }
}

module.exports = TriMap
