function initMap() {
    // Create a map object and specify the DOM element for display.
    myCenter=new google.maps.LatLng(41.878114, -87.629798);
    var mapOptions= {
        center:myCenter,
        zoom:12, scrollwheel: false, draggable: false,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);

    var marker = new google.maps.Marker({
        position: myCenter,
    });
    marker.setMap(map);
}

