function Hero(map, x, y) {
  this.map = map;
  this.x = x;
  this.y = y;
  this.width = map.tsize;
  this.height = map.tsize;

  this.image = Loader.getImage('hero');
}

// Hero.SPEED = 1000; // pixels per second

Hero.prototype.move = function (delta, direction) {

  var newX = this.x;
  var newY = this.y;

  if (direction === moveType.UP) {
    newY = this.y - 1;
  }
  else if (direction === moveType.DOWN) {
    newY = this.y + 1;
  }
  else if (direction === moveType.LEFT) {
    newX = this.x - 1;
  }
  else if (direction === moveType.RIGHT) {
    newX = this.x + 1;
  }

  if (!this.map.isSolidTileAtXY(newX, newY)) {
    this.x = newX;
    this.y = newY;
  }

  // // move hero
  // this.x += dirx * Hero.SPEED * delta;
  // // check if we walked into a non-walkable tile
  // this._collide(dirx, 0);
  //
  // this.y += diry * Hero.SPEED * delta;
  // // check if we walked into a non-walkable tile
  // this._collide(0, diry);
  //
  // // clamp values
  // var maxX = (this.map.cols - 1) * this.map.tsize;
  // var maxY = (this.map.rows - 1) * this.map.tsize;
  // this.x = Math.max(0, Math.min(this.x, maxX));
  // this.y = Math.max(0, Math.min(this.y, maxY));
};

// Hero.prototype._collide = function (dirx, diry) {
//   var row, col;
//   // -1 in right and bottom because image ranges from 0..31
//   // and not up to 32
//   var left = this.x;
//   var right = this.x + this.width - 1;
//   var top = this.y;
//   var bottom = this.y + this.height - 1;
//
//   // check for collisions on sprite sides
//   var collision =
//       this.map.isSolidTileAtXY(left, top) ||
//       this.map.isSolidTileAtXY(right, top) ||
//       this.map.isSolidTileAtXY(right, bottom) ||
//       this.map.isSolidTileAtXY(left, bottom);
//   if (!collision) {
//     return;
//   }
//
//   if (diry > 0) {
//     row = this.map.getRow(bottom);
//     this.y = -this.height + this.map.getY(row);
//   }
//   else if (diry < 0) {
//     row = this.map.getRow(top);
//     this.y = this.map.getY(row + 1);
//   }
//   else if (dirx > 0) {
//     col = this.map.getCol(right);
//     this.x = -this.width + this.map.getX(col);
//   }
//   else if (dirx < 0) {
//     col = this.map.getCol(left);
//     this.x = this.map.getX(col + 1);
//   }
// };
