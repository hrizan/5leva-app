/***
v.0.2
*/
var Storage = {
    
    _db: {},
    FACEBOOK_TOKEN: 1,
    PASSWORD: 2,
    ACCOUNT_KEY: 3,
    _password: "password",
    _useLocalStorage:true, 
    _switchToLocalStorage: function(){
        Storage._useLocalStorage = true;
        Log.i("Will use local storage");
       // Storage.storePassword("");
    }, 
    _errorOnDbOpenDataBase: function(e){
        Log.i("Error while opening database: "+e);
        Report.errorOnDbOpen(e);
        Storage._switchToLocalStorage(); 
      //  Storage.onInitComplete(true);
        
    }, 
    
    _errorOnUserTableCreate: function(e){
       Log.i("Cannot create user table "+e);
       Report.errorOnDbCreate(e);
       Storage._switchToLocalStorage();
       Storage.onInitComplete(true);
    }, 
    _successOnDbOpenDataBase: function(){
       Log.i("Database is successfully opened"); 
    }, 
    onInitComplete: function(withSqlite){ 
        Log.i("Storage is successfully initialized");
        Report.storageInitComplete(); 
        Log.i(JSON.stringify(Report.report));
        
         Storage._complete(withSqlite);
    },
    _complete:{},
    init: function(options) {
       Log.i("Starting initialization of storage");
       if (!options || typeof options.complete != 'function')
           throw "no callback named 'complete' in init options.";
        
        Storage._complete=options.complete;
      //localStorage.removeItem(Storage._getKey(Storage.PASSWORD));
       
       if (window.sqlitePlugin && !Storage._useLocalStorage){
           Storage._db = window.sqlitePlugin.openDatabase({name: "user_data", bgType: 1},[],Storage._errorOnDbOpenDataBase);
           Log.i("Creating table user_data");
           Storage._db.transaction( 
                function(tx) {   
                   //tx.executeSql("DROP TABLE if exists user_data");
                	tx.executeSql("CREATE TABLE IF NOT EXISTS user_data (data_type integer, data_content TEXT)");
                }, Storage._errorOnUserTableCreate, Storage.onInitComplete);
       } else {
           Log.i("Using local storage"); 
           Report.sqliteIsNull(true);
           Storage._switchToLocalStorage();
           Storage.onInitComplete(true);
       }
    },
    _storeData: function(type, value, callback) { //type: 1-FB access token; 2-password, 
        if (typeof callback !='function')
            callback = function(){
                Log.i("Successfully stored");
            }
        
        if (Storage._usingLocalStorage()){
            var key = type;//Storage._getKey(type); 
            Log.i("Storing key "+key+" in local storage");
        	localStorage.setItem(key, value);
            callback();
        } else {
            Storage._db.transaction(function(tx) {
                tx.executeSql("SELECT data_content FROM user_data WHERE data_type=" + type + ";",[ ], function(tx, result) {
                   
                    if (result.rows && result.rows.length>0) {
                        Log.i("Updating user tokens");
                        Storage._db.transaction(function(tx) {
                            tx.executeSql("UPDATE user_data SET data_content='" + value + "' WHERE data_type='" + type + "'");
                        }, [], callback,Report.errorOnTxStore);
                    } else {
                        Log.i("Inserting user tokens");
                        Storage._db.transaction(function(tx) {
                            tx.executeSql("INSERT INTO user_data (data_type, data_content) VALUES ('" + type + "', '" + value + "');");
                        }, [], callback,Report.errorOnTxStore);
                    }
                }, Report.errorOnDbStore); 
            });
        }
    },
    
    storePassword: function(password, callback){
		Storage._storeData(Storage.PASSWORD, password, callback);
    },
    storeFacebookToken: function(token, callback){
        Storage._storeData(Storage.FACEBOOK_TOKEN, token, callback);
    },
    _usingLocalStorage: function(){
        return Storage._useLocalStorage;
    },
    getPassword: function(success) {
        Storage._getData(Storage.PASSWORD, success);
    },
    getFacebookToken: function(success){
        Storage._getData(Storage.FACEBOOK_TOKEN, success);  
    },
    getPointsProfile: function(success){
         Storage._getData(Storage.ACCOUNT_KEY, success);
    },
    storePointsProfile: function(data){
        Storage._storeData(Storage.ACCOUNT_KEY, data);
    },
    _getData: function(type, callback) {
        console.log("Getting data "+type);
        if (Storage._usingLocalStorage()){
           var key = type+"";//Storage._getKey(type);
           callback(localStorage.getItem(key));
        } else {
            Storage._db.transaction(function(tx) {
                tx.executeSql("SELECT data_content FROM user_data WHERE data_type=" + type+";", [],
                  function(tx, result) {
                  	Log.i("Selecting value from user_data with type "+type);
                      
    					var dataContent;
                      if (result.rows.length>0) 
                      	dataContent = result.rows.item(0).data_content;
                      callback(dataContent); 
                  },
                  Report.errorOnTxSelect);
            }, Report.errorOnDbSelect);
        }
    }
};
