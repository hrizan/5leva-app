var Report = {
  report:{},
  all: function(arg){
      Log.i(arg);
  },
  sqliteIsNull: function(e){
     Log.i(e);
    	Report.report['sqliteIsNull']=e;
  },
   errorOnDbOpen: function(e){
       Log.i(e);
       Report.report['errorOnDbOpen']=e;
   },
    errorOnDbCreate: function(e){
        Log.i(e);
        Report.report['errorOnDbCreate']=e;
    }, 
    errorOnTxSelect: function(e){
       Log.i(e);
        Report.report['errorOnTxSelect']=e;
    }, 
    errorOnDbSelect:function(e){
        Log.i(e);;
        Report.report['errorOnDbSelect']=e;
    }
    , 
    errorOnDbStore:function(e){
      Log.i(e);
        Report.report['errorOnDbStore']=e;
    }
    , 
    errorOnTxStore:function(e){
        Log.i(e);
        Report.report['errorOnTxStore']=e;
    }, storageInitComplete:function(){
        Report.report['storageComplete']=true;
    }
};