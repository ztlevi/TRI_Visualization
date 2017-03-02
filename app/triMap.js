class TriMap{
    constructor(Lat, Lng, mapDisplay){
        this.markerImage = 'img/marker.png'
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
    }

    // update the GPS point
    updateGPSplot(currentLat, currentLng) {

        this.driverMarker.setMap(null) 

        let driverLatLng = new google.maps.LatLng(currentLat, currentLng)

        this.driverMarker = new google.maps.Marker({
            position: driverLatLng,
            title: "driver's current location",
            icon: this.markerImage,
            animation: google.maps.Animation.BOUNCE
        })
        this.driverMarker.setMap(this.map)
    }

}

module.exports = TriMap
