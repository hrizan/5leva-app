var Map = {
    userDiscountMiniMap: "",
    userDiscountBigMap: "",
    udMiniMapInit: function() {
        var mapOptions = {
            center: new google.maps.LatLng(42.6954322, 23.3239467),
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,
            draggable: false,
            scrollwheel: false,
            panControl: false,
            zoomControl:false,
        };
        Map.userDiscountMiniMap = new google.maps.Map(document.getElementById("user-discount-map"), mapOptions);
       
    },
    dropPinAtMiniMap: function(lat, lng){
        var location = new google.maps.LatLng(lat, lng);
        var promoPin = new google.maps.Marker({
            position: location,
            map: Map.userDiscountMiniMap,
            draggable : false,
            animation : google.maps.Animation.DROP
        });
        Map.userDiscountMiniMap.setCenter(location);
    },
    udBigMapInit:function(lat, lng){
        var location = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: location,
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,
        };
        Map.userDiscountBigMap = new google.maps.Map(document.getElementById("user-discount-big-map"), mapOptions);
        var pin = new google.maps.Marker({
            position: location,
            map: Map.userDiscountBigMap,
            draggable: false
        });
    }
}