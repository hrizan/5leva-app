var Business = {
     _checkIfRegistered:function(o, skipPassword){
        Log.i("Checking if registered");
        if (skipPassword)return true;
        Log.i("Skip password was false");
        if (o && (typeof o.password ==='undefined' || o.password=="")){
            Log.i("Pasword does not exist, so brand new user, who started the app with no connection");
            Business._createUser();
            return false;
        }
        Log.i("User exists since his password is set to: "+o.password);
        return true;
    },
    _simulator: false, 
    
  showAlert: function(err){
       
        if (Business._simulator){
            window.alert(err);
        } else {
            navigator.notification.alert(err, null, '5 leva', 'OK');
        }
  },  hideLoading: function(){
      app.hideLoading();
  }, _createUser: function() {
        Log.i("Creating user");
        
        Comm.post({
            uri: "registerMobileUser",
            data:{
                os: "IOS"  
            },
            skipPassword: true,
            onNoInternet: function(){navigator.splashscreen.hide();/*app.navigate("#templates/about.html");*/},
            success: function(result){
               
                Business._password = result.password;
                Log.i("Creating user with password "+Business._password);
                Storage.storePassword(result.password, Business.loginUser);
                 Push.register();
            },
            error: function() {
                navigator.splashscreen.hide();
              //  app.navigate("#templates/about.html"); 
            }
        });
    },
    _password:"", 
    login: function() {
      //  Business._setDeviceData();
        Storage.getPassword(function(password){
            Log.i("From storage password is "+password);
           
            if(!password || password.length === 0){
                Business._createUser();
            } else {
                Business._password = password;
                Push.register();
              //  Business.loginUser();
               // Business._sendPushToken();
            }
        });
    },_sendPushToken: function(token){
        Comm.post({
            uri: "updateToken",
            data:{
                token: token  
            },
            success: function(result){
                Log.i("Token updated to "+token);
            }
        });
    }, openViewOnNotification: function(data){
        
    }
};