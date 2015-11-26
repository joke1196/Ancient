//GLOBALS
var ACTION_BTN_POSX = 850;
var ACTION_BTN_POSY = 740;
var BTN_WIDTH = 180;
var BTN_HEIGHT = 50;
var BTN_MARGIN = 10;
var RIGHT_BTN_POSX = ACTION_BTN_POSX + BTN_WIDTH + BTN_MARGIN;
var ACTION_MOVE = 0;
var ACTION_FIRE = 1;
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
  if(this.currentScene !== undefined){
    this.currentScene.onExitScene();
  }
  this.currentScene = scene;
  scene.onEnterScene();
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
Scene.prototype.onEnterScene = function(){};


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
PreloaderScene.prototype.onEnterScene = function(){
  var assets = AssetManager.getInstance();
  assets.queueSoundFiles(LevelManager.getInstance().getCurrentLevel().getSounds(), audioCtx);
  assets.queueDownload(LevelManager.getInstance().getCurrentLevel().getSprites());
  assets.queueDialog(LevelManager.getInstance().getCurrentLevel().getDialogsPath());
  assets.downloadAll();
};
PreloaderScene.prototype.onExitScene = function(){};

function MenuScene(){
  this.background = new Image();
  return this;
}
MenuScene.prototype = Object.create(Scene.prototype);

MenuScene.prototype.update = function(td){
};
MenuScene.prototype.draw = function(td){
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.font="60px Georgia";
  ctx.fillText("Click to begin!",300,300);
};
MenuScene.prototype.onEnterScene = function(){
  canvas.addEventListener("click", myFunc, false);
  soundManager.play("Ancient_Theme_V1_1.m4a");
};
MenuScene.prototype.onExitScene = function(){
  canvas.removeEventListener('click', myFunc, false); // TODO REMOVE
};

function LoadScene(){
  return this;
}

LoadScene.prototype = Object.create(Scene.prototype);

LoadScene.prototype.update = function(td){


  console.log("Update in load");
  // Example of progress behavior

  if(AssetManager.getInstance().update() === 100){
    mapArray = AssetManager.getInstance().getMapArray();
    sceneManager.showScene(new PlayScene());
  }
};
LoadScene.prototype.draw = function(td){
  ctx.fillStyle = "red";
  ctx.fillRect(0 ,0, AssetManager.getInstance().update() * STAGE_WIDTH / 100, 10 );
  ctx.font="20px Georgia";
  ctx.fillText("Loading",10,50);
};
LoadScene.prototype.onEnterScene = function(){
  var assetManager = AssetManager.getInstance();

  // state.setCurrentState(State.load);
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  assetManager.queueDownload(levelManager.getCurrentLevel().getSprites());
  var mapPath = levelManager.getCurrentLevel().getMap();
  var dialogPath = levelManager.getCurrentLevel().getDialogsPath();
  assetManager.queueMap(mapPath);
  assetManager.queueDialog(dialogPath);
  assetManager.downloadAll();
};
LoadScene.prototype.onExitScene = function(){};

var gameStates = {
  PLAYERSTURN: 0,
  COMPUTERSTURN: 1
};

function PlayScene(){
  this.state = gameStates.PLAYERSTURN;
  this.drawElements= [];
  this.eventClick;

  //Creating arrays for enemies and allies
  this.allies = [];
  this.enemies = [];
  this.environment = [];
  return this;
}



PlayScene.prototype = Object.create(Scene.prototype);

PlayScene.prototype.update = function(td){
  // console.log("Update in play");


  if(myTest++ === 200){
    isVictorious = true;
  }

  if(this.state === gameStates.PLAYERSTURN){

    if(totalAP <= 0){
      //computersTurn
      // console.log("To computersTurn");
      this.state = gameStates.COMPUTERSTURN;
    }
  }else{
    console.log("CompsTurns");
    var selectedEnemy = this.enemies[selectedEnemyID];
    if(selectedEnemy.getActionsLeft() > 0){
      selectedEnemy.play(td);
    }else{
      selectedEnemyID++;
    }
    //If computers turn is finished
    // console.log("Computer's turn");

  }
  if(compTotalAP === 0 && totalAP === 0){
    for(var ally in this.allies){
      this.allies[ally].setActionsLeft(ACTIONS_PER_TURN);
    }
    for(var enemy in this.enemies){
      this.enemies[enemy].setActionsLeft(ACTIONS_PER_TURN);
    }
    selectedEnemyID = 0;
    this.state = gameStates.PLAYERSTURN;

  }
   //Example of commands
  //  this.allies[0].execute(new AttackCommand(this.allies[0].strength, this.allies[1]));

  //  this.allies[0].execute(new HealCommand(this.allies[0].intel, this.allies[0]));
  //  //Update the state of the character
  //  tom.update();
  totalAP = 0;
  compTotalAP = 0 ;
  for(var index in this.allies){
    this.allies[index].update(td);
    totalAP += this.allies[index].getActionsLeft();
  }
  for(var enemy in this.enemies){
    this.enemies[enemy].update(td);
    compTotalAP += this.enemies[enemy].getActionsLeft();
  }

  // if(isVictorious){
  if(false){ // TODO REMOVE
    isVictorious = false;
    levelManager.setCurrentLevelToNext();
    sceneManager.showScene(new LoadScene());
  }
};

