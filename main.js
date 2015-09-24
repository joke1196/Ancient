
//GLOBALS
var STAGE_HEIGHT = 600;
var STAGE_WIDTH = STAGE_HEIGHT * 1.61803;


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
}

window.onload = function() {
  createCanvas();
  gameLoop();
};
