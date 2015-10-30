
//GLOBALS
var STAGE_HEIGHT = 800;
var STAGE_WIDTH = STAGE_HEIGHT * 1.61803;
var MAP_HEIGHT = 18;
var MAP_WIDTH = 12;
var HEX_HEIGHT = 50;
var HEX_WIDTH = 25;
var MAP_X = 300;
var MAP_Y = 750;
var LEVEL1 = "level1";
var LEVEL2 = "level2";
var LEVEL3 = "level3";
var LEVEL4 = "level4";
var LEVEL5 = "level5";


var canvas = null;
var ctx = null;
var lastUpdate = Date.now();

//Creating a layout for the hex map
var layout = Layout(layout_pointy, Point(HEX_HEIGHT, HEX_WIDTH), Point(MAP_X,MAP_Y) );
layout.origin;



//Creating Scene
var sceneManager = SceneManager.getInstance();
sceneManager.showScene(new MenuScene());
var levelManager = LevelManager.getInstance();
levelManager.showLevel(new LevelGrass());

//Creating the map
var mapArray = {};
var grid = undefined;

//Creating arrays for enemies and allies
var allies = [];
var enemies = [];
var environment = [];
var isVictorious = false;
var totalAP = 0;
var myTest = 0;


//Creating a StateMachine
// var fsm = StateMachine.create({
//  initial: 'startTurn',
//    events: [
//      { name: 'toPlayers',  from: 'startTurn',  to: 'playersTurn' },
//      { name: 'switchSide', from: 'playersTurn', to: 'computersTurn'  },
//      { name: 'endTurn', from: 'computersTurn',  to: 'startTurn' },
//      { name: 'endTurn', from: 'playersTurn', to: 'startTurn'}
//    ],
//    callbacks: {
//
//  onenterstartTurn: function() {console.log("Entering start");
//
//
//   },
//  onenterplayersTurn: function() {console.log("Entering playerturn");
//  // Reset action points to max
//   },
//  onentercomputersTurn: function() { console.log("Entering comp");
//   },
//
//  onleavestartTurn: function() {
//    console.log("Leaving menu");
//  },
//  onleaveplayersTurn: function(){
//    console.log("Leaving load");
//  },
//  onleavecomputersTurn: function() {
//    console.log("Leaving game");
//
//  }
//
// }});


function gameLoop() {
  var now = Date.now();
  var td = (now - lastUpdate) / 1000;
  if(sceneManager.getNextScene() !== undefined){
    sceneManager.setCurrentSceneToNext();
    sceneManager.setNextScene(undefined);
  }
  sceneManager.getCurrentScene().update(td);
  sceneManager.getCurrentScene().draw();
  mozRequestAnimationFrame(gameLoop);
  lastUpdate = now;
}

window.onload = function() {
  createCanvas();
  gameLoop();
};

function createCanvas() {
  // Create and put a canvas HTML element isnide the document body.
  canvas = document.createElement("canvas");
  canvas.width = STAGE_WIDTH;
  canvas.height = STAGE_HEIGHT;
  document.body.appendChild(canvas);
  // Our drawing handle
  ctx = canvas.getContext("2d");
}

function myFunc() { // TODO REMOVE or make it nice
  // fsm.loading();
  sceneManager.showScene(new LoadScene());
}
