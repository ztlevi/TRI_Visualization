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
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        this.directionsService = new google.maps.DirectionsService;
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

    renderDirections(result) {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);
    }

    updateLinkPlot(shape_points_array) {
        let shape_points_GPS = shape_points_array[0]
        let shape_points = shape_points_GPS.split(' ')
        let start = shape_points[0]
        let end = shape_points[1]
        this.directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, this.renderDirections(result));
    }
}

module.exports = TriMap
