var SceneManager = new function SceneManager(){
  var instance = this;
  this.currentScene = undefined;
  this.nextScene = undefined;
  SceneManager.getInstance = function(){
    return instance;
  };
  return SceneManager;
}();

SceneManager.prototype.showScene = function(scene){
  this.currentScene = scene;
  scene.onSceneChange();
};
SceneManager.prototype.getCurrentScene = function(){
  return this.currentScene;
};
SceneManager.prototype.getNextScene = function(){
  return this.nextScene;
};
SceneManager.prototype.setNextScene = function(scene){
  this.nextScene = scene;
};
SceneManager.prototype.setCurrentSceneToNext = function(){
  this.currentScene = this.nextScene;
};



function Scene(){
  return this;
}

Scene.prototype.update = function(td){};
Scene.prototype.draw = function(){};
Scene.prototype.onSceneChange = function(){};


function PreloaderScene(){
  return this;
}

PreloaderScene.prototype = Object.create(Scene.prototype);
PreloaderScene.prototype.update = function(td){
  console.log(AssetManager.getInstance().update());
  if(AssetManager.getInstance().update() >= 100){
    SoundManager.getInstance().setSoundMap(AssetManager.getInstance().getSoundMap());
    SceneManager.getInstance().showScene(new MenuScene());
  }

};
PreloaderScene.prototype.draw = function(){
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.font="60px Georgia";
  ctx.fillText("Preloading",300,300);
};
PreloaderScene.prototype.onSceneChange = function(){
  var assets = AssetManager.getInstance();
  assets.queueSoundFiles(LevelManager.getInstance().getCurrentLevel().getSounds(), audioCtx);
  assets.queueDownload(LevelManager.getInstance().getCurrentLevel().getSprites());
  assets.downloadAll();
};

function MenuScene(){
  this.background = new Image();
  return this;
}
MenuScene.prototype = Object.create(Scene.prototype);

MenuScene.prototype.update = function(td){
  console.log("Update in menu");
  canvas.addEventListener("click", myFunc, false);
};
MenuScene.prototype.draw = function(td){
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.font="60px Georgia";
  ctx.fillText("Click to begin!",300,300);
};
MenuScene.prototype.onSceneChange = function(){
  soundManager.play("Ancient_Theme_V1_1.m4a");
};

function LoadScene(){
  return this;
}

LoadScene.prototype = Object.create(Scene.prototype);

LoadScene.prototype.update = function(td){


  console.log("Update in load");
  // Example of progress behavior

  if(AssetManager.getInstance().update() === 100){
    mapArray = AssetManager.getInstance().getFileDestination();
    sceneManager.showScene(new PlayScene());
  }
};
LoadScene.prototype.draw = function(td){
  ctx.fillStyle = "red";
  ctx.fillRect(0 ,0, AssetManager.getInstance().update() * STAGE_WIDTH / 100, 10 );
  ctx.font="20px Georgia";
  ctx.fillText("Loading",10,50);
};
LoadScene.prototype.onSceneChange = function(){
  var assetManager = AssetManager.getInstance();
  canvas.removeEventListener('click', myFunc, false); // TODO REMOVE
  // state.setCurrentState(State.load);
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  assetManager.queueDownload(levelManager.getCurrentLevel().getSprites());
  assetManager.queueFile(levelManager.getCurrentLevel().getName(), mapArray);
  assetManager.downloadAll();
};

var gameStates = {
  PLAYERSTURN: 0,
  COMPUTERSTURN: 1
};