PlayScene.prototype.draw = function(){
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  grid.draw(ctx);

  this.drawElements = this.drawElements.sort(function(a, b){
    return (a.getXY().y + a.height) - (b.getXY().y + b.height);
  });

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, BTN_WIDTH * 1.5, BTN_HEIGHT);
  ctx.fillStyle = "orange";
  ctx.font= "25px Georgia";
  ctx.fillText(this.state === gameStates.PLAYERSTURN? "Player's turn" : "Computer's turn", 10,30 );


  for(var index in this.drawElements){
    this.drawElements[index].draw(layout, ctx);
  }
  if(selectedChar !== undefined && selectedChar !== null){
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
      ctx.fillRect(ACTION_BTN_POSX, ACTION_BTN_POSY, BTN_WIDTH, BTN_HEIGHT);
      ctx.fillStyle = "orange";
      ctx.fillRect(RIGHT_BTN_POSX, ACTION_BTN_POSY, BTN_WIDTH, BTN_HEIGHT);
      ctx.fillStyle = "black";
      ctx.font="25px Georgia";
      ctx.fillText("MOVE",900, 775);
      ctx.fillText("FIRE",1090, 775);
    }
  }

};
PlayScene.prototype.onEnterScene = function(){
 var self = this;
 SoundManager.getInstance().stop("Ancient_Theme_V1_1.m4a");
 SoundManager.getInstance().play("Ancient_Battle_Loop.m4a", 0.2, true);
 grid = new Grid(layout, levelManager.getCurrentLevel().getName(), mapArray);
 this.allies = [];
 this.drawElements = [];
 this.allies.push(new Character("Tom", Hex(0, 0, 0), 100, 100, "img/spriteSheet_test.png", 2, grid));
 this.allies.push(new Character("John", Hex(1, -1, 0), 100, 100, "img/spriteSheet_test.png", 3, grid));
 this.enemies = levelManager.getCurrentLevel().getEnemies();
 this.environment = levelManager.getCurrentLevel().getEnvironment();
 totalAP = 0;
 for(var index in this.allies){
   totalAP += this.allies[index].getActionsLeft();
 }
 for(var enemy in this.enemies){
   compTotalAP += this.enemies[enemy].getActionsLeft();
 }
 this.drawElements.push(this.allies);
 this.drawElements.push(this.enemies);
 this.drawElements.push(this.environment);
 this.drawElements = [].concat.apply([], this.drawElements);
 this.drawElements = this.drawElements.sort(function(a, b){
   return a.getXY().y - b.getXY().y;
 });
 this.eventClick = function (evt){
   self.clickFunction(evt);
 };
 canvas.addEventListener("mousedown",this.eventClick, false);

};
PlayScene.prototype.onExitScene = function(){
  canvas.removeEventListener("mousedown", this.eventClick);
};

PlayScene.prototype.getAllies = function(){
  return this.allies;
};

