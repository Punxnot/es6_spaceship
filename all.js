"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");
var shipCanvas = document.getElementById('shipCanvas');
var shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");

var Ship = function () {
  function Ship(posX, posY, speed) {
    _classCallCheck(this, Ship);

    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
  }

  _createClass(Ship, [{
    key: "draw",
    value: function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shipCtx.drawImage(shipImage, 10, 10);
      ctx.beginPath();
      ctx.drawImage(shipCanvas, this.posX, this.posY);
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
  }, {
    key: "rotateLeft",
    value: function rotateLeft() {
      shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
      shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
      shipCtx.rotate(-5 * Math.PI / 180);
      shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
    }
  }, {
    key: "rotateRight",
    value: function rotateRight() {
      shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
      shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
      shipCtx.rotate(5 * Math.PI / 180);
      shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
    }
  }]);

  return Ship;
}();

// Listen to key press

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 38) {
    myShip.moveUp();
  } else if (e.keyCode == 40) {
    myShip.moveDown();
  } else if (e.keyCode == 37) {
    myShip.moveLeft();
  } else if (e.keyCode == 39) {
    myShip.moveRight();
  } else if (e.keyCode == 65) {
    myShip.rotateLeft();
  } else if (e.keyCode == 68) {
    myShip.rotateRight();
  }
  myShip.draw();
});

var myShip = new Ship(canvas.width / 2, canvas.height / 2, 5);
myShip.draw();