function PlayScene(){
  this.state = gameStates.PLAYERSTURN;
  this.drawElements= [];

  //Creating arrays for enemies and allies
  this.allies = [];
  this.enemies = [];
  this.environment = [];
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
    this.allies[0].execute(new MoveCommand(Hex(1, -1, 0), this.allies[0], this.allies[0]));
    this.allies[0].update();
    this.allies[0].execute(new MoveCommand(Hex(2, -2, 0), this.allies[0], this.allies[0]));
    this.allies[0].update();
    this.allies[1].execute(new MoveCommand(Hex(0, 0, 0), this.allies[1], this.allies[1]));
    this.allies[1].update();
    this.allies[1].execute(new MoveCommand(Hex(5, -5, 0), this.allies[1], this.allies[1]));
    this.allies[1].update();
    console.log("totalAP: ", totalAP);
    if(totalAP <= 0){
      //computersTurn
      this.enemies[0].play(td);
      this.enemies[0].update();
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
  //  this.allies[0].execute(new AttackCommand(this.allies[0].strength, this.allies[1]));

  //  this.allies[0].execute(new HealCommand(this.allies[0].intel, this.allies[0]));
  //  //Update the state of the character
  //  tom.update();
  totalAP = 0;
  for(var index in this.allies){
    this.allies[index].update();
    totalAP += this.allies[index].getActionsLeft();
  }

  // if(isVictorious){
  if(false){ // TODO REMOVE
    isVictorious = false;
    levelManager.showLevel(new LevelAsh());
    sceneManager.showScene(new LoadScene());
  }
};

PlayScene.prototype.draw = function(){
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  grid.draw(ctx);

  this.drawElements = this.drawElements.sort(function(a, b){
    return a.getXY().y - b.getXY().y;
  });



  for(var index in this.drawElements){
    this.drawElements[index].draw(layout, ctx);
  }
  if(selectedChar != undefined){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 730, STAGE_WIDTH, STAGE_HEIGHT-730);
    ctx.fillStyle = "white";
    ctx.font="20px Georgia";

    ctx.fillText("Name: " + selectedChar.getName(),10, 760);
    ctx.fillText("Actions left: " + selectedChar.getActionsLeft(),10, 790);
    ctx.fillText("Health: " + selectedChar.getHealth(),160, 760);
    ctx.fillText("Intel: " + selectedChar.getIntel(), 160, 790);
    if(selectedChar.getType() === "Character"){
      ctx.fillStyle = "orange";
      ctx.fillRect(850, 740, 180, 50);
      ctx.fillStyle = "orange";
      ctx.fillRect(1040, 740, 180, 50);
      ctx.fillStyle = "black";
      ctx.font="25px Georgia";
      ctx.fillText("MOVE",900, 775);
      ctx.fillText("FIRE",1090, 775);
    }
  }

};
PlayScene.prototype.onSceneChange = function(){
 var self = this;
 SoundManager.getInstance().stop("Ancient_Theme_V1_1.m4a");
 SoundManager.getInstance().play("Ancient_Battle_Loop.m4a", 0.2, true);
 grid = new Grid(layout, levelManager.getCurrentLevel().getName(), mapArray);
 this.allies = [];
 this.drawElements = [];
 this.allies.push(new Character("Tom", Hex(0, 0, 0), 100, 100, "img/spriteSheet_test.png", 2, grid));
 this.allies.push(new Character("John", Hex(1, -1, 0), 100, 100, "img/spriteSheet_test.png", 3, grid));
 this.enemies = levelManager.getCurrentLevel().getEnemies();
 totalAP = 0;
 for(var index in this.allies){
   totalAP += this.allies[index].getActionsLeft();
 }
 this.drawElements.push(this.allies);
 this.drawElements.push(this.enemies);
 this.drawElements.push(this.environment);
 this.drawElements = [].concat.apply([], this.drawElements);
 this.drawElements = this.drawElements.sort(function(a, b){
   return a.getXY().y - b.getXY().y;
 });

 canvas.addEventListener("mousedown", function(evt){
   self.clickFunction(evt);
 }, false);

};

PlayScene.prototype.getAllies = function(){
  return this.allies;
};

PlayScene.prototype.clickFunction = function(evt){
  evt.preventDefault();
  var mouse = { x: evt.pageX, y: evt.pageY};
  var tmpSelectedChar = this.getCharFromClick(mouse);
  if(!tmpSelectedChar){
    //check if clicked on move or fire
    selectedChar = null;
  }else{
    selectedChar = tmpSelectedChar;
  }
  console.log("selectedChar", selectedChar);
};

/**
 * Return the character clicked by the mouse
 * @param  {Oject} mouse mouse coordinates
 * @return {Character}      the character clicked
 */
PlayScene.prototype.getCharFromClick = function(mouse){
  for(var index in this.drawElements){
    var allyXY = this.drawElements[index].getXY();
    var imgX =  allyXY.x - Math.floor(this.drawElements[index].width / 2);
    var imgY = allyXY.y - this.drawElements[index].height;
    if(mouse.x >= imgX && mouse.x <= imgX + this.drawElements[index].width && mouse.y >= imgY  && mouse.y <= allyXY.y){
        return this.drawElements[index];
      }
  }
  return null;
};
