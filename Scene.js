var messageType = {
  INFO : "green",
  WARN : "red"
}

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
    mapArray = AssetManager.getInstance().getFileDestination();
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
  var assetManager = AssetManager.getInstance();
  canvas.removeEventListener('click', myFunc, false); // TODO REMOVE
  // state.setCurrentState(State.load);
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  assetManager.queueDownload(["assets/map/textures/Ash_planet/Ash_planet_bitmap.png", "img/spriteSheet_test.png"]);
  assetManager.queueFile(levelManager.getCurrentLevel().getName(), mapArray);
  assetManager.downloadAll();
}

var gameStates = {
  PLAYERSTURN: 0,
  COMPUTERSTURN: 1
}

function PlayScene(){
  this.state = gameStates.PLAYERSTURN;
  this.topMessage = new TopMessage(messageType.INFO, "It works", 100, ctx);
  return this;
}



PlayScene.prototype = Object.create(Scene.prototype);

PlayScene.prototype.update = function(td){
  console.log("Update in play");

  if(myTest++ === 200){
    isVictorious = true;
  }
  if(this.state === gameStates.PLAYERSTURN){
    console.log("Player's turn");

    if(totalAP <= 0){
      //computersTurn
      console.log("To computersTurn");
      this.state = gameStates.COMPUTERSTURN;
    }
  }else{
    //If computers turn is finished
    console.log("Computer's turn");
    console.log("To Players turn");
    this.state = gameStates.PLAYERSTURN;
  }
   //Example of commands
  //  allies[0].execute(new AttackCommand(allies[0].strength, allies[1]));
  //  allies[0].execute(new HealCommand(allies[0].intel, allies[0]));
  //  //Update the state of the character
  //  tom.update();
  //  tom.execute(new MoveCommand(Hex(0, -1, 1), tom));
  //  for(var ally in allies){
  //    allies[ally].update();
  //  }
  //  for(var enemy in enemies){
  //    enemies[enemy].update();
  //  }
  totalAP = 0;
  for(var index in allies){
    allies[index].update();
    totalAP += allies[index].getActionsLeft();
  }

  if(isVictorious){
    isVictorious = false;
    levelManager.showLevel(new LevelAsh());
    sceneManager.showScene(new LoadScene());
  }
}

PlayScene.prototype.draw = function(){
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
  grid.draw(ctx);
  for(var ally in allies){
    allies[ally].draw(layout, ctx);
  }
  for(var enemy in enemies){
    enemies[enemy].draw(layout, ctx);
  }
  this.topMessage.draw();
}
PlayScene.prototype.onSceneChange = function(){
 grid = new Grid(layout, levelManager.getCurrentLevel().getName(), mapArray);
 allies.push(new Character("Tom", Hex(3, -2, -1), 100, 100, "img/spriteSheet_test.png", 2, grid));
 allies.push(new Character("John", Hex(2, -1, -1), 100, 100, "img/spriteSheet_test.png", 3, grid));
 totalAP = 0;
 for(var index in allies){
   totalAP += allies[index].getActionsLeft();
 }
}
