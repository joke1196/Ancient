//Returns a real modulo with no negative values
function mod(n, m) {
        return ((n % m) + m) % m;
}

//Create a key for the hash map from a specific tile
function keyCreator(hex){
  return hex.q + " " + hex.r + " "+ hex.s;
}
//Return the maximum between to Numbers
function max(n, m){
  return n <= m ? m : n;
}
//Return the minimum between to Numbers
function min(n , m){
  return n <= m ? n : m;
}
//Check for an attribute of an character in an array
//and returning the character where the health is the smallest
//used the return the weakest character for the AI to fire
function minInArray(array){
  var min = array[0];
  for(var i = 1; i < array.length; i++){
    if(array[i].getHealth() < min.getHealth()){
      min = array[i];
    }
  }
  return min;
}
