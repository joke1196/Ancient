/**
 * When a character is selected check on which action the player clicked
 * @param  {Object} mouse mouse coordinates
 * @return {int}       return null in order to deselect the player or an int representing the action
 */
function actionSelected(mouse){
  if(mouse.x >= ACTION_BTN_POSX && mouse.x <= ACTION_BTN_POSX + BTN_WIDTH && mouse.y >= ACTION_BTN_POSY && mouse.y <= ACTION_BTN_POSY + BTN_HEIGHT){
    return ACTION_MOVE;
  }else if(mouse.x >= RIGHT_BTN_POSX && mouse.x <=RIGHT_BTN_POSX + BTN_WIDTH && mouse.y >= ACTION_BTN_POSY && mouse.y <= ACTION_BTN_POSY + BTN_HEIGHT){
    return ACTION_FIRE;
  }else{
    return null;
  }
}

/**
 * Add an overlay on the tiles that are in the range for the action
 * @param  {Character} entity The character performing the action
 * @param  {int} range  the range for the action
 * @param  {int} type   type of the action
 */
function showDistance(entity, range, type){
  var hashMap = entity.getGrid().getHashMap();
  resetOverlay(hashMap);
  var tiles = getHexInRadius(range, entity.position);
  for(var index in tiles){
    var tile = hashMap.get(keyCreator(tiles[index]));
    if(tile !== undefined && tile.isWalkable){
      if(type === FIRE_OVERLAY){
        tile.isSelected = type;
      }else{
        if(tile.occupiedBy === null){
          tile.isSelected = type;
        }
      }
    }
  }
  entity.getGrid().updateMap();
}
/**
 * Returns the coordinates tile clicked by the user
 * @param  {Grid} grid  the grid containing all the tiles
 * @param  {Object} mouse the coordinates of the click
 * @return {Hex}       The coordinates of the tile clicked
 */
function getTileMove(grid, mouse, tileInRange){
  var hex = pixel_to_hex(layout, mouse);
  var hexes = getHexInRadius(selectedChar.range, selectedChar.position);
  for(var index in hexes){
    console.log("hex", hex);
  console.log("Hexes",   hexes[index]);
    if(hexCompare(hexes[index], hex)){
      console.log("OKEASy");
      var tile = grid.getHashMap().get(keyCreator(hex));
      console.log("tiles", tile);
      if(tile !== undefined){
        return hex;
      }
    }
  }
  return null;
}

/**
 * This function displays the tile without overlay
 * @param {Map} hashMap is the Map containing all the tiles
 */
function resetOverlay(hashMap){
  for(var i = 0; i++ < hashMap.size; hashMap.next()){
    hashMap.value().isSelected = DEFAULT;
  }
}

/**
 * Returns a Tile object from Hex coordinates
 * @param  {Grid} grid  is the grid containing all the tiles
 * @param  {Array} hexes is an array of Hex object
 * @return {Array}       return an array of Tile object corresponding to the Hex array
 */
function getTilesFromHex(grid, hexes){
  var tiles = [];
  for(var index in hexes){
    var tile = grid.getHashMap().get(keyCreator(hexes[index]));
    if(tile !== undefined){
      tiles.push(tile);
    }
  }
  return tiles;
}
