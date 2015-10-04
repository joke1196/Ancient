
function Grid(layout, level, mapArray){
  this.layout = layout;
  this.mapArray = mapArray;
  this.level = level;
  this.hashMap = new Map();
  this.polygons = [];
  var self = this;

 (function init(){ // Init is done only once when creating the object
    self.hashMap = getHexMap(self.layout, self.mapArray);
    self.polygons = hexToPoly(self.hashMap, self.layout);
  })();

  this.draw = function(ctx){
    for(var index in this.polygons){
      ctx.beginPath();
      for(var i = 0; i < 6; i++){
        if(this.polygons[index].isWalkable){
          ctx.fillStyle ="red";
        }else{
          ctx.fillStyle = "blue";
        }
        ctx.lineTo(this.polygons[index].poly[i].x, this.polygons[index].poly[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

  this.getHashMap = function(){
    return self.hashMap;
  }

  return this;
}

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
        if(mapArray[axialCoord.col][mod(-axialCoord.row, MAP_WIDTH)] === 1){
          hashMap.put( keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : false});
        }else{
          hashMap.put( keyCreator(Hex(q, -q-s,s)) ,{hex : Hex(q, -q-s,s), isWalkable : true});
        }
      }
  }
  return hashMap;
}

function hexToPoly(hashMap, layout){
  var polygon = [];
  for(var i = 0; i++ < hashMap.size; hashMap.next()){
    polygon.push({poly: polygon_corners(layout, hashMap.value().hex), isWalkable :  hashMap.value().isWalkable});
  }
  return polygon;
}
