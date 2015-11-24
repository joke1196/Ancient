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
  level.init();
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
};

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

  return this.enemies;
};
LevelAsh.prototype.getEnvironment = function(){

  return this.environment;
};

LevelAsh.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/map/textures/Ash_planet/Ash_planet_bitmap.png", "img/spriteSheet_test.png"];
  return sprites;
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
  LevelManager.getInstance().setNextLevel(new LevelAsh());
};
LevelGrass.prototype.getEnemies = function(){
  this.enemies.push(new Enemy("Bill", Hex(4, -4, 0), 100, 100, "img/spriteSheet_test.png", 3, grid));
  this.enemies.push(new Enemy("Helmut", Hex(7, -6, -1), 100, 100, "img/spriteSheet_test.png", 3, grid));
  return this.enemies;
};

LevelGrass.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/map/textures/Grass_planet/grass_bitmap.png", "img/spriteSheet_test.png", "assets/map/textures/Grass_planet/environments/bush.png","assets/map/textures/Grass_planet/environments/tree.png"];
  return sprites;
};
LevelGrass.prototype.getEnvironment = function(){
  this.environment.push(new Environment(Hex(8, -10, 2), "assets/map/textures/Grass_planet/environments/bush.png", grid,100, 125));
  this.environment.push(new Environment(Hex(7, -10, 3), "assets/map/textures/Grass_planet/environments/tree.png", grid,100, 300));
  return this.environment;
};

function LevelMenu(){
  this.name = "levelMenu";
  return this;
}
LevelMenu.prototype = Object.create(Level.prototype);

LevelMenu.prototype.init = function(){};
LevelMenu.prototype.getEnemies = function(){
  // return this.enemies;
};
LevelMenu.prototype.getSounds = function(){ // TODO Complete
  var sounds = ["assets/sounds/Ancient_Theme_V1_1.m4a", "assets/sounds/Ancient_Battle_Loop.m4a"];
  return sounds;
};

LevelMenu.prototype.getSprites = function(){ // TODO Complete
  var sprites = ["assets/menuBgTest.png", "assets/logo.png"];
  return sprites;
};


LevelMenu.prototype.getEnvironement = function(){
  // return this.environement;
};
