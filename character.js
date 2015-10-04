//GLOBALS
var CHAR_WIDTH = 90;
var CHAR_HEIGHT = 140;
var NUM_POS_SPRITE = 5;
var ACTIONS_PER_TURN = 2;
var RANGE = 3;

function Character(name, hex, max_health, max_intel, img, strength, grid,
  width = CHAR_WIDTH, height = CHAR_HEIGHT, range = RANGE){
  this.name = name;
  this.max_health = max_health;
  this.max_intel = max_intel;
  this.health = max_health;
  this.intel = 0;
  this.strength = strength;
  this.range = range;
  this.position = hex;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = img;
  this.isAlive = true;
  this.actionsLeft = ACTIONS_PER_TURN;
  this.grid = grid;

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
  this.setIntel = function (new_intel){
    self.intel = new_intel;
  }
  this.setPosition = function(new_position){
    self.position = new_position;
  }

  this.setIsAlive = function(new_state){
    self.isAlive = new_state;
  }
  this.getActionsLeft = function(){
    return self.actionsLeft;
  }
  this.getGrid = function(){
    return self.grid;
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

  this.execute = function(command){
    command.execute(command.value, command.target);
  }

  return this;
}



// --------------- Command design pattern without undo --------------------------
function attack(value, target) { target.setHealth(target.health - value); }
function heal(value, target) { target.setHealth(target.health + value); }
function move(value, target){
  if(target.getActionsLeft() > 0){
    var tile = target.getGrid().getHashMap().get(keyCreator(value));
    if( tile != undefined && tile.isWalkable){
      target.setPosition(value);
    }else{
      console.log("Cannot move to this tile");
    }

  }
} // TODO check if tile is walkable

var Command = function (execute, value, target) {
    this.execute = execute;
    this.value = value;
    this.target = target;
}
var AttackCommand = function (value, target) {
    return new Command(attack, value, target);
};

var HealCommand = function (value, target) {
    return new Command(heal, value, target);
};
var MoveCommand = function(value, target){
  return new Command(move, value, target);
}
