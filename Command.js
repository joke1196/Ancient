// --------------- Command design pattern without undo --------------------------
function attack(value, target) { target.setHealth(target.health - value); this.decActionsNum();}
function heal(value, target) { target.setHealth(target.health + value); this.decActionsNum();}
function move(value, target){
  if(target.getActionsLeft() > 0){
    var tile = target.getGrid().getHashMap().get(keyCreator(value));
    if( tile != undefined && tile.isWalkable && tile.isFree){
      target.getGrid().getHashMap().get(keyCreator(target.getPosition())).isFree = true;
      target.getGrid().getHashMap().get(keyCreator(value)).isFree = false;
      target.setPosition(value);
      this.decActionsNum();
    }else{
      console.log("Cannot move to this tile");
    }

  }
}

var Command = function (execute, value, target) {
    this.execute = execute;
    this.value = value;
    this.target = target;
};
var AttackCommand = function (value, target) {
    return new Command(attack, value, target);
};

var HealCommand = function (value, target) {
    return new Command(heal, value, target);
};
var MoveCommand = function(value, target){
  return new Command(move, value, target);
};
