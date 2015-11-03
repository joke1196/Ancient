
var SoundManager =  new function SoundManager() {
  var instance = this;
  this.successCount = 0;
  this.errorCount = 0;
  this.context= undefined;
  this.bufferList = [];
  this.bufferMap = undefined;
  this.loadCount = 0;
  this.sourceMap = new Map();

  //Static method
  SoundManager.getInstance = function(){
    return instance;
  };
  return SoundManager;
}();

SoundManager.prototype.setContext = function(audioCtx){
  this.context = audioCtx;
};

SoundManager.prototype.setSoundMap = function(bufferMap){
  this.bufferMap = bufferMap;
};
SoundManager.prototype.getSoundMap = function(){
  return this.bufferMap;
};

SoundManager.prototype.play = function(fileName){

  var source = this.context.createBufferSource();
  source.buffer = this.bufferMap.get(fileName);
  console.log("The source : ", source);
  source.connect(this.context.destination);
  source.start(0);
  this.sourceMap.put(fileName, source);
};
SoundManager.prototype.stop = function(fileName){
  this.sourceMap.get(fileName).stop();
};
