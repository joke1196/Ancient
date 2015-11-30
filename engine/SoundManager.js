
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
SoundManager.prototype.play = function(fileName,volume = 1.0, loop = false){
  var source = this.context.createBufferSource();
  var gainNode = this.context.createGain();
  source.buffer = this.bufferMap.get(fileName);
  source.connect(gainNode);
  gainNode.connect(this.context.destination);
  source.loop = loop;
  source.start(0);
  gainNode.gain.value = volume;
  this.sourceMap.put(fileName, source);
};

SoundManager.prototype.stop = function(fileName){
  this.sourceMap.get(fileName).stop();
};
