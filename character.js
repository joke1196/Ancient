//GLOBALS
var CHAR_WIDTH = 100;
var CHAR_HEIGHT = 100;
var ENV_WIDTH = 100;
var ENV_HEIGHT = 125;
var ACTIONS_PER_TURN = 2;
var RANGE = 2;
var FIRERANGE = 1;
var TIMEOFFSET = 100;
var DAMAGE_YOFFSET = 10;
var END_TAKE_DAMAGE = 50;
var ALIVE_SPRITE = 0;
var DEAD_SPRITE = 1;
/**
 * Environment is the "Class" representing an entity in on a tile during the play scene
 * @param {Hex} position  is the position of the entity on the grid
 * @param {String} sprite   is the path to the image representing the entity
 * @param {Grid} grid     is the grid on which the battle will take place
 * @param {int} width    = ENV_WIDTH  is the width of the entity
 * @param {int} height   = ENV_HEIGHT is the height of the entity
 */
function Environment(position, sprite, grid, width = ENV_WIDTH, height = ENV_HEIGHT){
  this.position = position;
  this.image = new Image();
  this.image.src = sprite;
  this.height = height;
  this.width = width;
  this.grid = grid;
  var self = this;
  (function init(){ // Init is done only once when creating the object setting the tile to occupied
   self.grid.getHashMap().get(keyCreator(self.position)).occupiedBy = self;
  })();
}

