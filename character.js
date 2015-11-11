//GLOBALS
var CHAR_WIDTH = 90;
var CHAR_HEIGHT = 140;
var NUM_POS_SPRITE = 5;
var ACTIONS_PER_TURN = 2;
var RANGE = 3;
var FIRERANGE = 1;

function Character(name, hex, max_health, max_intel, img, strength, grid,
  width = CHAR_WIDTH, height = CHAR_HEIGHT, range = RANGE, fireRange = FIRERANGE){ //TODO Make it proper with constants
  this.name = name;
  this.max_health = max_health;
  this.max_intel = max_intel;
  this.health = max_health;
  this.intel = 0;
  this.tmp_health = max_health;
  this.tmp_intel = 0;
  this.strength = strength;
  this.range = range;
  this.fireRange = fireRange;
  this.position = hex;
  this.tmp_position = hex;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = img;
  this.isAlive = true;
  this.actionsLeft = ACTIONS_PER_TURN;
  this.tmp_actionsLeft = this.actionsLeft;
  this.grid = grid;

  var self = this;
  (function init(){ // Init is done only once when creating the object setting the tile to occupied
   self.grid.getHashMap().get(keyCreator(self.position)).isFree = false;
  })();

  return this;
}

Character.prototype.setMaxHealth = function (new_max_health){
  this.max_health = new_max_health;
};
Character.prototype.setMaxHealth = function (new_max_intel){
  this.max_intel = new_max_intel;
};
Character.prototype.setHealth = function (new_health){
  this.tmp_health = new_health;
};
Character.prototype.setIntel = function (new_intel){
  this.tmp_intel = new_intel;
};
Character.prototype.setPosition = function(new_position){
  this.tmp_position = new_position;
};

Character.prototype.setIsAlive = function(new_state){
  this.isAlive = new_state;
};
Character.prototype.getActionsLeft = function(){
  return this.actionsLeft;
};
Character.prototype.getGrid = function(){
  return this.grid;
};
Character.prototype.getPosition = function(){
  return this.position;
};
Character.prototype.getY = function(){
  return hex_to_pixel(layout, this.position).y;
};

Character.prototype.decActionsNum = function(){
  this.tmp_actionsLeft = this.actionsLeft - 1;
};

Character.prototype.draw = function(layout, ctx){
  var pos = hex_to_pixel(layout, this.position);
  var self = this;
  ctx.drawImage(self.image, NUM_POS_SPRITE * CHAR_WIDTH, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
};

Character.prototype.execute = function(command){
  if(this.actionsLeft >= 0){
    command.execute(command.value, command.target);

  }
  else{
    console.log("Not enough actions left");
  }
};

Character.prototype.update = function(){
  this.health = this.tmp_health;
  this.actionsLeft = this.tmp_actionsLeft;
  this.intel = this.tmp_intel;
  this.position = this.tmp_position;
  if(this.health <= 0 ){
    this.isAlive = false;
  }
};

function Enemy(name, hex, max_health, max_intel, img, strength, grid,
  width = CHAR_WIDTH, height = CHAR_HEIGHT, range = RANGE, fireRange = FIRERANGE){
  this.base = Character;
  this.base(name, hex, max_health, max_intel, img, strength, grid,
    width = CHAR_WIDTH, height = CHAR_HEIGHT, range = RANGE, fireRange = FIRERANGE);
  return this;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Character;
Enemy.prototype.parent = Character.prototype;

Enemy.prototype.update = function(){
  this.getClosestCharacter();

  /*
If enemy is in firing range
*/

/*
  if enemy is the weakest
    Attack
else
  move to closest(A*)  enemy get closest enemy (Radius)
   */

};

Enemy.prototype.getClosestCharacter = function(){
  var characters = SceneManager.getInstance().getCurrentScene().getAllies();
  var self = this;
  if(characters){
    //Sorting the array to find the closest character from the enemy (this)
    characters.sort(function(a ,b){
      console.log("This", self);
      var distSelf = self.getPosition();
      var distA = hex_distance(a.getPosition(), distSelf);
      var distB = hex_distance(b.getPosition(), distSelf);
      return distA - distB;
    });
    console.log(characters[0]);
    return characters[0];
  }else{
    console.error("Error: Allies array is empty!");
  }
};

Enemy.prototype.getInFiringRange = function(){

}
