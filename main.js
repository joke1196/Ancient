
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

//Creating the map
var mapArray = getFile(LEVEL1); // TODO Should be handled by the Asset manager
var grid = new Grid(layout, LEVEL1, mapArray);

//Creating a Character
var tom = new Character("Tom", Hex(3, -2, -1), 100, 100, "img/spriteSheet_test.png", 2, grid);
var john = new Character("John", Hex(2, -1, -1), 100, 100, "img/spriteSheet_test.png", 3, grid);
//Creating Scene
var sceneManager = SceneManager.getInstance();
sceneManager.showScene(new MenuScene());


//Creating a StateMachine
// var fsm = StateMachine.create({
//  initial: 'menu',
//    events: [
//      { name: 'loading',  from: 'menu',  to: 'load' },
//      { name: 'game', from: 'load', to: 'play'  },
//      { name: 'quit', from: 'play',  to: 'menu' },
//    ],
//    callbacks: {
//
//  onenterload: function() {console.log("Entering load");
//     canvas.removeEventListener('click', myFunc, false); // TODO REMOVE
//     state.setCurrentState(State.load);
//     ctx.clearRect(0,0, STAGE_WIDTH, STAGE_HEIGHT);
//     ASSET_MANAGER.queueDownload(["img/spriteSheet_test.png", "img/Tile.png"]);
//     ASSET_MANAGER.downloadAll();
//
//   },
//  onentermenu: function() {console.log("Entering menu");
//   state.setCurrentState(State.menu);
// },
//  onenterplay: function() { console.log("Entering game");
//    state.setCurrentState(State.play);
//   },
//
//  onleavemenu: function() {
//    console.log("Leaving menu");
//  },
//  onleaveload: function(){
//    console.log("Leaving load");
//  },
//  onleaveplay: function() {
//    console.log("Leaving game");
//
//  },
//  ongame: function(){
//    console.log("Playing");
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
  sceneManager.showScene(new LoadScene);
}
