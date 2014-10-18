var Map = {
    userDiscountMiniMap: "",
    userDiscountBigMap: "",
    addDiscountMap: "",
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
    dropPinAtMiniMap: function(lat, lng) {
        var location = new google.maps.LatLng(lat, lng);
        var promoPin = new google.maps.Marker({
                                                  position: location,
                                                  map: Map.userDiscountMiniMap,
                                                  draggable : false,
                                                  animation : google.maps.Animation.DROP
                                              });
        Map.userDiscountMiniMap.setCenter(location);
    },
    udBigMapInit:function(lat, lng) {
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
    },
    addDiscountMapInit: function() {
        var mapOptions = {
            center: new google.maps.LatLng(42.6954322, 23.3239467),
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false
        };
        Map.addDiscountMap = new google.maps.Map(document.getElementById("add-discount-map"), mapOptions);
        /*google.maps.event.addListenerOnce(Map.addDiscountMap, 'click', function(event) {
        Map.addDiscountPin(event.latLng.lat(), event.latLng.lng());
        });*/
    },
    addDiscountPin: function(lat, lng) {
        var location = new google.maps.LatLng(lat, lng);
        Model.form.object.set("lat", lat);
        Model.form.object.set("lng", lng);
        
        var discountPin = new google.maps.Marker({
                                                     position: location,
                                                     map: Map.addDiscountMap,
                                                     draggable : true,
                                                     crossOnDrag : false,
                                                     animation : google.maps.Animation.DROP
                                                 });
        
        Map.addDiscountMap.setCenter(location);
        Map.dragDiscountPin(discountPin);
    },
    dragDiscountPin: function(pin) {
        google.maps.event.addListener(pin, 'dragend', function(event) {
            Model.form.object.set("lat", event.latLng.lat());
            Model.form.object.set("lng", event.latLng.lng());
        });
    }
    
}