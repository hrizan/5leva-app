var Model = kendo.observable({
    
    userDiscount: {},
    storeDiscount: {},
    setUserDiscount: function(ud){
        ud.oldPrice = ud.oldPrice/100 + " lv.";
        ud.newPrice = ud.newPrice/100 + " lv.";
        Model.set("userDiscount", ud);
    },
    setStoreDiscount: function(sd){
        sd.oldPrice = sd.oldPrice/100 + " lv.";
        sd.newPrice = sd.newPrice/100 + " lv.";
        Model.set("storeDiscount", sd);
    }
});