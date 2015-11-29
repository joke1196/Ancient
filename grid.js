//Globals
var TILE_WIDTH = 150;
var TILE_HEIGHT = 150;
var DEFAULT = 0;
var MOVE_OVERLAY = 1;
var FIRE_OVERLAY = 2;
/**
 * The class represent the grid of the game
 * @param {Layout} layout   is the position and orientation of the tiles
 * @param {Array} mapArray is the representation of the Grid in a 2D array
 */
function Grid(layout, mapArray){
  this.layout = layout;
  this.X_OFFSET = this.layout.size.x - 7;
  this.mapArray = mapArray;
  this.MAP_HEIGHT = this.mapArray.height;
  this.MAP_WIDTH = this.mapArray.width;
  //This hashMap is used to acces everytile by giving an Hex object as key
  this.hashMap = new Map();
  this.polygons = [];
  this.textures = new Image();
  //Sprit sheet of all the textures for the grid
  this.textures.src = this.mapArray.textures;
  //Array of all the tiles that cannot be wlaked on
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
};

Grid.prototype.draw = function(ctx){
    for(var index in this.polygons){
      var value = this.polygons[index].value;
      var overlay = this.polygons[index].isSelected;
      ctx.drawImage(this.textures, value * TILE_WIDTH, overlay * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, this.polygons[index].poly[4].x - this.X_OFFSET,this.polygons[index].poly[4].y, TILE_WIDTH*(0.58), (TILE_HEIGHT*(1/3.0)));
      ctx.beginPath();
      for(var i in this.polygons[index].poly){
        ctx.lineTo(this.polygons[index].poly[i].x ,this.polygons[index].poly[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
};


//------------- GRID  init functions ------------------
//Creating the hashMap
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
        hashMap.put(keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : !unwalkable, value : this.mapArray.map[axialCoord.col][mod(-axialCoord.row, this.MAP_WIDTH)], occupiedBy: null, isSelected: DEFAULT});

      }
  }
  return hashMap;
};
//Finding all the angles of the hexgon from one tile
//returning an array of object containing the angles and also some carateristics
Grid.prototype.hexToPoly = function(){
  var polygon = [];
  for(var i = 0; i++ < this.hashMap.size; this.hashMap.next()){
    polygon.push({poly: polygon_corners(this.layout, this.hashMap.value().hex), isWalkable :  this.hashMap.value().isWalkable, value : this.hashMap.value().value, isSelected : this.hashMap.value().isSelected});
  }
  return polygon;
};
//This method is called when the Grid drawing is changed
//For example when in order to display an overlay on a tile
Grid.prototype.updateMap = function(){
  this.polygons = this.hexToPoly();
};
