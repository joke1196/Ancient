function Character(name, hex, width, height){
  this.name = name;
  this.position = hex;
  this.width = width;
  this.height = height;

  this.draw = function(layout, ctx){
    ctx.beginPath();
    var pos = hex_to_pixel(layout, this.position);
    console.log(pos);
    ctx.fillStyle = "yellow";
    ctx.fillRect(pos.x- Math.floor(this.height / 2), pos.y - this.width, this.width, this.height);
  }
  return this;
}
