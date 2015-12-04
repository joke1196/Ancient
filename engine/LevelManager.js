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

LevelAsh.prototype.init = function(){};
LevelAsh.prototype.getEnemies = function(){
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 1, 100, "assets/characters/criminal.png", 3, grid));
  return this.enemies;
};
LevelAsh.prototype.getEnvironment = function(){

  return this.environment;
};

LevelAsh.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/map/textures/Ash_planet/Ash_planet_bitmap.png", "assets/map/textures/backgrounds/bg_levelAsh.png",];
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
LevelAsh.prototype.getSounds = function(){
  var sounds = ["assets/sounds/lava.mp3"];
  return sounds;
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
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 1, 100, "assets/characters/criminal.png", 3, grid));
  // this.enemies.push(new Enemy("Helmut", Hex(7, -6, -1), 10, 100, "assets/characters/kroganpx.png", 3, grid));
  return this.enemies;
};

LevelGrass.prototype.getSprites = function(){
  var sprites = ["assets/map/textures/Grass_planet/grass_bitmap.png", "assets/map/textures/backgrounds/bg_levelGrass.png", "assets/characters/kurago.png","assets/characters/rebel.png", "assets/characters/bela.png", "assets/characters/kroganpx.png", "assets/characters/criminal.png" , "assets/map/textures/Grass_planet/environments/bush.png","assets/map/textures/Grass_planet/environments/tree.png"];
  return sprites;
};
LevelGrass.prototype.getEnvironment = function(){
  this.environment.push(new Environment(Hex(8, -10, 2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(7, -10, 3), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(6, -10, 4), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(6, -10, 4), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(8, -11, 3), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(7, -11, 4), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(6, -13, 7), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(6, -14, 8), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(11, -10, -1), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(12, -10, -2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(2, -10, 8), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(3, -11, 8), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(1, -9, 8), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(11, -12, 1), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(15, -17, 2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(14, -16, 2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(16, -12, -4), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  this.environment.push(new Environment(Hex(16, -11, -5), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(11, -6, -5), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  return this.environment;
};
LevelGrass.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/levelGrass"];
  return dialog;
};
LevelGrass.prototype.getMap = function(){
  var map = ["assets/map/levelGrass"];
  return map;
};
LevelGrass.prototype.getSounds = function(){
  var sounds = ["assets/sounds/Forest_Night.mp3"];
  return sounds;
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
  var sprites = ["assets/menu_screen/menu_screen.png", "assets/menu_screen/loading.png"];
  return sprites;
};


LevelMenu.prototype.getEnvironment = function(){
  return [];
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
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 1, 100, "assets/characters/criminal.png", 3, grid));
  return this.enemies;
};
LevelIce.prototype.getSounds = function(){
  var sounds = ["assets/sounds/Ice_Cavern.mp3"];
  return sounds;
};

LevelIce.prototype.getSprites = function(){
  var sprites = ["assets/map/textures/Ice_Planet/Ice_planet_bitmap.png","assets/map/textures/backgrounds/bg_levelIce.png", "assets/map/textures/Ice_Planet/environments/ice_pilar.png","assets/map/textures/Ice_Planet/environments/pile_of_snow.png"];
  return sprites;
};


LevelIce.prototype.getEnvironment = function(){
  this.environment.push(new Environment(Hex(0, -2, 2), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
  this.environment.push(new Environment(Hex(0, -5, 5), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 200));
  this.environment.push(new Environment(Hex(5, -6, 1), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(5, -6, 1), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(8, -15, 7), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(7, -15, 8), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
  this.environment.push(new Environment(Hex(7, -14, 7), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(16, -17, 1), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 125));
 this.environment.push(new Environment(Hex(16, -18, 2), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 200));
 this.environment.push(new Environment(Hex(15, -16, 1), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 300));
 this.environment.push(new Environment(Hex(12, -13, 1), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(13, -15, 2), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
  this.environment.push(new Environment(Hex(13, -16, 3), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 125));
 this.environment.push(new Environment(Hex(17, -17, 0), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 200));
 this.environment.push(new Environment(Hex(17, -16, -1), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 90));
 this.environment.push(new Environment(Hex(16, -14, -2), "assets/map/textures/Ice_Planet/environments/pile_of_snow.png", grid,100, 100));
 this.environment.push(new Environment(Hex(11, -9, -2), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 200));
 this.environment.push(new Environment(Hex(12, -10, -2), "assets/map/textures/Ice_Planet/environments/ice_pilar.png", grid,100, 200));
  return this.environment;
};
LevelIce.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelIce.prototype.getMap = function(){
  var map = ["assets/map/levelIce"];
  return map;
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
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 1, 100, "assets/characters/criminal.png", 3, grid));
  return this.enemies;
};
LevelPoison.prototype.getSounds = function(){
  var sounds = ["assets/sounds/Goblins_Cave.mp3"];
  return sounds;
};

LevelPoison.prototype.getSprites = function(){ //TODO Complete
  var sprites = ["assets/map/textures/Poison_planet/poison_planet_bitmap.png","assets/map/textures/backgrounds/bg_levelPoison.png", "assets/map/textures/Ice_Planet/environments/ice_pilar.png","assets/map/textures/Ice_Planet/environments/pile_of_snow.png"];
  return sprites;
};


LevelPoison.prototype.getEnvironment = function(){
  return [];
};
LevelPoison.prototype.getDialogsPath = function(){
  var dialog = ["assets/dialog/intro"];
  return dialog;
};
LevelPoison.prototype.getMap = function(){
  var map = ["assets/map/levelPoison"];
  return map;
};
