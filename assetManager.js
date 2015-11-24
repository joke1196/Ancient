//---------- CODE BY Seth Ladd ------------------------
//---------- http://www.html5rocks.com/en/tutorials/games/assetmanager/

var AssetManager =  new function AssetManager() {
  var instance = this;
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
  this.fileQueue = [];
  this.soundQueue = [];
  this.queueLength  = 0;
  this.fileDestination = undefined;
  this.soundMap = new Map();
  this.audioCtx = undefined;

  //Static method
  AssetManager.getInstance = function(){
    return instance;
  }
  return AssetManager;
}();


AssetManager.prototype.queueDownload = function(paths) {
    this.downloadQueue = paths;
};
AssetManager.prototype.queueSoundFiles = function(paths, context){
  this.soundQueue = paths;
  this.audioCtx = context;
};
AssetManager.prototype.queueFile = function(level) {
    this.fileQueue[0] = "assets/map/" + level; //TODO passing level as arrays
};

AssetManager.prototype.downloadAll = function(downloadCallback, fileDestination) {
  this.successCount = 0;
  this.errorCount = 0;
  this.queueLength = this.downloadQueue.length + this.fileQueue.length + this.soundQueue.length; // Added one for the file TODO MAKE A PROMISE POOL FOR FILE
  if (this.queueLength === 0) {
      downloadCallback();
  }else {
    var self = this;
    var promises = Array.concat(this.getImagesPromisePool(), this.getSoundsPromisePool(), this.getFilePromise(fileDestination));
    console.log("Promises",promises);
    Promise.all(promises).then(function(){
      this.downloadQueue = [];
      this.fileQueue = [];
      this.soundQueue = [];
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
        console.log("Success!", img);
        self.successCount += 1;
        resolve(img);
      }, false);
      img.addEventListener("error", function() {
        console.log("Error", img);
        self.errorCount += 1;
        reject(img);
      }, false);
      img.src = path;
    }));
  }
  return promisePool;
};

AssetManager.prototype.getFilePromise = function(){
  var client = new XMLHttpRequest();
  var self = this;
  var promisePool = [];
  for(var index in this.fileQueue){
    promisePool.push(new Promise(function(resolve, reject){
      console.log(self.fileQueue[index]);
      if(self.fileQueue.length > 0){
        client.open('GET', self.fileQueue[index]);
        client.onreadystatechange = function() {
          if(client.readyState === 4){ // done
            if(client.status === 200){
              console.log("Success!");
              self.successCount += 1;
              self.fileDestination = JSON.parse(client.responseText);
              resolve(client.responseText);
            }else{
              console.log("Error", error);
              self.errorCount += 1;
              reject(client.responseText);
            }
          }
        };

        client.send();
      }
      resolve();
    }));
  }
  return promisePool;
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

AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
};

AssetManager.prototype.getSoundMap = function(){
  return this.soundMap;
};

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
};
//Modification by FooBar
AssetManager.prototype.update = function(){
  if(this.downloadQueue.length !== 0 || this.fileQueue !== 0 || this.soundQueue !== 0 ){
    return   ((this.successCount + this.errorCount) * 100) / (this.downloadQueue.length + this.soundQueue.length + this.fileQueue.length) ;
  }
  return 0;
};
AssetManager.prototype.getFileDestination = function(){
  return this.fileDestination;
};
