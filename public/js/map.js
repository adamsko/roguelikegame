function Map(cols, rows, tsize) {
  this.cols = cols;
  this.rows = rows;
  this.tsize = tsize;
  this.layers = [[], []];
  this.start = {x:0, y:0};

  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      this.layers[0][r * cols + c] = 0;
      this.layers[1][r * cols + c] = 0;
    }
  }
};

Map.method ('getTile', function(layer, col, row) {
  return this.layers[layer][row * this.cols + col];
});

Map.method ('putTile', function(layer, col, row, tileIndex) {
  this.layers[layer][row * this.cols + col] = tileIndex;
});

Map.method ('isEmpty', function(layer, col, row) {
  if (col < 0 || col > this.cols - 1 ||
      row < 0 || row > this.rows - 1 ) {
    return true;
  }
  return this.layers[0][row * this.cols + col] === 0;
});

Map.method ('isSolidTileAtXY', function (col, row) {
  if (col < 0 || col > this.cols - 1 ||
      row < 0 || row > this.rows - 1 ) {
    return true;
  }
  return this.layers.reduce(function (res, layer, index) {
    var tile = this.getTile(index, col, row);
    var isSolid = (index === 0 && tile === 0) || tile === 2;
    return res || isSolid;
  }.bind(this), false);
});

Map.method ('getCol', function (x) {
  return Math.floor(x / this.tsize);
});

Map.method ('getRow', function (y) {
  return Math.floor(y / this.tsize);
});

Map.method ('getX', function (col) {
  return col * this.tsize;
});

Map.method ('getY', function (row) {
  return row * this.tsize;
});

Map.method ('generate', function() {
  var maxFeatures = 100;

  // create starting room
  this._fillRect(10, 10, 4, 4);
  this.start = {x:12, y:12};

  for (var i = 0; i < maxFeatures; i++) {
    var wall = this._randomWall();
    var rect = this._randomRect();

    var x, y;
    if (wall.d === direction.UP) {
      x = Math.floor(wall.x - rect.w / 2 + 1);
      y = wall.y;
    }
    else if (wall.d === direction.DOWN) {
      x = Math.floor(wall.x - rect.w / 2 + 1);
      y = wall.y - rect.h + 1;
    }
    else if (wall.d === direction.LEFT) {
      x = wall.x;
      y = Math.floor(wall.y - rect.h / 2 + 1);
    }
    else if (wall.d === direction.RIGHT) {
      x = wall.x - rect.w + 1;
      y = Math.floor(wall.y - rect.h / 2 + 1);
    }


    if (this._rectFits(x, y, rect.w, rect.h)) {
      // fill door
      this._fillRect(wall.x, wall.y, 1, 1);
      // fill room (make room for walls)
      this._fillRect(x + 1, y + 1, rect.w - 2, rect.h - 2);
    }
  }

  var walls = [];
  for (var c = 0; c < this.cols ; c++) {
    for (var r = 0; r < this.rows; r++) {
      if (this.isEmpty(0, c, r)) {
        if (!this._emptyAllAround(c, r)) {
             walls.push({c:c, r:r});
           }
      }
    }
  }
  for (w in walls) {
    var wall = walls[w];
    this.layers[0][wall.r * this.cols + wall.c] = 2;
  }

});

Map.method ('_emptyAllAround', function(c, r) {
  if (!this.isEmpty(0, c + 1, r) ||
     !this.isEmpty(0, c - 1, r) ||
     !this.isEmpty(0, c, r + 1) ||
     !this.isEmpty(0, c, r - 1) ||
     !this.isEmpty(0, c + 1, r + 1) ||
     !this.isEmpty(0, c - 1, r + 1) ||
     !this.isEmpty(0, c + 1, r - 1) ||
     !this.isEmpty(0, c - 1, r - 1)) {
       return false;
     }
     return true;
});

Map.method ('_rectFits', function(x, y, w, h) {
  if (x < 0 || y < 0 || x + w >= this.cols || y + h >= this.rows) {
    return false;
  }
  for (var c = x; c < x + w ; c++) {
    for (var r = y; r < y + h; r++) {
      if (!this.isEmpty(0, c, r)) {
        return false;
      }
    }
  }
  return true;
});

Map.method ('_randomRect', function() {
  var w = Math.floor(Math.random() * 5 + 5);
  var h = Math.floor(Math.random() * 5 + 5);
  return {w:w, h:h};
});

Map.method ('_randomWall', function () {
  var x;
  var y;
  while (true) {
    x = Math.floor(Math.random() * this.cols);
    y = Math.floor(Math.random() * this.rows);
    if (this.isEmpty(0, x, y)) {
      var where = null;
      if (!this.isEmpty(0, x + 1, y)) where = direction.RIGHT;
      if (!this.isEmpty(0, x - 1, y)) where = direction.LEFT;
      if (!this.isEmpty(0, x, y + 1)) where = direction.DOWN;
      if (!this.isEmpty(0, x, y - 1)) where = direction.UP;

      if(where) {
        return {x:x, y:y, d:where};
      }
    }
  }
});

var direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8
}

Map.method ('_fillRect', function(x, y, w, h) {
  for (var c = x; c < x + w ; c++) {
    for (var r = y; r < y + h; r++) {
      this.layers[0][r * this.cols + c] = 1;
    }
  }
});

function Rect(x, y, w, h) {
  this.x1 = x;
  this.y1 = y;
  this.x2 = x + w;
  this.y2 = y + h;
}

Rect.prototype.intersect = function (other) {
  return (this.x1 <= other.x2 && this.x2 >= other.x1
          && this.y1 <= other.y2 && this.y2 >= other.y1);
}

Rect.prototype.center = function () {
  var centerX = Math.floor((this.x1 + this.x2) / 2);
  var centerY = Math.floor((this.y1 + this.y2) / 2);
  return {x: centerX, y: centerY};
}
