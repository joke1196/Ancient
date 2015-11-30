/**
 * This Singleton manages the different levels
 * Each level contain an array of ennemies and an array of environment entities
 * Each level posses the path to each asset
 */
var LevelManager =  new function LevelManager() {
  var instance = this;
  this.currentLevel = undefined;
  this.nextLevel = undefined;
  //Static method
  LevelManager.getInstance = function(){
    return instance;
  }
  return LevelManager;
};

LevelManager.prototype.showLevel = function(level){
  this.currentLevel = level;
  this.currentLevel.init();
};
LevelManager.prototype.getCurrentLevel = function(){
  return this.currentLevel;
};
LevelManager.prototype.getNextLevel = function(){
  return this.nextLevel;
};
LevelManager.prototype.setNextLevel = function(level){
  this.nextLevel = level;
};
LevelManager.prototype.setCurrentLevelToNext = function(){
  this.currentLevel = this.nextLevel;
  this.currentLevel.init();
};
//Main class for the levels
function Level(){
  this.name = "";
  this.enemies = [];
  this.environment = [];
  return this;
}

Level.prototype.init = function(){};
Level.prototype.getEnemies = function(){};
Level.prototype.getEnvironement = function(){};
Level.prototype.getSprites = function(){};
Level.prototype.getName = function(){
  return this.name;
};

//Inheritance
LevelAsh.prototype = Object.create(Level.prototype);
LevelAsh.prototype.constructor = Level;
LevelAsh.prototype.parent = Level.prototype;

function LevelAsh(){
  this.base = Level;
  this.base();
  this.name = "levelAsh";
  return this;
}
LevelAsh.prototype = Object.create(Level.prototype);

LevelAsh.prototype.init = function(){LevelManager.getInstance().setNextLevel(new LevelVictory());};
LevelAsh.prototype.getEnemies = function(){
  return this.enemies;
};
LevelAsh.prototype.getEnvironment = function(){

  return this.environment;
};

LevelAsh.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/map/textures/Ash_planet/Ash_planet_bitmap.png"];
  return sprites;
};
LevelAsh.prototype.getDialogsPath = function(){ // TODO Complete
  var dialog = ["assets/dialog/levelAsh"];
  return dialog;
};
LevelAsh.prototype.getMap = function(){ // TODO Complete
  var map = ["assets/map/levelAsh"];
  return map;
};


LevelGrass.prototype = Object.create(Level.prototype);
LevelGrass.prototype.constructor = Level;
LevelGrass.prototype.parent = Level.prototype;

function LevelGrass(){
  this.base = Level;
  this.base();
  this.name = "levelGrass";
  return this;
}
LevelGrass.prototype = Object.create(Level.prototype);

LevelGrass.prototype.init = function(){
  LevelManager.getInstance().setNextLevel(new LevelIce());
};
LevelGrass.prototype.getEnemies = function(){
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 10, 100, "assets/characters/criminal.png", 3, grid));
  this.enemies.push(new Enemy("Helmut", Hex(7, -6, -1), 10, 100, "assets/characters/kroganpx.png", 3, grid));
  return this.enemies;
};

LevelGrass.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/map/textures/Grass_planet/grass_bitmap.png", "assets/characters/kurago.png","assets/characters/rebel.png", "assets/characters/bela.png", "assets/characters/darker3.png" , "assets/map/textures/Grass_planet/environments/bush.png","assets/map/textures/Grass_planet/environments/tree.png"];
  return sprites;
};
LevelGrass.prototype.getEnvironment = function(){
  this.environment.push(new Environment(Hex(8, -10, 2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(7, -10, 3), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  return this.environment;
};
LevelGrass.prototype.getDialogsPath = function(){ // TODO Complete
  var dialog = ["assets/dialog/levelGrass"];
  return dialog;
};
LevelGrass.prototype.getMap = function(){ // TODO Complete
  var map = ["assets/map/levelGrass"];
  return map;
};

function LevelMenu(){
  this.base = Level;
  this.base();
  this.name = "levelMenu";
  return this;
}
LevelMenu.prototype = Object.create(Level.prototype);

LevelMenu.prototype.init = function(){ LevelManager.getInstance().setNextLevel(new LevelGrass());};
LevelMenu.prototype.getEnemies = function(){
  // return this.enemies;
};
LevelMenu.prototype.getSounds = function(){
  var sounds = ["assets/sounds/Ancient_Theme_V1_1.m4a", "assets/sounds/Ancient_Battle_Loop.m4a"];
  return sounds;
};

LevelMenu.prototype.getSprites = function(){
  var sprites = ["assets/Menu_screen/menu_screen.png"];
  return sprites;
};


LevelMenu.prototype.getEnvironement = function(){
  // return this.environement;
};
LevelMenu.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelMenu.prototype.getMap = function(){
  return "";
};

function LevelIce(){
  this.base = Level;
  this.base();
  this.name = "levelIce";
  return this;
}
LevelIce.prototype = Object.create(Level.prototype);

LevelIce.prototype.init = function(){ LevelManager.getInstance().setNextLevel(new LevelPoison());};
LevelIce.prototype.getEnemies = function(){
  // return this.enemies;
};
LevelIce.prototype.getSounds = function(){
  return [];
};

LevelIce.prototype.getSprites = function(){
  var sprites = ["assets/map/textures/Ice_Planet/Ice_planet_bitmap.png", "assets/map/textures/Ice_Planet/environments/ice_pilar.png","assets/map/textures/Ice_Planet/environments/pile_of_snow.png"];
  return sprites;
};


LevelIce.prototype.getEnvironement = function(){
  // return this.environement;
};
LevelIce.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelIce.prototype.getMap = function(){
  return "";
};

function LevelPoison(){
  this.base = Level;
  this.base();
  this.name = "levelPoison";
  return this;
}
LevelPoison.prototype = Object.create(Level.prototype);

LevelPoison.prototype.init = function(){ LevelManager.getInstance().setNextLevel(new LevelAsh());};
LevelPoison.prototype.getEnemies = function(){ //TODO Complete
  // return this.enemies;
};
LevelPoison.prototype.getSounds = function(){
  return [];
};

LevelPoison.prototype.getSprites = function(){ //TODO Complete
  var sprites = ["assets/map/textures/Poison_planet/poison_planet_bitmap.png", "assets/map/textures/Ice_Planet/environments/ice_pilar.png","assets/map/textures/Ice_Planet/environments/pile_of_snow.png"];
  return sprites;
};


LevelPoison.prototype.getEnvironement = function(){
  // return this.environement;
};
LevelPoison.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelPoison.prototype.getMap = function(){
  return "";
};

function LevelVictory(){
  this.base = Level;
  this.base();
  this.name = "levelPoison";
  return this;
}
LevelVictory.prototype = Object.create(Level.prototype);

LevelVictory.prototype.init = function(){ LevelManager.getInstance().setNextLevel(new LevelAsh());};
LevelVictory.prototype.getEnemies = function(){
  // return this.enemies;
};
LevelVictory.prototype.getSounds = function(){
  return [];
};

LevelVictory.prototype.getSprites = function(){
  var sprites = ["assets/Menu_screen/menu_screen.png"];
  return sprites;
};


LevelVictory.prototype.getEnvironement = function(){
  // return this.environement;
};
LevelVictory.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelVictory.prototype.getMap = function(){
  return "";
};