PlayScene.prototype.clickFunction = function(evt){
  evt.preventDefault();
  var mouse = { x: evt.pageX, y: evt.pageY};
  var tmpSelectedChar = this.getCharFromClick(mouse);

  if(selectedChar && !tmpSelectedChar){
    //check if clicked on move or fire
    var tmpAction = actionSelected(mouse);
    //Clicking on a tile after the action was selected
    if(action === ACTION_MOVE && tmpAction === null){
      var hex = getTileMove(grid, mouse);
      console.log(hex);
      if(hex !== null){
        selectedChar.execute(new MoveCommand(hex, selectedChar, selectedChar));
        action = null;
        resetOverlay(selectedChar.getGrid().getHashMap());
        selectedChar.getGrid().updateMap();
      }
    }else if(tmpAction !== null){
      //Clicking on an action after selecting a character
      action = tmpAction;
      switch (action) {
        case ACTION_MOVE:
          showDistance(selectedChar, selectedChar.range, MOVE_OVERLAY);
          break;
        case ACTION_FIRE:
          showDistance(selectedChar, selectedChar.fireRange, FIRE_OVERLAY);
          break;
        default:
      }
    }

  }else if(selectedChar !== null && tmpSelectedChar !== null && action === ACTION_FIRE){
    var target = this.getCharFromClick(mouse);
    var validTarget = false;
    if(target.getType() === "Enemy"){
      var hexes = getHexInRadius(selectedChar.fireRange, selectedChar.position);
      var tiles = getTilesFromHex(grid, hexes);
      console.log("Tiles", tiles);
      for(var index in tiles){
        if(tiles[index].occupiedBy === target){
          validTarget = true;
          console.log("Valid Target");
        }
      }
      if(validTarget){
        selectedChar.execute(new AttackCommand(selectedChar.strength, target, selectedChar));
        action = null;
        tmpSelectedChar = null;
        resetOverlay(selectedChar.getGrid().getHashMap());
        selectedChar.getGrid().updateMap();
      }
    }

  }else{
    selectedChar = tmpSelectedChar;
  }
};

/**
 * Return the character clicked by the mouse
 * @param  {Oject} mouse mouse coordinates
 * @return {Character}      the character clicked
 */
PlayScene.prototype.getCharFromClick = function(mouse){
  var element;
  for(var index in this.drawElements){
    var allyXY = this.drawElements[index].getXY();
    var imgX =  allyXY.x - Math.floor(this.drawElements[index].width / 2);
    var imgY = allyXY.y - this.drawElements[index].height;
    if(mouse.x >= imgX && mouse.x <= imgX + this.drawElements[index].width && mouse.y >= imgY  && mouse.y <= allyXY.y){
        element = this.drawElements[index];
        if(element.getType() !== "Environment"){
          return element;
        }
      }
  }
  return null;
};

function DialogScene(){
  this.dialogs = AssetManager.getInstance().getDialogs().dialogs;
  console.log("Dialogs", this.dialogs);
  this.dialogIndex = 0;
  this.currentDialog = this.dialogs[0];
  this.eventClick;
  return this;
}

DialogScene.prototype = Object.create(Scene.prototype);

DialogScene.prototype.draw = function(){
  var self = this;
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.fillStyle = "black";
  ctx.fillRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  CT.drawText({
    text:self.currentDialog,
    x: 20,
    y: 30,
    boxWidth:STAGE_WIDTH - 20
  });
  ctx.fillStyle = "white";
  ctx.fillRect(RIGHT_BTN_POSX, ACTION_BTN_POSY, BTN_WIDTH, BTN_HEIGHT);
  ctx.fillStyle = "black";
  ctx.font="25px Georgia";
  ctx.fillText("NEXT",1090, 775);
};

DialogScene.prototype.onEnterScene = function(){
  var self = this;
  CT.config({
    canvas: canvas,
    context: ctx,
    fontFamily: "Georgia",
    fontSize: "25px",
    fontWeight: "normal",
    fontColor: "white",
    lineHeight: "24"
  });
  this.eventClick = function(evt){
    self.dialogNext(evt);
  };
  canvas.addEventListener("mousedown", this.eventClick , false);

};
DialogScene.prototype.onExitScene = function(){
  canvas.removeEventListener("mousedown", this.eventClick);
};

DialogScene.prototype.dialogNext = function(evt){
  console.log("This", this);
  evt.preventDefault();
  var mouse = { x: evt.pageX, y: evt.pageY};
  if(mouse.x <= RIGHT_BTN_POSX + BTN_WIDTH && mouse.x >= RIGHT_BTN_POSX && mouse.y <= ACTION_BTN_POSY + BTN_HEIGHT && mouse.y >= ACTION_BTN_POSY){
    this.dialogIndex++;
    console.log("Dialogs", this.dialogs);
    if(this.dialogIndex < this.dialogs.length){
      console.log("IN", this.dialogs);
      this.currentDialog = this.dialogs[this.dialogIndex];
    }else{
      console.log("Change Scene");
      LevelManager.getInstance().setCurrentLevelToNext();
      sceneManager.showScene(new LoadScene());
    }
  }
};