Environment.prototype.draw = function(layout, ctx){
  var pos = hex_to_pixel(layout, this.position);
  var self = this;
  ctx.drawImage(self.image, 0, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
};
//Return the position as X Y coordinates from an Entity
//this is used to sort the entities before drawing them
Environment.prototype.getXY = function(){
  return hex_to_pixel(layout, this.position);
};
Environment.prototype.getType = function(){
  return "Environment";
};


Character.prototype = Object.create(Environment.prototype);
Character.prototype.constructor = Environment;
Character.prototype.parent = Environment.prototype;

function Character(name, hex, max_health, max_intel, img, strength, grid,
  width = CHAR_WIDTH, height = CHAR_HEIGHT, range = RANGE, fireRange = FIRERANGE){ //TODO Make it proper with constants
  this.base = Environment;
  this.base(hex, img, grid,
    width = CHAR_WIDTH, height = CHAR_HEIGHT);
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
  this.takingDamage = { "isDamaged" : false, "value": 0, "damageFrameIndex" : 0 };

  this.tmp_position = hex;

  this.isAlive = true;
  this.actionsLeft = ACTIONS_PER_TURN;
  this.tmp_actionsLeft = this.actionsLeft;

  this.td = 0;


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

//This function has to be called in conjunction with setPosition
//In order for the hashmap to be updated
Character.prototype.setGrid = function(grid){
  this.grid = grid;
};
Character.prototype.setActionsLeft = function(new_actionsLeft){
  this.tmp_actionsLeft = new_actionsLeft;
};
Character.prototype.setIsAlive = function(new_state){
  this.isAlive = new_state;
};

Character.prototype.getName = function(){
  return this.name;
};
Character.prototype.getIntel = function(){
  return this.intel;
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
Character.prototype.getHealth = function(){
  return this.health;
};
Character.prototype.getY = function(){
  return hex_to_pixel(layout, this.position).y;
};
Character.prototype.getXY = function(){
  return hex_to_pixel(layout, this.position);
};
Character.prototype.getType = function(){
  return "Character";
};

Character.prototype.decActionsNum = function(){
  this.tmp_actionsLeft = this.actionsLeft - 1;
};

Character.prototype.draw = function(layout, ctx){
  var pos = hex_to_pixel(layout, this.position);
  var self = this;
  if(this.isAlive){
    ctx.drawImage(self.image, ALIVE_SPRITE * CHAR_WIDTH, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
    if(this.takingDamage.isDamaged){
      //Showing the damage
      if(mod(this.takingDamage.damageFrameIndex, 5)===0){
        ctx.fillStyle = "white";
      }else{
        ctx.fillStyle = "red" + DEFAULT_FONT;
      }
      ctx.fillText(this.takingDamage.value, pos.x, pos.y - this.height + mod(this.takingDamage.damageFrameIndex *DAMAGE_YOFFSET, 10));
    }
  }else{
    ctx.drawImage(self.image, DEAD_SPRITE * CHAR_WIDTH, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
  }
};
//Executing a command
Character.prototype.execute = function(command){
  if(this.actionsLeft >= 0){
    command.execute(command.value, command.target, command.self);
  }
  else{
    console.log("Not enough actions left");
  }
};
//This method is call when a character is taking damage
Character.prototype.onTakeDamage = function(value){
  this.takingDamage.isDamaged = true;
  this.takingDamage.value = value ;
  this.takingDamage.damageFrameIndex = 0;
};
//Modifiying setting the character attributes
Character.prototype.update = function(td){
  if(this.isAlive){
    this.health = this.tmp_health;
    this.actionsLeft = this.tmp_actionsLeft;
    this.intel = this.tmp_intel;
    this.grid.getHashMap().get(keyCreator(this.position)).occupiedBy = null;
    this.position = this.tmp_position;
    this.grid.getHashMap().get(keyCreator(this.position)).occupiedBy = this;
    if(this.health <= 0 ){
      this.isAlive = false;
      this.actionsLeft = 0;
    }
    this.td++;
    if(this.takingDamage.isDamaged){
      if(this.takingDamage.damageFrameIndex++ > END_TAKE_DAMAGE){
        this.takingDamage.isDamaged = false;
        this.takingDamage.damageFrameIndex = 0;
        this.takingDamage.value = 0;
      }
    }
  }
};

//This class represent the AI
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
Enemy.prototype.update = function(td){
  this.parent.update.call(this, td);
};
//The sequence of the AI is to fire the weakest enemy if there is one in the range of fire
//If not the AI moves to the closest character
Enemy.prototype.play = function(){
  if(this.isAlive){
    if(this.td >= TIMEOFFSET){
      this.td = 0;
      if(this.actionsLeft > 0){
        var inAttackDist = this.getInFireRange();
        console.log("Range:", inAttackDist.length);
        if(inAttackDist.length > 0){
          if(inAttackDist.length >= 1){
            //Attack the character in range with the less health
            this.execute(new AttackCommand(this.strength,  minInArray(inAttackDist, Character.prototype.getHealth), this));
          }
        }else {
          //Find the closest character and move in its direction
          var char = this.getClosestCharacter();
          var inRange = this.getInRange(this.range);
          var tile = this.getClosestTileToChar(inRange, char);
          this.execute(new MoveCommand(tile.hex, this, this));
        }
      }

    }
  }
};

Enemy.prototype.draw = function(layout, ctx){
  this.parent.draw.call(this, layout,ctx);
};

Enemy.prototype.getType = function(){
  return "Enemy";
};
//Return the closest character
Enemy.prototype.getClosestCharacter = function(){
  var characters = SceneManager.getInstance().getCurrentScene().getAllies();
  var self = this;
  if(characters){
    //Sorting the array to find the closest character from the enemy (this)
    characters.sort(function(a ,b){ // TODO use find min in array
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
//Return an array of all the characters in range of fire
Enemy.prototype.getInFireRange = function(){

  var range = getHexInRadius(this.fireRange, this.position);
  var charInRange = [];
  var char ;
  for(var hex in range){
    var tile = this.grid.getHashMap().get(keyCreator(range[hex]));
    if(tile !== undefined){
      char = tile.occupiedBy;
      if(char !== null && char.getType() === "Character"){
        charInRange.push(char);
      }
    }

  }
  return charInRange;
};
//Returns an array of the possible tiles to move to
Enemy.prototype.getInRange = function(){
  var range = getHexInRadius(this.range, this.position);
  var hexInRange = [];
  for(var hex in range){
    var tile = this.grid.getHashMap().get(keyCreator(range[hex]));
    if(tile !== undefined && tile.isWalkable && tile.occupiedBy === null){
      hexInRange.push(tile);
    }
  }
  return hexInRange;
};


/**
 * Return the accessible tile which is closest to the character char
 * @param  {Array of Hex} tileInRange array containing the tile in range and walkable
 * @param  {Character} char        the character to which we want to move to
 * @return {Hex}             the tile where the AI will move
 */
Enemy.prototype.getClosestTileToChar = function(tileInRange, char){
  var closestDist = Number.MAX_SAFE_INTEGER;
  var closestTile;
  for(var index in tileInRange){
    var tile = tileInRange[index];
    var dist = hex_distance(tile.hex, char.position);
    if(dist < closestDist){
      closestDist = dist;
      closestTile = tile;
    }
  }
  return closestTile;
};
