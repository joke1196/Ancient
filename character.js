function Character(name, hex, width, height, img){
  this.name = name;
  this.position = hex;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = img;




  var self = this; // added because of context problem
  this.draw = function(layout, ctx){
    var pos = hex_to_pixel(layout, self.position);
    self.image.onload = function (){
      ctx.drawImage(self.image, 5 * 90, 0, self.width, self.height, pos.x - Math.floor(self.width / 2), pos.y - self.height, self.width, self.height);
    }

  }
  return this;
}
