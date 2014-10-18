var Push = {
    init: function(options) {
        if (typeof options.onToken == 'function') {
            Push._onToken = options.onToken;
        }
        if (options.senderId) {
            Push._senderId = options.senderId;
        }
        if (typeof options.onBackground == 'function') {
            Push._onBackground = options.onBackground;
        }
        if (typeof options.onForeground == 'function') {
            Push._onForeground = options.onForeground;
        }
        if (typeof options.onError == 'function') {
            Push._onError = options.onError;
        }
    },
    _token: "",
    _onError:{},
    _onForeground: {},
    _onBackground: {},
    _onToken:{},
    push:{},
    _senderId: "303982099267",
    getToken: function(){
      	return Push._token;  
    },
    register: function() {
        Log.i("Registering for push");
        Push.push = window.plugins.pushNotification;
       
        if (device.platform == 'android' || device.platform == 'Android') {
            Push.push.register(
                Push._androidSuccess, 
                Push._androidError, {
                    "senderID": Push._senderId,
                    "ecb":"Push._onNotificationGCM"
                });
        }else {
            Push.push.register(Push._iosToken, Push._iosError, {
                                   "badge":"true",
                                   "sound":"true",
                                   "alert":"true",
                                   "ecb":"Push._onNotificationAPN"
                               });
        }
    },
    _onNotificationAPN: function(event) {
        console.log(event);
        if (event.alert) {
            //navigator.notification.alert(event.alert);
            if (event.foreground == "1") {
                if (typeof Push._onForeground == 'function') {
                    Push._onForeground(event.alert, event);
                }
            }else {
                if (typeof Push._onBackground == 'function') {
                    Push._onBackground(event.alert, event);
                }
            }
        }
    }, 
    _iosToken: function(token) {
        Push._token = token;
        if (typeof Push._onToken == 'function') {
            Push._onToken(token);
        }
    },
    _iosError:function(error) {
        Push._checkErrorIos(error);
    },
    _onNotificationGCM: function(e) {
        switch (e.event) {
            case 'registered':
             Push._token = e.regid;
                if (typeof Push._onToken == 'function') {
                   
                    Push._onToken(e.regid);
                }
                break;
            case 'message':
                Log.i("Got message");
            
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
           
                try {
                    if (e.foreground) {	
                        Log.i("Foreground");
                        // if the notification contains a soundname, play it.
                        //var my_media = new Media("/android_asset/www/"+e.soundname);
                        //my_media.play();
                  	
                        if (typeof Push._onForeground == 'function') {
                            Push._onForeground(e.message, e.payload);
                        }
                    } else {  // otherwise we were launched because the user touched a notification in the notification tray.
                        //e.coldstart if has been killed
                        if (e.coldstart == 1) {
                            if (typeof Push._onBackground == 'function') {
                                Push._onBackground(e.message, e.payload);
                            } 
                        }else {
                            if (typeof Push._onForeground == 'function') {
                                Push._onForeground(e.message, e.payload);
                            }
                        }
                        // navigator.notification.alert(e.message);
                        //  Log.i(e.payload);
                    }
                }catch (error) {
                    Push._checkErrorAndroid(error);
                }
                break;
            case 'error':
                Push._checkErrorAndroid(e);
                break;
            default:
                Log.i("Unknown event");
                break;
        }
    },
    _androidSuccess: function(e) {
        Log.i("Registered for push");
    }, 
    _androidError: function(e) { 
        Push._checkErrorAndroid(e);
    }, _checkErrorAndroid: function(e) {
        return Push._checkError(e);
    }, _checkErrorIos: function(e) {
        return Push._checkError(e);
    }, _checkError: function(e) {
        Log.i("Error: " + e);
        if (typeof Push._onError == 'function') {
            Push._onError(e);
        }
    }
    
};