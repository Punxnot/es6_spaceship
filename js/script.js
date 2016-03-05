"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
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

class Ship {
  constructor(pos, vel, angle) {
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
    shipCtx.beginPath();

    if(shipRotating) {
      times += 1;
      shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
      shipCtx.translate(shipCanvas.width / 2, shipCanvas.height / 2);
      shipCtx.rotate(this.angle);
      shipCtx.translate(-shipCanvas.width / 2, -shipCanvas.height / 2);
    }
    shipCtx.drawImage(shipImage, 10, 10);
    shipCtx.closePath();
  }

  update() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.forward = angleToVector(this.angle*times);
    console.log(this.angle*times);
    if(shipRotating) {
      this.angle = this.angle_vel;
    }
    if(this.thrust) {
      this.vel[0] += this.forward[0];
      this.vel[1] += this.forward[1];
    }
    this.vel[0] *= dec;
    this.vel[1] *= dec;
  }

  turnLeft() {
    this.angle_vel -= angleSteps;
  }

  turnRight() {
    this.angle_vel += angleSteps;
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
    if(!shipMoving) {
      myShip.thrustersOn();
      shipMoving = true;
    }
  } else if(e.keyCode == 65) {
    if(!shipRotating){
      myShip.turnLeft();
      shipRotating = true;
    }
  } else if(e.keyCode == 68) {
    if(!shipRotating){
      myShip.turnRight();
      shipRotating = true;
    }
  }
});

document.addEventListener("keyup", function(e){
  if(e.keyCode == 38){
    shipMoving = false;
    myShip.thrustersOff();
  } else if(e.keyCode == 65) {
    shipRotating = false;
    myShip.turnRight();
  } else if(e.keyCode == 68) {
    myShip.turnLeft();
    shipRotating = false;
  }
});

var myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0 * Math.PI / 180);

window.setInterval(function() {
  myShip.update();
  myShip.draw();
}, 60)
