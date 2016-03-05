"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");
var shipCanvas = document.getElementById('shipCanvas');
var shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var acc = 0.4;
var dec = 0.9;
var shipMoving = false;
var shipRotating = false;
var times = 0;
var angleSteps = 0.05;

function angleToVector(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

function degreeToRadian(degree) {
  return degree * Math.PI / 180;
}

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(shipCanvas, this.pos[0], this.pos[1]);
      ctx.closePath();
      shipCtx.beginPath();

      if (shipRotating) {
        times += 1;
        shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
        shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
        shipCtx.rotate(this.angle);
        shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
      }
      shipCtx.drawImage(shipImage, 10, 10);
      shipCtx.closePath();
    }
  }, {
    key: "update",
    value: function update() {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.forward = angleToVector(this.angle * times);
      console.log(this.angle * times);
      if (shipRotating) {
        this.angle = this.angle_vel;
      }
      if (this.thrust) {
        this.vel[0] += this.forward[0];
        this.vel[1] += this.forward[1];
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
    }
  }, {
    key: "thrustersOff",
    value: function thrustersOff() {
      this.thrust = false;
    }
  }]);

  return Ship;
}();

// Listen to key press


document.addEventListener("keydown", function (e) {
  if (e.keyCode == 38) {
    if (!shipMoving) {
      myShip.thrustersOn();
      shipMoving = true;
    }
  } else if (e.keyCode == 65) {
    if (!shipRotating) {
      myShip.turnLeft();
      shipRotating = true;
    }
  } else if (e.keyCode == 68) {
    if (!shipRotating) {
      myShip.turnRight();
      shipRotating = true;
    }
  }
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode == 38) {
    shipMoving = false;
    myShip.thrustersOff();
  } else if (e.keyCode == 65) {
    shipRotating = false;
    myShip.turnRight();
  } else if (e.keyCode == 68) {
    myShip.turnLeft();
    shipRotating = false;
  }
});

var myShip = new Ship([canvas.width / 2, canvas.height / 2], [0, 0], 0 * Math.PI / 180);

window.setInterval(function () {
  myShip.update();
  myShip.draw();
}, 60);