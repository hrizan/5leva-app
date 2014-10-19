var Beacon={
    _beacon: "Beacon",
    init: function(options){
        if (typeof options.onInit !=='function'){
            throw "You dont have onInit callback on Beacon.init";
        }
        if (typeof options.error !=='function'){
            throw "You dont have error callback on Beacon.init";
        }
        if (typeof options.onFound !=='function'){
            throw "You dont have onFound callback in Beacon.init";
        }
          var init = function(o){
              Log.i("Calling init");
              if (o && o.error){
                  Log.i("Calling init error "+o.error);
                  options.error(o.error);
              }
              if(o && o.found){
                  Log.i("DUDUUDDU")
                  options.onFound(o.found);
              }
              if (o && o.scanning){
                  Log.i("Calling scanning beacon");
                  options.onInit();
              }
          };
          var error = function(e){
              options.error(e);
          }
          cordova.exec(init, error, Beacon._beacon, "initBeacon", []);
    }, requestAccess: function(){
        cordova.exec(init, error, Beacon._beacon, "requestAuthorization", []);
        
    }
};