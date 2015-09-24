
//GLOBALS
var STAGE_HEIGHT = 600;
var STAGE_WIDTH = STAGE_HEIGHT * 1.61803;
var MAP_HEIGHT = 22;
var MAP_WIDTH = 20;

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
  var layout = Layout(layout_pointy, Point(30, 10), Point(1200,250) );
  layout.origin;
  var hex = Hex(0,0,0);
  var map  = [];
  for (var s = 0; s < MAP_WIDTH; s++) {
      var s_offset = Math.floor(s/2);
      for (var r = -s_offset; r < MAP_HEIGHT  - s_offset; r++) {
          map.push(Hex(-r - s, r, s));
      }
  }



  var polygon = [];
  for(var index in map){
     polygon.push(polygon_corners(layout, map[index]));

  }
  for(var index in polygon){
    ctx.beginPath();
    for(var i = 0; i < 6; i++){
      ctx.lineTo(polygon[index][i].x,polygon[index][i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  //

}

window.onload = function() {
  createCanvas();
  gameLoop();
};
