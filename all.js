"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");

var Ship = function () {
  function Ship(radius, color, posX, posY, startAngle, speed) {
    _classCallCheck(this, Ship);

    this.radius = radius;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.startAngle = startAngle;
    this.speed = speed;
  }

  _createClass(Ship, [{
    key: "draw",
    value: function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(this.posX, this.posY, this.radius, this.startAngle, Math.PI * 1.5);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      this.posY -= this.speed;
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      this.posY += this.speed;
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      this.posX -= this.speed;
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      this.posX += this.speed;
    }
  }]);

  return Ship;
}();

// Listen to key press


document.onkeydown = function (e) {
  if (e.keyCode == 38) {
    myShip.moveUp();
  } else if (e.keyCode == 40) {
    myShip.moveDown();
  } else if (e.keyCode == 37) {
    myShip.moveLeft();
  } else if (e.keyCode == 39) {
    myShip.moveRight();
  }
  myShip.draw();
};

var myShip = new Ship(30, "white", canvas.width / 2, canvas.height / 2, 0, 5);
myShip.draw();