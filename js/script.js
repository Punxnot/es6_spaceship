"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var rotationOn = false;

function angleToVector(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

class Ship {
  constructor(pos, vel, angle, thrust) {
    this.pos = [pos[0],pos[1]];
    this.vel = [vel[0],vel[1]];
    this.angle = angle;
    this.angle_vel = 0;
    this.thrust = false;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(shipCanvas, this.pos[0], this.pos[1]);
    ctx.closePath();
    shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
    shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
    if(rotationOn) {
      shipCtx.rotate(this.angle*Math.PI/180);
    }
    shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
    shipCtx.beginPath();
    shipCtx.drawImage(shipImage, 10, 10);
    shipCtx.closePath();
  }

  update() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.angle = this.angle_vel;
    this.forward = angleToVector(this.angle);
    if(this.thrust) {
      this.vel[0] += this.forward[0];
      this.vel[1] += this.forward[1];
    }
    console.log(this.angle);
  }

  turnLeft() {
    this.angle_vel = -3;
  }

  turnRight() {
    this.angle_vel = 3;
  }

  thrustersOn() {
    this.thrust = true;
  }

  thrustersOff() {
    this.thrust = false;
  }
}

// Listen to key press
document.addEventListener("keydown", function(e){
  if(e.keyCode == 38){
    myShip.thrustersOn();
  } else if(e.keyCode == 65) {
    rotationOn = true;
    myShip.turnLeft();
  } else if(e.keyCode == 68) {
    rotationOn = true;
    myShip.turnRight();
  }
});

document.addEventListener("keyup", function(e){
  if(e.keyCode == 38){
    myShip.thrustersOff();
  } else if(e.keyCode == 65) {
    rotationOn = false;
  } else if(e.keyCode == 68) {
    rotationOn = false;
  }
});

var myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0, false);

window.setInterval(function() {
  myShip.draw();
  myShip.update();
}, 60)
