"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

class Ship {
  constructor(radius, color, posX, posY, startAngle, endAngle, speed) {
    this.radius = radius;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.speed = speed;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, Math.PI*this.startAngle, Math.PI*this.endAngle);
    ctx.fillStyle = this.color;
    ctx.fill();
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
    this.startAngle -= 0.1;
    this.endAngle -= 0.1;
  }

  rotateRight() {
    this.startAngle += 0.1;
    this.endAngle += 0.1;
  }
}

// Listen to key press
document.onkeydown = function(e){
  console.log(e.keyCode);
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
};

var myShip = new Ship(30, "white", canvas.width/2, canvas.height/2, 1, 2.5, 5);
myShip.draw();
