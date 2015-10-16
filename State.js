function States(initial){
  this.currentState = initial;

  return this;
}

States.prototype.setCurrentState = function(newState){
  this.currentState = newState;
}
States.prototype.getCurrentState = function(){
  return this.currentState;
}
