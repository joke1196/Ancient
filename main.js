
//GLOBALS
var STAGE_HEIGHT = 800;
var STAGE_WIDTH = STAGE_HEIGHT * 1.61803;
var MAP_HEIGHT = 18;
var MAP_WIDTH = 12;
var HEX_HEIGHT = 50;
var HEX_WIDTH = 25;
var MAP_X = 300;
var MAP_Y = 775;


var canvas = null;
var ctx = null;
var lastUpdate = Date.now();
var CT = new CanvasText;


//Creating a layout for the hex map
var layout = Layout(layout_pointy, Point(HEX_HEIGHT, HEX_WIDTH), Point(MAP_X,MAP_Y) );
layout.origin;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var soundManager = SoundManager.getInstance();
soundManager.setContext(audioCtx);


var levelManager = LevelManager.getInstance();
levelManager.showLevel(new LevelMenu());
//Creating Scene
var sceneManager = SceneManager.getInstance();
sceneManager.showScene(new PreloaderScene());

//Creating array of playable characters

var allies = [];
var defaultPositions = [Hex(4, -6, 2), Hex(3, -8, 5),Hex(3, -2, -1), Hex(1, -5, 4), Hex(1,-4,3)];
/**
 * This function is called only once when entering the first level.
 * It creates an array of all the playable characters
 */
function instanciateAllies(){
  allies.push(new Character("Kurago", Hex(4, -6, 2), 18, 100, "assets/characters/kurago.png", 9, grid, 100, 100, 3, 2));
  allies.push(new Character("Bela", Hex(1, -6, 5), 12, 100, "assets/characters/bela.png", 5, grid, 100, 100, 3, 4));
  allies.push(new Character("Rebel", Hex(2, -2, 0), 20, 100, "assets/characters/rebel.png", 7, grid));
  allies.push(new Character("Suspicious guy", Hex(1, -3, 2), 15, 100, "assets/characters/spio.png", 10, grid));
}

//Boolean saying true if the second ending will be chosen
var isBranch = false;

//Creating the map
var mapArray = {};
var grid = undefined;

//Setting globals
var isVictorious = false;
var isGameOver = false;
var totalAP = 0;
var compTotalAP = 0;
var myTest = 0;
var selectedChar;
var action = null;
var selectedEnemyID = 0;



function gameLoop() {
  var now = Date.now();
  var td = (now - lastUpdate) / 1000;
  if(sceneManager.getNextScene() !== undefined){
    sceneManager.setCurrentSceneToNext();
    sceneManager.setNextScene(undefined);
  }
  sceneManager.getCurrentScene().update(td);
  sceneManager.getCurrentScene().draw();
  window.requestAnimationFrame(gameLoop);
  lastUpdate = now;
}

window.onload = function() {
  createCanvas();
  gameLoop();
};

function createCanvas() {
  // Create and put a canvas HTML element inside the document body.
  canvas = document.createElement("canvas");
  canvas.width = STAGE_WIDTH;
  canvas.height = STAGE_HEIGHT;
  document.body.appendChild(canvas);
  // Our drawing handle
  ctx = canvas.getContext("2d");
}
