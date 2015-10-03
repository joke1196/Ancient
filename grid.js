function getHexMap(layout, mapArray)
{
  var map = [];
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
          hashMap.put(Hex(q, -q-s,s),{hex : Hex(q, -q-s,s), isWalkable : false});
        }else{
          hashMap.put(Hex(q, -q-s,s),{hex : Hex(q, -q-s,s), isWalkable : true});
        }
      }
  }

  var polygon = [];
  for(var i = 0; i++ < hashMap.size; hashMap.next()){
    polygon.push({poly: polygon_corners(layout, hashMap.value().hex), isWalkable :  hashMap.value().isWalkable});
  }
  return polygon;
}

function drawHex(map, ctx)
{
  for(var index in map){
    ctx.beginPath();
    for(var i = 0; i < 6; i++){
      if(map[index].isWalkable){
        ctx.fillStyle ="red";
      }else{
        ctx.fillStyle = "blue";
      }
      ctx.lineTo(map[index].poly[i].x,map[index].poly[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}
