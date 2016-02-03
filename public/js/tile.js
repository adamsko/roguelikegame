Game.load = function () {
  return [
    Loader.loadImage('tiles', 'assets/fantasy-tileset.png'),
    Loader.loadImage('hero', 'assets/character.png')
  ];
};

Game.init = function () {
  Keyboard.listenForEvents(
    [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
  this.tileAtlas = Loader.getImage('tiles');

  Mouse.trackMouse(this.canvas);

  this.map = new Map(128, 128, 32);
  this.map.generate();

  var startPos = this.map.start;
  this.hero = new Hero(this.map, startPos.x, startPos.y);

  this.camera = new Camera(this.map, this.canvas.width, this.canvas.height);
  this.camera.follow(this.hero);
};

var moveType = {
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8
}

Game.update = function (delta) {
  // handle hero movement with arrow keys
  var moveDirection = null;
  if (Keyboard.isDown(Keyboard.LEFT)) { moveDirection = moveType.LEFT; }
  else if (Keyboard.isDown(Keyboard.RIGHT)) { moveDirection = moveType.RIGHT; }
  else if (Keyboard.isDown(Keyboard.UP)) { moveDirection = moveType.UP; }
  else if (Keyboard.isDown(Keyboard.DOWN)) { moveDirection = moveType.DOWN; }

  Keyboard.resetKeys();

  this.hero.move(delta, moveDirection);
  this.camera.update();
};

Game._drawLayer = function (layer) {
  var startCol = Math.max(0, Math.floor(this.camera.x / this.map.tsize));
  var endCol = Math.min(this.map.cols - 1, startCol + (this.camera.width / this.map.tsize));
  var startRow = Math.max(0, Math.floor(this.camera.y / this.map.tsize));
  var endRow = Math.min(this.map.rows - 1, startRow + (this.camera.height / this.map.tsize));
  var offsetX = -this.camera.x + startCol * this.map.tsize;
  var offsetY = -this.camera.y + startRow * this.map.tsize;

  for (var c = startCol; c <= endCol; c++) {
    for (var r = startRow; r <= endRow; r++) {
      var tile = this.map.getTile(layer, c, r);
      var x = (c - startCol) * this.map.tsize + offsetX;
      var y = (r - startRow) * this.map.tsize + offsetY;
      if (tile !== 0) { // 0 => empty tile
        this.ctx.drawImage(
          this.tileAtlas, // image
          (tile - 1) * this.map.tsize, // source x
          this.map.tsize, // source y
          this.map.tsize, // source width
          this.map.tsize, // source height
          Math.round(x), // target x
          Math.round(y), // target y
          this.map.tsize, // target width
          this.map.tsize // target height
        );
      }
    }
  }
};

Game._drawGrid = function () {
  var width = map.cols * this.map.tsize;
  var height = map.rows * this.map.tsize;
  var x, y;
  this.ctx.lineWidth = 1;
  for (var r = 0; r < this.map.rows; r++) {
    x = - this.camera.x;
    y = r * this.map.tsize - this.camera.y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(width, y);
    this.ctx.stroke();
  }
  for (var c = 0; c < map.cols; c++) {
    x = c * this.map.tsize - this.camera.x;
    y = - this.camera.y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, height);
    this.ctx.stroke();
  }
};

Game.render = function () {
  // draw map background layer
  this._drawLayer(0);

  // draw main character
  this.ctx.drawImage(
    this.tileAtlas, // image
    5 * this.map.tsize, // source x
    18 * this.map.tsize, // source y
    this.map.tsize, // source width
    this.map.tsize, // source height
    this.hero.screenX, // target x
    this.hero.screenY, // target y
    this.map.tsize, // target width
    this.map.tsize // target height
  );

  // draw map top layer
  this._drawLayer(1);

  // this._drawGrid();

  this.ctx.fillStyle = "#fff";
  this.ctx.fillText("COL: " + this.hero.x + ", ROW: " + this.hero.y, 3, 20);
}
