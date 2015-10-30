

var MESSAGE_DEFAULT_HEIGHT = 50;
var MESSAGE_DEFAULT_WIDTH = 600;
var MESSAGE_DEFAULT_COLOR = "black";
function Message(){
  this.color = MESSAGE_DEFAULT_COLOR;
  this.position = undefined;
  this.label = undefined;
  this.width = MESSAGE_DEFAULT_WIDTH;
  this.height = MESSAGE_DEFAULT_HEIGHT;
  this.background = undefined;
  this.ctx = undefined;
  return this;
}

Message.prototype.draw = function(){}

Message.prototype.setBackground = function(url){
  this.background = url;
}
Message.prototype.setHeight = function(height){
  this.height = height;
}
Message.prototype.setWidth = function(width){
  this.width = width;
}

function TopMessage(messageType, label, duration, ctx){
  this.position = new Point(0,0);
  this.messageType = messageType;
  this.label = label;
  this.duration = duration;
  this.ctx = ctx;
  return this;
}

TopMessage.prototype = Object.create(Message.prototype);

TopMessage.prototype.draw = function(){
  if(this.background !== undefined){
    this.ctx.drawImage(this.background, this.position.x,this.position.y, this.width,this.height);
  }
  this.ctx.fontStyle = this.messageType;
  this.ctx.font="80px Georgia";
  this.ctx.fillText(this.label,this.position.x,this.position.y);
}
