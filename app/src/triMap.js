class TriMap{
    constructor(Lat, Lng, mapDisplay){
        this.currentPosition = new google.maps.LatLng(Lat, Lng)
        this.markerImage = './img/marker.png'
        this.map = new google.maps.Map(mapDisplay, {
            zoom: 18,
            center: new google.maps.LatLng(Lat, Lng),
            mapTypeId: 'roadmap'
        })

        // test for Last Position Marker
        this.LastPositionMarker= new google.maps.Marker({
            position: this.currentPosition,
            title: "driver's last location",
        })

        this.driverMarker = new google.maps.Marker({
            position: this.currentPosition,
            title: "driver's current location",

            icon: this.markerImage,
            animation: google.maps.Animation.DROP
        })
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            // suppressMarkers: true,
            preserveViewport: true
        })
        this.directionsDisplay = new google.maps.DirectionsRenderer
        this.directionsDisplay.setMap(this.map)

        this.directionsService = new google.maps.DirectionsService
    }

    // update the GPS point
    updateGPSplot(currentLat, currentLng) {
        // clear the driver Marker on the map
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
    renderDirections(start, end, waypts) {
        // render Direction
        this.directionsService.route({
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, (result, status) => {
            if (status == 'OK') {
                this.directionsRenderer.setMap(this.map);
                this.directionsRenderer.setDirections(result);
                console.log("Plot the direction.\n Start: " + start
                            + "\t End: " + end + "\t Waypoints: " + JSON.stringify(waypts))
            } else {
                console.log(result)
            }
        })
    }

    updateLinkPlot (shape_points_array, data) {
        // get first GPS point of the link ////////////////////////////////////
        console.log('Data: ' + JSON.stringify(data))

        let shape_points_GPS = shape_points_array[0]
        let shape_points = shape_points_GPS.split(' ')
        let point1 = new google.maps.LatLng(parseFloat(shape_points[0]),
                                            parseFloat(shape_points[1]))

        let waypts = []
        // get the way points
        for (let i = 1; i < shape_points_array.length - 1; i++) {
            // get the points of the direction
            shape_points_GPS = shape_points_array[i]
            shape_points = shape_points_GPS.split(' ')
            waypts.push({
                location: new google.maps.LatLng(parseFloat(shape_points[0]),
                                                 parseFloat(shape_points[1])),
                stopover: true
            })
        }

        // get the last GPS point of the link /////////////////////////////////
        // if way points size > 4, then the point2 set to be the last point
        // of the way points, other than the last point of the shape points
        let point2
        let len = shape_points_array.length - 1
        if (waypts.length > 4) {
            len--
        }
        shape_points_GPS = shape_points_array[len]
        shape_points = shape_points_GPS.split(' ')
        point2 = new google.maps.LatLng(parseFloat(shape_points[0]),
                                            parseFloat(shape_points[1]))

        // define the start and end by calculate the vector product ///////////
        let start = point1, end = point2
        // define the threshold for speed
        let speedThreshold = 1
        if (data.speed > speedThreshold){
            // 2 vector corss product
            // (x1, y1) * (x2, y2), use cos() to identify if the angle > 90
            let x1 = point2.lat() - point1.lat()
            let y1 = point2.lng() - point1.lng()
            let x2 = data.lat - this.currentPosition.lat()
            let y2 = data.lng - this.currentPosition.lng()

            if (x1*x2+y1*y2 < 0) {
                start = point2
                end = point1
                waypts.reverse()
            }

            // only plot directions when sthe speed > threshold
            this.renderDirections(start, end, waypts)
        }

        // test the Last Position /////////////////////////////////////////////
        // console.log('Last Position: ' + this.currentPosition.lat() + '\t'
        //             + this.currentPosition.lng());
        // this.LastPositionMarker.setMap(null)
        // this.LastPositionMarker = new google.maps.Marker({
        //     position: this.currentPosition,
        //     title: "driver's last location",
        // })
        // this.LastPositionMarker.setMap(this.map)

        console.log('Current Link: ' + data.link_ID)
        this.currentPosition = new google.maps.LatLng(data.lat, data.lng)
    }

    rad(x) {
        return x * Math.PI / 180;
    };

    getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }
    
}

module.exports = TriMap
