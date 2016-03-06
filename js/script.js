"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
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
  return ((n % m) + m) % m;
}

class ImageInfo {
  constructor(size, lifespan = null, animated = false) {
    this.size = size;
    if(lifespan) {
      this.lifespan = lifespan;
    } else {
      this.lifespan = Infinity;
    }
    this.animated = animated;
  }

  getSize() {
    return this.size;
  }

  getLifeSpan() {
    return this.lifespan;
  }

  getAnimated() {
    return this.animated;
  }
}

// Missile
var missileInfo = new ImageInfo([10, 10], 50);
var missileImage = document.getElementById("missileImg");
var missileLifespan = 80;
var aMissile;

class Ship {
  constructor(pos, vel, angle) {
    this.pos = [pos[0],pos[1]];
    this.vel = [vel[0],vel[1]];
    this.angle = angle;
    this.angle_vel = 0;
    this.thrust = false;
  }

  draw() {
    shipCtx.beginPath();
    shipCtx.save();
    shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
    shipCtx.translate(shipCanvas.width/2, shipCanvas.height/2);
    shipCtx.rotate(this.angle);
    shipCtx.drawImage(shipImage,spritePoint,0,90,90,-45,-45,90,90);
    shipCtx.restore();
    shipCtx.closePath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.drawImage(shipCanvas, this.pos[0], this.pos[1]);
    ctx.closePath();
  }

  update() {
    this.pos[0] = mod((this.pos[0] + this.vel[0]), canvas.width);
    this.pos[1] = mod((this.pos[1] + this.vel[1]), canvas.height);
    this.forward = angleToVector(this.angle);
    this.angle += this.angle_vel;
    if(this.thrust) {
      this.vel[0] += this.forward[0] * acc;
      this.vel[1] += this.forward[1] * acc;
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
    spritePoint = 90;
  }

  thrustersOff() {
    this.thrust = false;
    spritePoint = 0;
  }

  shoot() {
    console.log("Shoot");
    let missileVel = [this.vel[0] + this.forward[0] * 3, this.vel[1] + this.forward[1] * 3];
    let missilePos = [(this.pos[0] + 1 * this.forward[0]) + 40, (this.pos[1] + 1 * this.forward[1]) + 40];
    this.aMissile = new Missile(missilePos, missileVel, missileImage);
    this.aMissile.draw();
    console.log("shipPos" + this.pos);
    console.log("missilePos" + missilePos);
  }
}

class Missile {
  constructor(pos, vel, image) {
    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.image = image;
    this.age = 0;
  }

  draw() {
    console.log("Draw missile");
    ctx.drawImage(this.image, this.pos[0], this.pos[1]);
  }

  update() {
    if(this.age < missileLifespan) {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.pos[0] = mod(this.pos[0], canvas.width);
      this.pos[1] = mod(this.pos[1], canvas.height);
      this.age += 1;
    } else {
      this.pos = [canvas.width, canvas.height];
    }
  }
}

// Listen to key press
document.addEventListener("keydown", function(e){
  if(e.keyCode == 87){
    if(!shipMoving) {
      myShip.thrustersOn();
      shipMoving = true;
    }
  } else if(e.keyCode == 65) {
    if(!shipRotating){
      direction = "left";
      myShip.turnLeft();
      shipRotating = true;
    }
  } else if(e.keyCode == 68) {
    if(!shipRotating){
      direction = "right";
      myShip.turnRight();
      shipRotating = true;
    }
  } else if(e.keyCode == 32) {
    myShip.shoot();
  }
});

document.addEventListener("keyup", function(e){
  if(e.keyCode == 87){
    shipMoving = false;
    myShip.thrustersOff();
  } else if(e.keyCode == 65) {
    direction = "right";
    myShip.turnRight();
    shipRotating = false;
  } else if(e.keyCode == 68) {
    direction = "left";
    myShip.turnLeft();
    shipRotating = false;
  }
});

var myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0 * Math.PI / 180);

function animateAll() {
  myShip.update();
  myShip.draw();
  if(myShip.aMissile) {
    myShip.aMissile.draw();
    myShip.aMissile.update();
  }
  requestAnimationFrame(animateAll);
}

animateAll();
