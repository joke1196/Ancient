
//Base code from
////---------- CODE BY Seth Ladd ------------------------
//---------- http://www.html5rocks.com/en/tutorials/games/assetmanager/
// Lot of modification have been made
/**
 * This singletong manages the loading of the assets of the game
 */
var AssetManager =  new function AssetManager() {
  var instance = this;
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
  this.mapQueue = [];
  this.dialogQueue = [];
  this.soundQueue = [];
  this.queueLength  = 0;
  this.fileDestination = [];
  this.mapArray;
  this.dialogs= [];
  this.soundMap = new Map();
  this.audioCtx = undefined;

  //Static method
  AssetManager.getInstance = function(){
    return instance;
  }
  return AssetManager;
}();

//Every images that should be loaded
AssetManager.prototype.queueDownload = function(paths) {
    this.downloadQueue = paths;
};
//Sounds that should be loaded
AssetManager.prototype.queueSoundFiles = function(paths, context){
  this.soundQueue = paths;
  this.audioCtx = context;
};
//Map file to be loaded
AssetManager.prototype.queueMap = function(path) {
    this.mapQueue = path;
};
//Dialog file to be loaded
AssetManager.prototype.queueDialog = function(path) {
    this.dialogQueue = path;
};
//Loading all the assest
AssetManager.prototype.downloadAll = function(downloadCallback, fileDestination) {
  this.successCount = 0;
  this.errorCount = 0;
  this.dialogs = [];
  this.queueLength = this.downloadQueue.length + this.mapQueue.length + this.soundQueue.length;
  if (this.queueLength === 0) {
      downloadCallback();
  }else {
    var self = this;
    //Making an array of promises to be resolve
    var promises = Array.concat(this.getImagesPromisePool(), this.getSoundsPromisePool(), this.getMapPromise(fileDestination), this.getDialogPromise());
    Promise.all(promises).then(function(){
      this.downloadQueue = [];
      this.fileQueue = [];
      this.soundQueue = [];
      //Call back after the competion of the pormises
      downloadCallback();
    });
  }
};

AssetManager.prototype.getImagesPromisePool = function(){
  var self = this;
  var promisePool = [];
  for (var index = 0; index < this.downloadQueue.length; index++) {
    var path = this.downloadQueue[index];
    promisePool.push(new Promise(function(resolve, reject){
      var img = new Image();
      img.addEventListener("load", function() {
        self.cache[path] = img;
        self.successCount += 1;
        resolve(img);
      }, false);
      img.addEventListener("error", function() {
        self.errorCount += 1;
        reject(img);
      }, false);
      img.src = path;
    }));
  }
  return promisePool;
};

AssetManager.prototype.getMapPromise = function(){
  var self = this;
  var client = new XMLHttpRequest();
  var path = this.mapQueue[0];
  return new Promise(function(resolve, reject){
      if(self.mapQueue.length > 0){
        client.open('GET', path,true);
        client.onreadystatechange = function() {
          if(client.readyState === 4){ // done
            if(client.status === 200){
              self.successCount += 1;
              var response = JSON.parse(client.responseText);
              self.mapArray = response;
              resolve(client.responseText);
            }else{
              console.log("Error", client.responseText);
              self.errorCount += 1;
              reject(client.responseText);
            }
          }
        };

        client.send();
      }
      resolve();
    });
};
AssetManager.prototype.getDialogPromise = function(){
  var self = this;
  var client = new XMLHttpRequest();
  var path = this.dialogQueue[0];
  return new Promise(function(resolve, reject){
      if(self.dialogQueue.length > 0){
        client.open('GET', path,true);
        client.onreadystatechange = function() {
          if(client.readyState === 4){ // done
            if(client.status === 200){
              self.successCount += 1;
              var response = JSON.parse(client.responseText);
              self.dialogs = response;
              resolve(client.responseText);
            }else{
              console.log("Error", client.responseText);
              self.errorCount += 1;
              reject(client.responseText);
            }
          }
        };

        client.send();
      }
      resolve();
    });
};

AssetManager.prototype.getSoundsPromisePool = function(){
  var self = this;
  var promisePool = [];
  this.soundMap = new Map();
  for(var index in this.soundQueue){
    var request = new XMLHttpRequest();
    promisePool.push(new Promise(function(resolve, reject){
      request.open("GET", self.soundQueue[index], true);
      console.log("Queue", self.soundQueue[index]);
      var name = self.soundQueue[index].replace("assets/sounds/", "");
      request.responseType = "arraybuffer";
      request.onload = function() {
      // Asynchronously decode the audio file data in request.response
        self.audioCtx.decodeAudioData(
          this.response,
          function(buffer) {
            if (!buffer) {
              console.log('error decoding file data: ' + url);
              self.errorCount += 1;
              reject(buffer);
            }

            self.soundMap.put(name, buffer);
            console.log("in promise", self.soundMap);
            self.successCount += 1;
            resolve(buffer);
          },
          function(error) {
            console.error('decodeAudioData error', error);
            self.errorCount += 1;
            reject(error);
          }
          );
        };
        request.send();
        request.onerror = function() {
          console.error('SoundManager: XHR error');
          self.errorCount += 1;
        };
      }));
  }

  return promisePool;
};
//Returning the name the the resources loaded
AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
};
//Returning the name the the resources loaded
AssetManager.prototype.getSoundMap = function(){
  return this.soundMap;
};

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
};

AssetManager.prototype.update = function(){
  if(this.downloadQueue.length !== 0 || this.mapQueue !== 0 || this.soundQueue !== 0 || this.dialogQueue !== 0){
    return   ((this.successCount + this.errorCount) * 100) / (this.downloadQueue.length + this.soundQueue.length + this.mapQueue.length + this.dialogQueue.length) ;
  }
  return 0;
};
//Returning the name the the resources loaded
AssetManager.prototype.getMapArray = function(){
  return this.mapArray;
};
//Returning the name the the resources loaded
AssetManager.prototype.getDialogs = function(){
  return this.dialogs;
};
