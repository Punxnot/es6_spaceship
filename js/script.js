"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");

class Ship {
  constructor(posX, posY, speed) {
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shipCtx.drawImage(shipImage, 10, 10);
    ctx.beginPath();
    ctx.drawImage(shipCanvas, this.posX, this.posY);
    ctx.closePath();
  }

  moveUp() {
    this.posY -= this.speed;
  }

  moveDown() {
    this.posY += this.speed;
  }

  moveLeft() {
    this.posX -= this.speed;
  }

  moveRight() {
    this.posX += this.speed;
  }

  rotateLeft() {
    shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
    shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
    shipCtx.rotate(-5*Math.PI/180);
    shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
  }

  rotateRight() {
    shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
    shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
    shipCtx.rotate(5*Math.PI/180);
    shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
  }
}

// Listen to key press

document.addEventListener("keydown", function(e){
  if(e.keyCode == 38){
    myShip.moveUp();
  } else if(e.keyCode == 40) {
    myShip.moveDown();
  } else if(e.keyCode == 37) {
    myShip.moveLeft();
  } else if(e.keyCode == 39) {
    myShip.moveRight();
  } else if(e.keyCode == 65) {
    myShip.rotateLeft();
  } else if(e.keyCode == 68) {
    myShip.rotateRight();
  }
  myShip.draw();
});

var myShip = new Ship(canvas.width/2, canvas.height/2, 5);
myShip.draw();
