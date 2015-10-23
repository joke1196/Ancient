//---------- CODE BY Seth Ladd ------------------------
//---------- http://www.html5rocks.com/en/tutorials/games/assetmanager/

var AssetManager =  new function AssetManager() {
  var instance = this;
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
  this.fileQueue = undefined;
  this.queueLength  = 0;
  this.fileDestination = undefined;

  //Static method
  AssetManager.getInstance = function(){
    return instance;
  }
  return AssetManager;
}


AssetManager.prototype.queueDownload = function(paths) {
    this.downloadQueue = paths;
}
AssetManager.prototype.queueFile = function(level) {
    this.fileQueue = "assets/map/" + level;
}

AssetManager.prototype.downloadAll = function(downloadCallback, fileDestination) {
  this.successCount = 0;
  this.errorCount = 0;
  this.queueLength = this.downloadQueue.length + 1; // Added one for the file TODO MAKE A PROMISE POOL FOR FILE
  if (this.queueLength === 0) {
      downloadCallback();
  }
  var self = this;
  Promise.all(this.getImagesPromisePool())
    .then(this.getFilePromise(fileDestination))
    .then(downloadCallback);

//Modification by FooBar

    // DO NOT REMOVE YET
  //   var img = new Image();
  //   var that = this;
  //   img.addEventListener("load", function() {
  //     that.successCount += 1;
  //     if (that.isDone()) {
  //         downloadCallback();
  //     }
  //   }, false);
  //   img.addEventListener("error", function() {
  //     that.errorCount += 1;
  //     if (that.isDone()) {
  //         downloadCallback();
  //     }
  //   }, false);
  //   img.src = path;
  // this.getFilePromise(levelManager.getCurrentLevel().getName()).then(function(response){
  //   mapArray = JSON.parse(response);
  //   // console.log("Success!", response);
  //   // self.successCount += 1;
  // }, function(error){
  //   // console.log("Error", error);
  //   // self.errorCount += 1;
  // }).then(this.getImagesPromise(path).then(function(response){
  //   console.log("Success!", response);
  //   self.successCount += 1;
  //
  //   }, function(error){
  //     console.log("Error", error);
  //     self.errorCount += 1;
  //   });
  // });

}

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
        console.log("Error", error);
        self.errorCount += 1;
        reject(img);
      }, false);
      img.src = path;
    }));
  }
  return promisePool;
}
AssetManager.prototype.getFilePromise = function(){
  var client = new XMLHttpRequest();
  var self = this;
  return new Promise(function(resolve, reject){
    client.open('GET', self.fileQueue);
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
  });
}

AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
}

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}
//Modification by FooBar
AssetManager.prototype.update = function(){
  if(this.downloadQueue.length !== 0 ){
    return   ((this.successCount + this.errorCount) * 100) / (this.downloadQueue.length + 1) ;
  }
  return 0;
}
AssetManager.prototype.getFileDestination = function(){
  return this.fileDestination;
}
