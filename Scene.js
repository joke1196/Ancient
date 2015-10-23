var SceneManager = new function SceneManager(){
  var instance = this;
  this.currentScene = undefined;
  this.nextScene = undefined;
  SceneManager.getInstance = function(){
    return instance;
  }
  return SceneManager;
}

SceneManager.prototype.showScene = function(scene){
  this.currentScene = scene;
  scene.onSceneChange();
}
SceneManager.prototype.getCurrentScene = function(){
  return this.currentScene;
}
SceneManager.prototype.getNextScene = function(){
  return this.nextScene;
}
SceneManager.prototype.setNextScene = function(scene){
  this.nextScene = scene;
}
SceneManager.prototype.setCurrentSceneToNext = function(){
  this.currentScene = this.nextScene;
}



function Scene(){
  return this;
}

Scene.prototype.update = function(td){}
Scene.prototype.draw = function(){}
Scene.prototype.onSceneChange = function(){}

function MenuScene(){
  return this;
}
MenuScene.prototype = Object.create(Scene.prototype);

MenuScene.prototype.update = function(td){
  console.log("Update in menu");
  canvas.addEventListener("click", myFunc, false);
}
MenuScene.prototype.draw = function(td){
  ctx.font="20px Georgia";
  ctx.fillText("Menu",10,50);
}
MenuScene.prototype.onSceneChange = function(){}

function LoadScene(){
  return this;
}

LoadScene.prototype = Object.create(Scene.prototype);

LoadScene.prototype.update = function(td){


  console.log("Update in load");
  // Example of progress behavior

  if(AssetManager.getInstance().update() === 100){
    // fsm.game();
    sceneManager.showScene(new PlayScene());
  }
}
LoadScene.prototype.draw = function(td){
  ctx.fillStyle = "red";
  ctx.fillRect(0 ,0, AssetManager.getInstance().update() * STAGE_WIDTH / 100, 10 );
  ctx.font="20px Georgia";
  ctx.fillText("Loading",10,50);
}
LoadScene.prototype.onSceneChange = function(){
  canvas.removeEventListener('click', myFunc, false); // TODO REMOVE
  // state.setCurrentState(State.load);
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  AssetManager.getInstance().queueDownload(["assets/map/textures/Ash_planet/Ash_planet_bitmap.png"]);
  AssetManager.getInstance().downloadAll();
}
function PlayScene(){
  return this;
}



PlayScene.prototype = Object.create(Scene.prototype);

PlayScene.prototype.update = function(td){
  console.log("Update in play");

   //Example of commands
   tom.execute(new AttackCommand(tom.strength, john));
   tom.execute(new HealCommand(tom.intel, tom));
   //Update the state of the character
   tom.update();
   // tom.execute(new MoveCommand(Hex(0, -1, 1), tom));
}

PlayScene.prototype.draw = function(){
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  grid.draw(ctx);

  tom.draw(layout, ctx);
  john.draw(layout, ctx);
  tom.draw(layout, ctx);
}
PlayScene.prototype.onSceneChange = function(){
 grid = new Grid(layout, LEVEL1, mapArray);
}
