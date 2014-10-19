var Business = {
    _checkIfRegistered:function(o, skipPassword) {
        Log.i("Checking if registered");
        if (skipPassword)
            return true;
        Log.i("Skip password was false");
        if (o && (typeof o.password ==='undefined' || o.password == "")) {
            Log.i("Pasword does not exist, so brand new user, who started the app with no connection");
            Business._createUser();
            return false;
        }
        Log.i("User exists since his password is set to: " + o.password);
        return true;
    },
    _simulator: false, 
    
    showAlert: function(err) {
        if (Business._simulator) {
            window.alert(err);
        } else {
            navigator.notification.alert(err, null, '5 leva', 'OK');
        }
    },  hideLoading: function() {
        app.hideLoading();
    }, _createUser: function() {
        Log.i("Creating user");
        
        Comm.post({
                      uri: "registerMobileUser",
                      data:{
                os: "IOS"  
            },
                      skipPassword: true,
                      onNoInternet: function() {
                          navigator.splashscreen.hide();
                      /*app.navigate("#templates/about.html");*/},
                      success: function(result) {
                          Business._password = result.password;
                          Log.i("Creating user with password " + Business._password);
                          Storage.storePassword(result.password, Business.loginUser);
                          Business._complete();
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
        Storage.getPassword(function(password) {
            Log.i("From storage password is " + password);
           
            if (!password || password.length === 0) {
                Business._createUser();
            } else {
                Business._password = password;
                Business._complete();
                //  Business.loginUser();
                // Business._sendPushToken();
            }
        });
    },_sendPushToken: function(token) {
        Comm.post({
                      uri: "updateToken",
                      data:{
                token: token  
            },
                      success: function(result) {
                          Log.i("Token updated to " + token);
                      }
                  });
    }, openViewOnNotification: function(data) {
    },
    _complete: function() {
        Push.register();
        Comm.post({
                      uri: "discounts",
                      success: function(result) {
                          console.log(result);
                          var discountsDataSource = new kendo.data.DataSource({
                                                                                  data: result.dtos
                                                                              });
                          $("#discounts-list").data("kendoMobileListView").setDataSource(discountsDataSource);
                      },
                      error: function() {
                          alert("ERROR");
                      }
                  });
    },
    showStoreDiscount: function(evt) {
        var id = evt.view.params.id;
        Comm.post({
                      uri: "showStoreDiscountMobile",
                      data: {
                id: id
            },
                      success: function(result) {
                          console.log(result);
                          $("#store-discount-image").css("background-image", "url('" + result.url + "')");
                          Model.setStoreDiscount(result);
                      },
                      error: function() {
                          alert("ERROR!");
                      }
                  });        
    },
    showUserDiscount: function(evt) {
        var id = evt.view.params.id;
        Map.udMiniMapInit();
        Comm.post({
                      uri: "showUserDiscountMobile",
                      data: {
                id: id
            },
                      success: function(result) {
                          console.log(result);
                          $("#user-discount-image").css("background-image", "url('" + result.url + "')");
                          Model.setUserDiscount(result);
                          $("#want-button").attr("onclick", "Business.requestPromotion("+result.id+")");
                          Map.dropPinAtMiniMap(42.6954328, 23.3239465)
                      },
                      error: function() {
                          alert("ERROR!");
                      }
                  });
    },
    seeWhereIsDiscount: function() {
        app.navigate("#user-discount-big-map");
    },
    userDiscountBigMap: function() {
        Map.udBigMapInit(42.7, 23.4);
    },
    editDiscount:function(evt) {
        var id = evt.view.params.id;
        Log.i("Edit discount");
        var lat, lng, name, storeName, oldPrice, newPrice, expirationDate = "";
        if (Model.form.object.lat !== "" || Model.form.object.lng !== "") {
            lat = Model.form.object.lat;
            lng = Model.form.object.lng
        }
        if (Model.form.object.name !== "")
            name = Model.form.object.name;
        if (Model.form.object.storeName !== "")
            storeName = Model.form.object.storeName;
        if (Model.form.object.oldPrice !== "")
            oldPrice = Model.form.object.oldPrice;
        if (Model.form.object.newPrice !== "")
            newPrice = Model.form.object.newPrice;
        if (Model.form.object.expirationDate !== "")
            expirationDate = Model.form.object.expirationDate;
        Model.setForm({
                          submit: function() {
                              function success(result) {
                                  app.navigate("views/userDiscount.html?id=" + result.id);
                              }
                              Model.form.object.oldPrice = Math.ceil(Model.form.object.oldPrice * 100);
                              Model.form.object.newPrice = Math.ceil(Model.form.object.newPrice * 100);
                              console.log(Model.form.object);
                              Comm.post({
                                            uri: !id?"addDiscountApp":"editDiscountApp",
                                            data: Model.form.object,
                                            success: success
                                        });
                          },
                          cancel: function() {
                              $("#dImg").attr("src", "styles/1px.png");
                              app.navigate("#home");
                          },
                          name: name,
                          storeName: storeName,
                          oldPrice: oldPrice,
                          newPrice: newPrice,
                          lat: lat,
                          lng: lng,
                          photo: Cam.img,
                          expirationDate: expirationDate,
                          discountId: id
                      });
    },
    initEditDiscountMap: function() {
        Map.addDiscountMapInit();
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    Map.addDiscountPin(position.coords.latitude, position.coords.longitude)
                },
                function (error) {
                    Map.addDiscountPin(42.6985859, 23.321228);
                }, {
                    timeout: 3000,
                    enableHighAccuracy: true
                });
        }else {
            Map.addDiscountPin(42.6985859, 23.321228);
        }
    }, _openCamera:function() {
        Cam.getPhoto({
                         success: function(image) {
                             Model.form.object.photo = Cam.img; 
                         },
                         img: "dImg"
                     });
    },
    showStorePromotions: function(evt) {
        var id = evt.view.params.beaconId;
        Log.i("in showStorePromotions");
        Log.i(id);
        
        Comm.post({
                      uri: "beacon",
                      data: {
                beaconId: id
            },
                      success: function(result) {
                          Log.i(result);
                          var storePromotionsDataSource = new kendo.data.DataSource({
                                                                                        data: result.dtos
                                                                                    });
                          $("#store-promotions-list").data("kendoMobileListView").setDataSource(storePromotionsDataSource);
                      },
                      error: function() {
                          alert("ERROR HAPPENED!");
                      }
                  });
    },
    account: function() {
        Comm.post({
                      uri: "account",
                      success: function(result) {
                          console.log(result);
                          var accountDataSource = new kendo.data.DataSource({
                                                                                data: result.results
                                                                            });
                          $("#account-list").data("kendoMobileListView").setDataSource(accountDataSource);
                          
                      }
                  });
    },
    requestPromotion: function(id){
        Comm.post({
            uri: "willUseIt",
            data: {
                id: id
            },
            success: function(result){
                alert("You have requested this discount!");
            },
            error: function(){
                alert("ERROR HAPPENED!");
            }
        });
    },
    showStoreDiscountHistory: function(evt) {
        var id = evt.view.params.id;
        Comm.post({
                      uri: "showStoreDiscountMobile",
                      data: {
                id: id
            },
                      success: function(result) {
                          console.log(result);
                          $("#store-discount-image").css("background-image", "url('" + result.url + "')");
                          Model.setStoreDiscount(result);
                      },
                      error: function() {
                          alert("ERROR!");
                      }
                  });        
    },
    showUserDiscountHistory: function(evt) {
        var id = evt.view.params.id;
        var resultId = evt.view.params.resultId;
        var showButtons = evt.view.params.showButtons;
        Map.udhMiniMapInit();
        Comm.post({
                      uri: "showUserDiscountMobile",
                      data: {
                id: id
            },
                      success: function(result) {
                          console.log(result);
                          $("#user-discount-history-image").css("background-image", "url('" + result.url + "')");
                          Model.setUserDiscount(result);
                          if(showButtons){
                              $("#bought-button").attr("onclick", "Business.changeResult("+resultId+", "+result.id+", 1)");
                              $("#decline-button").attr("onclick", "Business.changeResult("+resultId+", "+result.id+", 2)");
                          } else {
                               $("#bought-button").hide();
                              $("#decline-button").hide;
                          }
                          
                          Map.dropPinAtMiniHMap(42.6954328, 23.3239465)
                      },
                      error: function() {
                          alert("ERROR!");
                      }
                  });
    },
    changeResult: function(resultId, discountId, action){
        Comm.post({
            uri: "changeResult",
            data: {
                resultId: resultId,
                discountId: discountId,
                action: action
            },
            success: function(result){
                if (action == 1){
                   alert("You said you bought this Promo!"); 
                } else {
                    alert("You declined this Promo!");
                }
            },
            error: function(){
                alert("ERROR HAPPENED!");
            }
            
        });
    }
};