
//GLOBALS
var STAGE_HEIGHT = 800;
var STAGE_WIDTH = STAGE_HEIGHT * 1.61803;
var MAP_HEIGHT = 18;
var MAP_WIDTH = 12;
var HEX_HEIGHT = 50;
var HEX_WIDTH = 23;
var MAP_X = 300;
var MAP_Y = 750;

var canvas = null;
var ctx = null;

function gameLoop() {
  draw();
}

function createCanvas() {
  // Create and put a canvas HTML element isnide the document body.
  canvas = document.createElement("canvas");
  canvas.width = STAGE_WIDTH;
  canvas.height = STAGE_HEIGHT;
  document.body.appendChild(canvas);
  // Our drawing handle
  ctx = canvas.getContext("2d");
}

function draw() {
  // Filling the screen with powder blue
  ctx.fillStyle = "#B4D8E7";
  ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  //Creating a layout for the hex map
  var layout = Layout(layout_pointy, Point(HEX_HEIGHT, HEX_WIDTH), Point(MAP_X,MAP_Y) );
  layout.origin;
 //Creating the map
  var mapArray = getFile("level1"); //has to be done only once per level
  var map = getHexMap(layout, mapArray);

  //Creating a Character
  var tom = new Character("Tom", Hex(0, 0, 0), 100, 100, "img/spriteSheet_test.png", 3);
  var john = new Character("John", Hex(0, 0, 0), 100, 100, "img/spriteSheet_test.png", 3);
  tom.draw(layout, ctx);
  john.draw(layout, ctx);
  //Example of commands

  tom.execute(new AttackCommand(tom.strength, john));
  tom.execute(new HealCommand(tom.intel, tom));

  tom.move(Hex(2, -2, 0), mapArray);
  tom.draw(layout, ctx);
  drawHex(map, ctx);



}

window.onload = function() {
  createCanvas();
  gameLoop();
};
