//GLOBALS
var ACTION_BTN_POSX = 850;
var ACTION_BTN_POSY = 740;
var BTN_WIDTH = 180;
var BTN_HEIGHT = 50;
var BTN_MARGIN = 10;
var RIGHT_BTN_POSX = ACTION_BTN_POSX + BTN_WIDTH + BTN_MARGIN;
var ACTION_MOVE = 0;
var ACTION_FIRE = 1;

//Start Menu
var START_MENU_BTNX = 220;
var START_MENU_BTNY = 480;
var START_MENU_BTN_WIDTH = 600;
var START_MENU_BTNX_HEIGHT = 40;

/**
 * This Singleton manages the different scenes
 */
var SceneManager = new function SceneManager(){
  var instance = this;
  this.currentScene = undefined;
  this.nextScene = undefined;
  SceneManager.getInstance = function(){
    return instance;
  };
  return SceneManager;
}();

/**
 * Switches from scene to the next
 * @param  {Scene} scene is the new scene to be shown
 */
SceneManager.prototype.showScene = function(scene){
  if(this.currentScene !== undefined){
    this.currentScene.onExitScene();
  }
  this.currentScene = scene;
  scene.onEnterScene();
};

/**
 * returns the current scene
 * @return {Scene} the current scene
 */
SceneManager.prototype.getCurrentScene = function(){
  return this.currentScene;
};
/**
 * Returns the next Scene
 * @return {Scene} the next scene
 */
SceneManager.prototype.getNextScene = function(){
  return this.nextScene;
};
/**
 * Setting the next scene
 * @param  {Scene} scene is the next scene to be displayed
 */
SceneManager.prototype.setNextScene = function(scene){
  this.nextScene = scene;
};

/**
 * Switching from scene to the next
 */
SceneManager.prototype.setCurrentSceneToNext = function(){
  this.currentScene = this.nextScene;
};


/**
 * Main class for all the different scene
 */
function Scene(){
  return this;
}

Scene.prototype.update = function(td){};
Scene.prototype.draw = function(){};
Scene.prototype.onEnterScene = function(){};

/**
 * This scene is used to load everything needed in the MenuScene
 */
function PreloaderScene(){
  return this;
}

//Setting the inheritance
PreloaderScene.prototype = Object.create(Scene.prototype);
//When every asset is loaded change to the MenuScene
PreloaderScene.prototype.update = function(td){
  if(AssetManager.getInstance().update() >= 100){
    SoundManager.getInstance().setSoundMap(AssetManager.getInstance().getSoundMap());
    SceneManager.getInstance().showScene(new MenuScene());
  }
};
//Display during the loading
PreloaderScene.prototype.draw = function(){
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.font="60px Georgia";
  ctx.fillText("Preloading",300,300);
};
//Loading all the needed assets
PreloaderScene.prototype.onEnterScene = function(){
  var assets = AssetManager.getInstance();
  assets.queueSoundFiles(LevelManager.getInstance().getCurrentLevel().getSounds(), audioCtx);
  assets.queueDownload(LevelManager.getInstance().getCurrentLevel().getSprites());
  assets.queueDialog(LevelManager.getInstance().getCurrentLevel().getDialogsPath());
  assets.downloadAll();
};
PreloaderScene.prototype.onExitScene = function(){};

/**
 * This scene displays the menu and starts the main theme song
 */
function MenuScene(){
  this.background = new Image();
  this.background.src = "assets/Menu_screen/menu_screen.png";
  this.eventClick = function(evt){
    var mouse = { x: evt.pageX, y: evt.pageY};
    //Switching when the Start adventure is clicked
    if(mouse.x <= (START_MENU_BTNX + START_MENU_BTN_WIDTH) && mouse.x >= START_MENU_BTNX && mouse.y <= START_MENU_BTNY + START_MENU_BTNX_HEIGHT && mouse.y >= START_MENU_BTNY){
      sceneManager.showScene(new DialogScene());
    }
  };
  return this;
}
MenuScene.prototype = Object.create(Scene.prototype);

