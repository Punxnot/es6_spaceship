"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");
var shipCanvas = document.getElementById('shipCanvas');
var shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var thrustSound = new Audio('audio/thrust_sound.mp3');
var acc = 0.4;
var dec = 0.95;
var shipMoving = false;
var shipRotating = false;
var direction = "";
var times = 0;
var angleSteps = 0.05;
var spritePoint = 0;
var explosionGroup = new Set([]);
var rocks = new Set([]);
var sampleRock = null;

function angleToVector(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

function degreeToRadian(degree) {
  return degree * Math.PI / 180;
}

function modulo(n, m) {
  return (n % m + m) % m;
}

function distance(p, q) {
  return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2));
}

var ImageInfo = function () {
  function ImageInfo(size) {
    var lifespan = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var animated = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, ImageInfo);

    this.size = size;
    if (lifespan) {
      this.lifespan = lifespan;
    } else {
      this.lifespan = Infinity;
    }
    this.animated = animated;
  }

  _createClass(ImageInfo, [{
    key: "getSize",
    value: function getSize() {
      return this.size;
    }
  }, {
    key: "getLifeSpan",
    value: function getLifeSpan() {
      return this.lifespan;
    }
  }, {
    key: "getAnimated",
    value: function getAnimated() {
      return this.animated;
    }
  }]);

  return ImageInfo;
}();

// Missile


var missileInfo = new ImageInfo([10, 10], 80);
var missileImage = document.getElementById("missileImg");
var missileSound = new Audio('audio/missile_sound.mp3');
var missiles = [];

// Asteroid
var asteroidInfo = new ImageInfo([90, 90]);
var asteroidImage = document.getElementById("asteroidImg");

var Ship = function () {
  function Ship(pos, vel, angle, size) {
    _classCallCheck(this, Ship);

    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.angle = angle;
    this.size = size;
    this.angle_vel = 0;
    this.thrust = false;
  }

  _createClass(Ship, [{
    key: "draw",
    value: function draw() {
      shipCtx.beginPath();
      shipCtx.save();
      shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
      shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
      shipCtx.rotate(this.angle);
      shipCtx.drawImage(shipImage, spritePoint, 0, 90, 90, -45, -45, 90, 90);
      shipCtx.restore();
      shipCtx.closePath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.drawImage(shipCanvas, this.pos[0], this.pos[1]);
      ctx.closePath();
    }
  }, {
    key: "update",
    value: function update() {
      this.pos[0] = modulo(this.pos[0] + this.vel[0], canvas.width);
      this.pos[1] = modulo(this.pos[1] + this.vel[1], canvas.height);
      this.forward = angleToVector(this.angle);
      this.angle += this.angle_vel;
      if (this.thrust) {
        this.vel[0] += this.forward[0] * acc;
        this.vel[1] += this.forward[1] * acc;
      }
      this.vel[0] *= dec;
      this.vel[1] *= dec;
    }
  }, {
    key: "turnLeft",
    value: function turnLeft() {
      this.angle_vel -= angleSteps;
    }
  }, {
    key: "turnRight",
    value: function turnRight() {
      this.angle_vel += angleSteps;
    }
  }, {
    key: "thrustersOn",
    value: function thrustersOn() {
      this.thrust = true;
      spritePoint = 90;
      thrustSound.play();
    }
  }, {
    key: "thrustersOff",
    value: function thrustersOff() {
      this.thrust = false;
      spritePoint = 0;
      thrustSound.pause();
      thrustSound.currentTime = 0;
    }
  }, {
    key: "shoot",
    value: function shoot() {
      var missileVel = [this.vel[0] + this.forward[0] * 3, this.vel[1] + this.forward[1] * 3];
      var missilePos = [this.pos[0] + 1 * this.forward[0] + 40, this.pos[1] + 1 * this.forward[1] + 40];
      missiles.push(new Sprite(missilePos, missileVel, missileImage, missileInfo));
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.pos;
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return this.size;
    }
  }]);

  return Ship;
}();

var Sprite = function () {
  function Sprite(pos, vel, image, info) {
    _classCallCheck(this, Sprite);

    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.image = image;
    this.info = info;
    this.age = 0;
  }

  _createClass(Sprite, [{
    key: "draw",
    value: function draw() {
      ctx.drawImage(this.image, this.pos[0], this.pos[1]);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.age < this.info.getLifeSpan()) {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.pos[0] = modulo(this.pos[0], canvas.width);
        this.pos[1] = modulo(this.pos[1], canvas.height);
        this.age += 1;
      } else {
        this.pos = [canvas.width, canvas.height];
      }
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return this.info.getSize();
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.pos;
    }
  }, {
    key: "collide",
    value: function collide(otherObj) {
      // To do: calculate radius, replace size with radius;
      if (distance(this.getPosition(), otherObj.getPosition()) <= this.getSize()[0]) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Sprite;
}();

function groupCollide(group, otherObj) {
  var mySet = new Set(group);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = mySet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;

      if (i.collide(otherObj)) {
        var ind = group.indexOf(i);
        group.splice(ind, 1);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (mySet.length != group.length) {
    return true;
  } else {
    return false;
  }
}

function rockSpawner() {
  var rockPos = [100, 100];
  var rockVel = [0, 0];
  var myRock = new Sprite(rockPos, rockVel, asteroidImage, asteroidInfo);
  rocks.add(myRock);
  sampleRock = myRock;
}

// Listen to key press
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 87) {
    if (!shipMoving) {
      myShip.thrustersOn();
      shipMoving = true;
    }
  } else if (e.keyCode == 65) {
    if (!shipRotating) {
      direction = "left";
      myShip.turnLeft();
      shipRotating = true;
    }
  } else if (e.keyCode == 68) {
    if (!shipRotating) {
      direction = "right";
      myShip.turnRight();
      shipRotating = true;
    }
  } else if (e.keyCode == 32) {
    myShip.shoot();
    missileSound.play();
  }
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode == 87) {
    shipMoving = false;
    myShip.thrustersOff();
  } else if (e.keyCode == 65) {
    direction = "right";
    myShip.turnRight();
    shipRotating = false;
  } else if (e.keyCode == 68) {
    direction = "left";
    myShip.turnLeft();
    shipRotating = false;
  }
});

var myShip = new Ship([canvas.width / 2, canvas.height / 2], [0, 0], 0 * Math.PI / 180, [90, 90]);
var sampleRock = rocks[0];
function animateAll() {
  myShip.update();
  myShip.draw();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = missiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var missile = _step2.value;

      missile.update();
      missile.draw();
    }
    // for(let rock of rocks) {
    //   rock.update();
    //   rock.draw();
    // }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  sampleRock.update();
  sampleRock.draw();
  if (sampleRock.collide(myShip)) {
    console.log("Collision detected!");
  }
  // console.log(distance(myShip.getPosition(), sampleRock.getPosition()));
  requestAnimationFrame(animateAll);
}

rockSpawner();

animateAll();