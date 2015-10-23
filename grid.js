//Globals
var TILE_WIDTH = 150;
var TILE_HEIGHT = 150;

function Grid(layout, level, mapArray){
  this.layout = layout;
  this.X_OFFSET = this.layout.size.x - 7;
  this.mapArray = mapArray;
  this.MAP_HEIGHT = this.mapArray.height;
  this.MAP_WIDTH = this.mapArray.width;
  this.level = level;
  this.hashMap = new Map();
  this.polygons = [];
  this.textures = new Image();
  this.textures.src = this.mapArray.textures;
  this.unwalkableTiles = this.mapArray.unwalkableTiles;
  var self = this;

 (function init(){ // Init is done only once when creating the object
    self.hashMap = self.getHexMap();
    self.polygons = self.hexToPoly();
  })();
  return this;
}

Grid.prototype.getHashMap = function(){
  return this.hashMap;
}


Grid.prototype.draw = function(ctx){
    for(var index in this.polygons){
      var value = this.polygons[index].value;
      ctx.drawImage(this.textures, value * TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT, this.polygons[index].poly[4].x - this.X_OFFSET,this.polygons[index].poly[4].y, TILE_WIDTH*(0.58), (TILE_HEIGHT*(1/3.0)));
      ctx.beginPath();
      for(var i in this.polygons[index].poly){
        ctx.lineTo(this.polygons[index].poly[i].x ,this.polygons[index].poly[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
}


//------------- GRID  init functions ------------------
Grid.prototype.getHexMap = function(){
  var hashMap = new Map();
  if(this.mapArray == null){
    console.log("ERROR : could not load map array");
  }
  for (var q = 0; q < this.MAP_HEIGHT; q++) {
      var q_offset = Math.floor(q/2);
      for (var s = -q_offset; s < this.MAP_WIDTH  - q_offset; s++) {
        var axialCoord = qoffset_from_cube(q_offset, Hex(q, -q-s,s));
        //Because of tile disposition, have to negate the row and stay in the array width
        //If the tile is not walkable
        var unwalkable = this.unwalkableTiles.indexOf(this.mapArray.map[axialCoord.col][mod(-axialCoord.row, this.MAP_WIDTH)]) > -1;
        hashMap.put( keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : unwalkable, value : this.mapArray.map[axialCoord.col][mod(-axialCoord.row, this.MAP_WIDTH)]});//TODO Test

      }
  }
  return hashMap;
}

Grid.prototype.hexToPoly = function(){
  var polygon = [];
  for(var i = 0; i++ < this.hashMap.size; this.hashMap.next()){
    polygon.push({poly: polygon_corners(this.layout, this.hashMap.value().hex), isWalkable :  this.hashMap.value().isWalkable, value : this.hashMap.value().value});
  }
  return polygon;
}


// function preloadTextures(urlArray){
//     try {
//       var array = [];
//       for(var index in urlArray){
//         var _img = new Image();
//         _img.src = urlArray[index];
//         array.push(_img);
//       }
//       return array;
//     } catch (e) { console.log("Texture not preloaded "); }
// }
