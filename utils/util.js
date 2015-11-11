function mod(n, m) {
        return ((n % m) + m) % m;
}

//Create a key for the hash map from a specific tile
function keyCreator(hex){
  return hex.q + " " + hex.r + " "+ hex.s;
}

function max(n, m){
  return n <= m ? m : n;
}

function min(n , m){
  return n <= m ? n : m;
}

function minInArray(array, attribute){
  var min = array[0];
  for(var i = 1; i < array.length; i++){
    if(array[i].attribute < min.attribute){
      min = array[i];
    }
  }
  return min;
}
