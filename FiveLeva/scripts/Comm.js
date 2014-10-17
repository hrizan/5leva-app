var Comm={
    url:"",
    isConnected: function(){
        Log.i("Will check if there is net");
//        if (Debug.isSimulator())return true;
        Log.i("It is not a simulator");
        var v = navigator.connection.type!=Connection.NONE;
        Log.i("Is connected "+v);
        if (!v){
            Comm._hideLoading();
            
        }
        return v;
    },
    init: function(options){
        Comm.url = options.url;
        if (typeof options.isSimulator == 'function'){
            Comm._isSimulator = options.isSimulator;
        }
        if (typeof options.dataCallback=='function'){
            Comm._dataCallback = options.dataCallback;
        }
        if (typeof options.onError=='function'){
            Comm._onError = options.onError;
        }
        if (typeof options.onCommError=='function'){
            Comm._onCommError = options.onCommError;
        } 
        if (typeof options.onNoInternet =='function'){
            Comm._onNoInternet = options.onNoInternet;
        }
        if (typeof options.onInternet == 'function'){
            Comm._onInternet = options.onInternet;
        }
        if (typeof options.onInfo == 'function'){
            Comm._onInfo = options.onInfo;
        }
        if (typeof options.checkIfRegistered ==='function'){
            Comm._checkIfRegistered = options.checkIfRegistered;
        }
        if (typeof options.hideLoading ==='function'){
            Comm._hideLoading = options.hideLoading;
        }
        Comm._type = options.type;
    },
    _hideLoading: function(){},
    _checkIfRegistered: function(){return true;},
    _isSimulator: function(){return false;},
    _onInternet: function(hadInternetBefore){},
    _onError: function(error){},
    _onCommError: function(error){},
    _onNoInternet: function(){},
    _onInfo: function(){},
    _type:"",
    _dataCallback: function(){
    	return [];
    },
    _showInfo: function(description, callback){
        if (description && description.length>0){
            callback(description);
         }
    },
    get: function(options){
       
        if (!Comm.isConnected()){
           if (typeof options.onNoInternet ==='function'){
               Log.i("Calling on no internet callback");
               options.onNoInternet()
           }
            return;
           }
        var success = function(result){
            Log.i("Got response from backend");
            if (options && options.dataType=='html'){
                options.success(result);
            }else
            if (result.code===0){
                options.success(result);
                Comm._showInfo(result.error, Comm._onInfo);
            }else{
                Comm._showInfo(result.error, Comm._onError);
            }
            Comm._hideLoading();
        }
    	if (typeof options.error != 'function'){
    		options.error = function(jqXHR, textStatus, errorThrown){
				Log.i("Got communication error "+textStatus);		
                Comm._onCommError(textStatus);
                Comm._hideLoading();
			} 
    	}
        var data = Comm._dataCallback();
        /*for (key in data){
            if (!options.type){
                data[key] = encodeURIComponent(data[key]);
                Log.i("Encoded "+data[key]);
            }
        }*/
        if (options.data){
            for (key in options.data){
                
                    data[key]=options.data[key];
                
            }
        }
        Log.i("Calling backend "+options.uri);
        var d;
        var contentType=null;
        if (Comm._type=='requestBody'){
            d = JSON.stringify(data);
            contentType="application/json; charset=utf-8"
        }else{
            d = data;
        }
        for (k in d){
            Log.i(k+" is "+d[k]);
        }
        if (!Comm._checkIfRegistered(data, options.skipPassword))return;
        $.ajax({
                url: Comm.url+options.uri, 
                //dataType: options.dataType?options.dataType:"json", 
                timeout: 2000, //options.timeout?options.timeout:1500,
                data: d, 
                type:options.type?options.type:"get", 
                //contentType: 'text/html; charset=UTF-8',
                success: success,
                error: function(){options.error();Comm._hideLoading();}
            });
    }, 
    post: function(options){
        options.type="post"; 
        return Comm.get(options); 
    }
};
document.addEventListener("online", function(){
    if (typeof Comm._onInternet == 'function'){ 
        Comm._onInternet();
    }}, false);
document.addEventListener("offline", function(){ 
    if (typeof Comm._onNoInternet=='function'){
        Comm._onNoInternet();
    }},false);