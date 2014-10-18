var Cam = {
    init: function(options){
      	if (typeof options.error === 'function'){
              Cam._error = options.error;
          }
    },
    img:null,
    _error: function(err){Log.i("Error in cam work " +err);},
   
    getPhoto: function(options){
        if (typeof options.success!=='function'){
            throw "Camera needs success callback";
        }
        if (!options.img){
            throw "Camera needs img DOM element";
        }
        var success = options.success;
        navigator.camera.getPicture(function(result){
           Log.i("Photo is ready", this);
           Cam._process(result, options.img, success);
        },Cam._error
        ,{
           destinationType: Camera.DestinationType.DATA_URL,
           encodingType: Camera.EncodingType.JPEG,
           correctOrientation: true
        });
    }, _process: function(imageData, imgElement, success/*, preView, success*/){
        var image = new Image();
        image.src = "data:image/jpeg;base64,"+imageData;
		var mpx = new MegaPixImage(image);
 
        mpx.render(document.getElementById(imgElement), {
           // maxWidth: 600,
            maxHeight: 600,
            quality: 1,
            onrender: function(target){
                var img = target.src.split(',')[1];
                Cam.img = img;
                success(target);
               // Cam.setInModel(img);
               
              // app.navigate(preView+"?cam=1");                
            }
        });
    }
};