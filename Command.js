// --------------- Command design pattern without undo --------------------------
// list available commands
// The commands are called by the execute method from a Entity
function attack(value, target, self) { target.setHealth(target.health - value);
  target.onTakeDamage(value);
  self.decActionsNum();
}
function move(value, target, self){
  if(target.getActionsLeft() > 0){
    var targetMap = target.getGrid().getHashMap();
    var tile = targetMap.get(keyCreator(value)); //TODO clean
    if( tile !== undefined && tile.isWalkable && tile.occupiedBy === null){
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
//This function gives us the possiblity for one character to move another character
var MoveCommand = function(value, target, self){
  return new Command(move, value, target, self);
};
