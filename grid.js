function Grid(layout, level, mapArray){
  this.layout = layout;
  this.X_OFFSET = this.layout.size.x;
  this.mapArray = mapArray;
  this.level = level;
  this.hashMap = new Map();
  this.polygons = [];
  this.textures = preloadTextures(this.mapArray.textures);
  var self = this;

 (function init(){ // Init is done only once when creating the object
    self.hashMap = getHexMap(self.layout, self.mapArray.map);
    self.polygons = hexToPoly(self.hashMap, self.layout);
  })();
  return this;
}

Grid.prototype.getHashMap = function(){
  return this.hashMap;
}


Grid.prototype.draw = function(ctx){
    for(var index in this.polygons){
      var value = this.polygons[index].value;
      ctx.drawImage(this.textures[value], this.polygons[index].poly[4].x - this.X_OFFSET + 6,this.polygons[index].poly[4].y, (this.textures[value].width * 1.5)+ 5, (this.textures[value].height*1.5)+2);
      ctx.beginPath();
      for(var i in this.polygons[index].poly){
        ctx.lineTo(this.polygons[index].poly[i].x ,this.polygons[index].poly[i].y);
      }
      ctx.closePath();
      // ctx.stroke();
    }
}


//------------- GRID  init functions ------------------
function getHexMap(layout, mapArray){
  var hashMap = new Map();
  if(mapArray == null){
    console.log("ERROR : could not load map array");
  }
  for (var q = 0; q < MAP_HEIGHT; q++) {
      var q_offset = Math.floor(q/2);
      for (var s = -q_offset; s < MAP_WIDTH  - q_offset; s++) {
        var axialCoord = qoffset_from_cube(q_offset, Hex(q, -q-s,s));
        //Because of tile disposition, have to negate the row and stay in the array width
        if(mapArray[axialCoord.col][mod(-axialCoord.row, MAP_WIDTH)] !== 0){
          hashMap.put( keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : false, value : mapArray[axialCoord.col][mod(-axialCoord.row, MAP_WIDTH)]});
        }else{
          hashMap.put( keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : true, value : mapArray[axialCoord.col][mod(-axialCoord.row, MAP_WIDTH)]});
        }
      }
  }
  return hashMap;
}

function hexToPoly(hashMap, layout){
  var polygon = [];
  for(var i = 0; i++ < hashMap.size; hashMap.next()){
    polygon.push({poly: polygon_corners(layout, hashMap.value().hex), isWalkable :  hashMap.value().isWalkable, value : hashMap.value().value});
  }
  return polygon;
}


function preloadTextures(urlArray){
    try {
      var array = [];
      for(var index in urlArray){
        var _img = new Image();
        _img.src = urlArray[index];
        array.push(_img);
      }
      return array;
    } catch (e) { console.log("Texture not preloaded "); }
}