MenuScene.prototype.update = function(td){
};
MenuScene.prototype.draw = function(){
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.drawImage(this.background, 0,0, STAGE_WIDTH, STAGE_HEIGHT);
};

MenuScene.prototype.onEnterScene = function(){
  canvas.addEventListener("click", this.eventClick, false);
  soundManager.play("Ancient_Theme_V1_1.m4a");
};
MenuScene.prototype.onExitScene = function(){
  canvas.removeEventListener('click', this.eventClick, false); // TODO REMOVE
};

//This scene is generic and used in between every level in order to load the needed assets
function LoadScene(){
  return this;
}

LoadScene.prototype = Object.create(Scene.prototype);

LoadScene.prototype.update = function(td){
  if(AssetManager.getInstance().update() === 100){
    mapArray = AssetManager.getInstance().getMapArray();
    sceneManager.showScene(new PlayScene());
  }
};

//Drawing the loading bar
LoadScene.prototype.draw = function(td){
  ctx.fillStyle = "red";
  ctx.fillRect(0 ,0, AssetManager.getInstance().update() * STAGE_WIDTH / 100, 10 );
  ctx.font="20px Georgia";
  ctx.fillText("Loading",10,50);
};
//Telling the asset manager to load the current level assets
LoadScene.prototype.onEnterScene = function(){
  var assetManager = AssetManager.getInstance();
  ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  assetManager.queueDownload(levelManager.getCurrentLevel().getSprites());
  var mapPath = levelManager.getCurrentLevel().getMap();
  var dialogPath = levelManager.getCurrentLevel().getDialogsPath();
  assetManager.queueMap(mapPath);
  assetManager.queueDialog(dialogPath);
  assetManager.downloadAll();
};
LoadScene.prototype.onExitScene = function(){};

//This enum is used the switch between the computer's and player's turn
var gameStates = {
  PLAYERSTURN: 0,
  COMPUTERSTURN: 1
};

//Main scene is where the battles of the game take place
function PlayScene(){
  this.state = gameStates.PLAYERSTURN;
  //Array of all the elements to be drawn
  this.drawElements= [];
  this.eventClick;

  //Creating arrays for enemies and allies
  this.allies = [];
  this.enemies = [];
  this.environment = [];
  return this;
}



PlayScene.prototype = Object.create(Scene.prototype);

//Play sequence
PlayScene.prototype.update = function(td){

  if(this.state === gameStates.PLAYERSTURN){
    if(totalAP <= 0){
      //computersTurn
      this.state = gameStates.COMPUTERSTURN;
    }
  }else{
    //Computers turn
    var selectedEnemy = this.enemies[selectedEnemyID];
    //Making one computer at a time play
    if(selectedEnemy.getActionsLeft() > 0){
      selectedEnemy.play(td);
    }else{
      selectedEnemyID++;
    }
  }
  //End of turn
  //Reset of actions per turn to default value
  if(compTotalAP === 0 && totalAP === 0){
    for(var ally in this.allies){
      if(this.allies[ally].isAlive){
        this.allies[ally].setActionsLeft(ACTIONS_PER_TURN);
      }
    }
    for(var enemy in this.enemies){
      if(this.enemies[enemy].isAlive){
        this.enemies[enemy].setActionsLeft(ACTIONS_PER_TURN);
      }
    }
    selectedEnemyID = 0;
    this.state = gameStates.PLAYERSTURN;

  }

  //Recount of actions points
  totalAP = 0;
  compTotalAP = 0 ;
  for(var index in this.allies){
    isGameOver = true;
    this.allies[index].update(td);
    //As long as someone lives it's not game over
    if(this.allies[index].isAlive){
      isGameOver = false;
    }
    totalAP += this.allies[index].getActionsLeft();
  }
  for(var enemy in this.enemies){
    isVictorious = true;
    this.enemies[enemy].update(td);
    //As long as one enemy lives it's not a victory
    if(this.enemies[enemy].isAlive){
      isVictorious = false;
    }
    compTotalAP += this.enemies[enemy].getActionsLeft();
  }

  //End of game check
  if(isVictorious){
    isVictorious = false;
    levelManager.setCurrentLevelToNext();
    sceneManager.showScene(new DialogScene());
  }
  if(isGameOver){
    sceneManager.showScene(new GameOverScene());
  }
};

