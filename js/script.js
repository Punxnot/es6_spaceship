"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

class Ship {
  constructor(radius, color, posX, posY, startAngle, speed) {
    this.radius = radius;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.startAngle = startAngle;
    this.speed = speed;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, this.startAngle, Math.PI*1.5);
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
}

// Listen to key press
document.onkeydown = function(e){
  if(e.keyCode == 38){
    myShip.moveUp();
  } else if(e.keyCode == 40) {
    myShip.moveDown();
  } else if(e.keyCode == 37) {
    myShip.moveLeft();
  } else if(e.keyCode == 39) {
    myShip.moveRight();
  }
  myShip.draw();
};

var myShip = new Ship(30, "white", canvas.width/2, canvas.height/2, 0, 5);
myShip.draw();
