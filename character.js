//GLOBALS
var CHAR_WIDTH = 90;
var CHAR_HEIGHT = 140;
var NUM_POS_SPRITE = 5;
var ACTIONS_PER_TURN = 2;

function Character(name, hex, max_health, max_intel, img, width = CHAR_WIDTH, height = CHAR_HEIGHT){
  this.name = name;
  this.max_health = max_health;
  this.max_intel = max_intel;
  this.health = max_health;
  this.intel = max_intel;
  this.position = hex;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = img;
  this.isAlive = true;
  this.actionsLeft = ACTIONS_PER_TURN;

  var self = this; // added because of context problem
  this.setMaxHealth = function (new_max_health){
    self.max_health = new_max_health;
  }
  this.setMaxHealth = function (new_max_intel){
    self.max_intel = new_max_intel;
  }
  this.setHealth = function (new_health){
    self.health = new_health;
  }
  this.setHealth = function (new_intel){
    self.intel = new_intel;
  }

  this.setIsAlive = function(new_state){
    self.isAlive = new_state;
  }

  this.decActionsNum = function(){
    self.actionsLeft = actionsLeft - 1;
  }

  this.draw = function(layout, ctx){
    var pos = hex_to_pixel(layout, self.position);
    self.image.onload = function (){
      ctx.drawImage(self.image, NUM_POS_SPRITE * CHAR_WIDTH, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
    }

  }
  return this;
}