PlayScene.prototype.draw = function(){
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  grid.draw(ctx);
  //Sorting the elements from back to front
  this.drawElements = this.drawElements.sort(function(a, b){
    return (a.getXY().y + a.height) - (b.getXY().y + b.height);
  });

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, BTN_WIDTH * 1.5, BTN_HEIGHT);
  ctx.fillStyle = "orange";
  ctx.font= "25px Georgia";
  ctx.fillText(this.state === gameStates.PLAYERSTURN? "Player's turn" : "Computer's turn", 10,30 );

  //Drawing sorted elements
  for(var index in this.drawElements){
    this.drawElements[index].draw(layout, ctx);
  }
  //Changing the UI with user inputs
  if(selectedChar !== undefined && selectedChar !== null){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 730, STAGE_WIDTH, STAGE_HEIGHT-730);
    ctx.fillStyle = "white";
    ctx.font="20px Georgia";

    ctx.fillText("Name: " + selectedChar.getName(),10, 760);
    ctx.fillText("Actions left: " + selectedChar.getActionsLeft(),10, 790);
    ctx.fillText("Health: " + selectedChar.getHealth(),160, 760);
    ctx.fillText("Intel: " + selectedChar.getIntel(), 160, 790);
    //Displaying commands only if the entity selected is playable
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
 grid = new Grid(layout, mapArray);
 this.allies = [];
 this.drawElements = [];
 //Resteting all the arrays containing different entities
 this.allies.push(new Character("Tom", Hex(0, 0, 0), 100, 100, "assets/characters/kuragoBack.png", 2, grid));
 this.allies.push(new Character("John", Hex(1, -1, 0), 100, 100, "assets/characters/belaback.png", 3, grid));
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
    //Getting the target from a fire action
    var target = this.getCharFromClick(mouse);
    var validTarget = false;
    //Cannot attack the environment and another playable character for now
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
 * @param  {x, y} mouse coordinates
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
/**
 * This Scene is used in between battle to display dialogs
 */
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
  //Using a external library for the text to be displayed easily
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
  //Creating an object to display easily text on the canvas
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

//Managin the next button when a dialog is displayed
DialogScene.prototype.dialogNext = function(evt){
  evt.preventDefault();
  var mouse = { x: evt.pageX, y: evt.pageY};
  if(mouse.x <= RIGHT_BTN_POSX + BTN_WIDTH && mouse.x >= RIGHT_BTN_POSX && mouse.y <= ACTION_BTN_POSY + BTN_HEIGHT && mouse.y >= ACTION_BTN_POSY){
    this.dialogIndex++;
    if(this.dialogIndex < this.dialogs.length){
      this.currentDialog = this.dialogs[this.dialogIndex];
    }else{
      //If the last dialog page is displayed we switch to the new level and load scene
      LevelManager.getInstance().setCurrentLevelToNext();
      sceneManager.showScene(new LoadScene());
    }
  }
};
/**
 * The scene displays Game Over if every entity in the allies array is dead
 */
function GameOverScene(){
  return this;
}

GameOverScene.prototype = Object.create(Scene.prototype);

GameOverScene.prototype.draw = function(){
  ctx.fillStyle = "red";
  ctx.fillRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
  ctx.fillStyle = "black";
  ctx.font="60px Georgia";
  ctx.fillText("Game Over", STAGE_WIDTH / 3, STAGE_HEIGHT/2 -60);
};
