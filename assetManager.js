//---------- CODE BY Seth Ladd ------------------------
//---------- http://www.html5rocks.com/en/tutorials/games/assetmanager/

var AssetManager =  new function AssetManager() {
  var instance = this;
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];

  //Static method
  AssetManager.getInstance = function(){
    return instance;
  }
  return AssetManager;
}


AssetManager.prototype.queueDownload = function(paths) {
    this.downloadQueue = paths;
}

AssetManager.prototype.downloadAll = function(downloadCallback) {
  if (this.downloadQueue.length === 0) {
      downloadCallback();
  }
  for (var index = 0; index < this.downloadQueue.length; index++) {
    var path = this.downloadQueue[index];
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
  var self = this;

  //Modification by FooBar
  this.getImages(path).then(function(response){
    console.log("Success!", response);
    self.successCount += 1;

  }, function(error){
    console.log("Error", error);
    self.errorCount += 1;
  });
  }
}

AssetManager.prototype.getImages = function(path){
  var self = this;
  return new Promise(function(resolve, reject){
    var img = new Image();
    img.addEventListener("load", function() {
      self.cache[path] = img;
      resolve(img);
    }, false);
    img.addEventListener("error", function() {
      reject(img);
    }, false);
    img.src = path;
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
    return   ((this.successCount + this.errorCount) * 100) / this.downloadQueue.length;
  }
  return 0;
}
