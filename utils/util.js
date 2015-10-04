function mod(n, m) {
        return ((n % m) + m) % m;
}

//Create a key for the hash map from a specific tile
function keyCreator(hex){
  return hex.q + " " + hex.r + " "+ hex.s;
}
