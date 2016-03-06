"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");
var shipCanvas = document.getElementById('shipCanvas');
var shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var acc = 0.4;
var dec = 0.95;
var shipMoving = false;
var shipRotating = false;
var direction = "";
var times = 0;
var angleSteps = 0.05;
var spritePoint = 0;

function angleToVector(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

function degreeToRadian(degree) {
  return degree * Math.PI / 180;
}

// Modulo
function mod(n, m) {
  return (n % m + m) % m;
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


var missileInfo = new ImageInfo([10, 10], 50);
var missileImage = document.getElementById("missileImg");
var missileLifespan = 50;
var aMissile;

var Ship = function () {
  function Ship(pos, vel, angle) {
    _classCallCheck(this, Ship);

    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.angle = angle;
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
      this.pos[0] = mod(this.pos[0] + this.vel[0], canvas.width);
      this.pos[1] = mod(this.pos[1] + this.vel[1], canvas.height);
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
    }
  }, {
    key: "thrustersOff",
    value: function thrustersOff() {
      this.thrust = false;
      spritePoint = 0;
    }
  }, {
    key: "shoot",
    value: function shoot() {
      console.log("Shoot");
      var missileVel = [this.vel[0] + this.forward[0] * 3, this.vel[1] + this.forward[1] * 3];
      var missilePos = [this.pos[0] + 1 * this.forward[0] + 40, this.pos[1] + 1 * this.forward[1] + 40];
      this.aMissile = new Missile(missilePos, missileVel, missileImage);
      this.aMissile.draw();
      console.log("shipPos" + this.pos);
      console.log("missilePos" + missilePos);
    }
  }]);

  return Ship;
}();

var Missile = function () {
  function Missile(pos, vel, image) {
    _classCallCheck(this, Missile);

    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.image = image;
    this.age = 0;
  }

  _createClass(Missile, [{
    key: "draw",
    value: function draw() {
      console.log("Draw missile");
      ctx.drawImage(this.image, this.pos[0], this.pos[1]);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.age < missileLifespan) {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.pos[0] = mod(this.pos[0], canvas.width);
        this.pos[1] = mod(this.pos[1], canvas.height);
        this.age += 1;
      } else {
        this.pos = [canvas.width, canvas.height];
      }
    }
  }]);

  return Missile;
}();

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

var myShip = new Ship([canvas.width / 2, canvas.height / 2], [0, 0], 0 * Math.PI / 180);

function animateAll() {
  myShip.update();
  myShip.draw();
  if (myShip.aMissile) {
    myShip.aMissile.draw();
    myShip.aMissile.update();
  }
  requestAnimationFrame(animateAll);
}

animateAll();