Function.prototype.method = function (name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
};

Number.method ('integer', function () {
  return Math[this < 0 ? 'ceil' : 'floor'](this);
});

//
// Asset loader
//

var Loader = {
  images: {}
};

Loader.loadImage  = function (key, src) {
  var img = new Image();

  var d = new Promise(function (resolve, reject) {
    img.onload = function () {
      this.images[key] = img;
      resolve(img);
    }.bind(this);

    img.onerror = function() {
      reject('Could not load image: ' + src);
    };
  }.bind(this));

  img.src = src;
  return d;
};

Loader.getImage = function (key) {
  return (key in this.images) ? this.images[key] : null;
};

//
// Keyboard handler
//

var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};
Keyboard.lastEvent = null;

Keyboard.listenForEvents = function (keys) {
  window.addEventListener('keydown', this._onKeyDown.bind(this));
  window.addEventListener('keyup', this._onKeyUp.bind(this));

  keys.forEach(function (key) {
    this._keys[key] = false;
  }.bind(this));
};

Keyboard._onKeyDown = function (event) {
  // Prevent repeating event
  // if (this.lastEvent && this.lastEvent.keyCode === event.keyCode) {
  //   return;
  // }
  this.lastEvent = event;
  var keyCode = event.keyCode;
  if (keyCode in this._keys) {
    event.preventDefault();
    this._keys[keyCode] = true;
  }
};

Keyboard._onKeyUp = function (event) {
  this.lastEvent = null;
  var keyCode = event.keyCode;
  if (keyCode in this._keys) {
    event.preventDefault();
    this._keys[keyCode] = false;
  }
};

Keyboard.isDown = function (keyCode) {
  if (!keyCode in this._keys) {
    throw new Error('Keycode ' + keyCode + ' is not being listened to');
  }
  return this._keys[keyCode];
};

Keyboard.resetKeys = function () {
  for (key in this._keys) {
    this._keys[key] = false;
  }
};

var Mouse = {};
Mouse.x = 0;
Mouse.y = 0;

Mouse.trackMouse = function (canvas) {
  this.canvas = canvas;
  document.addEventListener("mousemove", this._mouseMoved.bind(this), false);
}

Mouse._mouseMoved = function (e) {
  this.x = e.clientX - this.canvas.offsetLeft;
  this.y = e.clientY - this.canvas.offsetTop;
}

//
// Game object
//

var Game = {};

Game.run = function (canvas, context) {
  this.ctx = context;
  this.canvas = canvas;
  this._previousElapsed = 0;

  var p = this.load();
  Promise.all(p).then(function (loaded) {
    this.init();
    window.requestAnimationFrame(this.tick);
  }.bind(this));
};

Game.tick = function (elapsed) {
  window.requestAnimationFrame(this.tick);

  // clear previous frame
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // this.ctx.fillStyle = "#000";
  // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  // compute delta time in seconds -- also cap it
  var delta = (elapsed - this._previousElapsed) / 1000.0;
  delta = Math.min(delta, 0.25); // maximum delta of 250 ms
  this._previousElapsed = elapsed;

  this.update(delta);
  this.render();

  // show fps in top left corner
  this.ctx.fillStyle = "#fff";
  this.ctx.fillText("FPS: " + Math.round(1 / delta), 3, 10);
}.bind(Game);

// override these methods to create the game
Game.load = function () {};
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function() {};

//
// start up function
//

window.onload = function () {
  var canvas = document.getElementById("game");
  var context = canvas.getContext("2d");
  Game.run(canvas, context);
}
