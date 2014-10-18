var Model = {
    init: function(){
        Model.form = kendo.observable({object:{}});
    },
    form:{},
    userDiscount: kendo.observable({}),
    storeDiscount: kendo.observable({}),
    setUserDiscount: function(ud){
        ud.oldPrice = ud.oldPrice/100 + " lv.";
        ud.newPrice = ud.newPrice/100 + " lv.";
        Model.userDiscount.set("u", ud);
    },
    setStoreDiscount: function(sd){
        sd.oldPrice = sd.oldPrice/100 + " lv.";
        sd.newPrice = sd.newPrice/100 + " lv.";
        Model.storeDiscount.set("s", sd);
    },
    setFormCancel: function(callback){
        
        Model.form.object.cancel = callback;
    },
    setForm: function(options){
        
        //options.cancel = Model.form.object.cancel;
        console.log("Setting form object", options);
        
        Model.form.set("object", options);
        //Model.form.object.cancel = null;
    },
    submitform: function(){
		
        if (Model.form.object && typeof Model.form.object.submit == "function"){
			Model.form.object.submit();
			console.log("Submiting form");
		}else{
           // UI.showAlert("Не са попълнени всички полета.");
			console.log("No submit method in form.object");
		}		
    },
    cancelform: function(){
        if (Model.form.object && typeof Model.form.object.cancel == "function"){
			Model.form.object.cancel();
			console.log("Canceling form");
		}else{
            app.navigate("#:back");
            console.log("No cancel method in form.object");
		}
    }
};