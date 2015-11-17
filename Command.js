// --------------- Command design pattern without undo --------------------------
function attack(value, target, self) { target.setHealth(target.health - value); self.decActionsNum();}
function heal(value, target, self) { target.setHealth(target.health + value); self.decActionsNum();}
function move(value, target, self){
  console.log("Value: ", value);
  if(target.getActionsLeft() > 0){
    var targetMap = target.getGrid().getHashMap();
    var tile = target.getGrid().getHashMap().get(keyCreator(value)); //TODO test clean
    console.log("Tile:", tile);
    console.log("Occup: ", tile.occupiedBy);
    if( tile != undefined && tile.isWalkable && tile.occupiedBy == null){
      targetMap.get(keyCreator(target.getPosition())).occupiedBy = null;
      targetMap.get(keyCreator(value)).occupiedBy = target;
      target.setPosition(value);
      self.decActionsNum();
    }else{
      console.log("Cannot move to this tile");
    }

  }
}

var Command = function (execute, value, target, self) {
    this.execute = execute;
    this.value = value;
    this.target = target;
    this.self = self;
};
var AttackCommand = function (value, target, self) {
    return new Command(attack, value, target, self);
};

var HealCommand = function (value, target, self) {
    return new Command(heal, value, target, self);
};
var MoveCommand = function(value, target, self){
  return new Command(move, value, target, self);
};
