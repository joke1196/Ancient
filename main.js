
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
var defaultPositions = [Hex(0, 0, 0), Hex(1, -1, 0),Hex(2, -2, 0)];
/**
 * This function is called only once when entering the first level.
 * It creates an array of all the playable characters
 */
function instanciateAllies(){
  allies.push(new Character("Kurago", Hex(0, 0, 0), 100, 100, "assets/characters/kurago.png", 3, grid));
  allies.push(new Character("Bela", Hex(1, -1, 0), 50, 100, "assets/characters/bela.png", 4, grid));
  allies.push(new Character("Rebel", Hex(2, -2, 0), 100, 100, "assets/characters/rebel.png", 3, grid));
}

//Boolean saying true if the second ending will be chosen
isBranch = false;

//Creating the map
var mapArray = {};
var grid = undefined;

//Setting globals // TODO move to Scene
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
