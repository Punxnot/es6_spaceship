"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var thrustSound = new Audio('audio/thrust_sound.mp3');
var acc = 0.4;
var dec = 0.95;
var shipMoving = false;
var shipRotating = false;
var direction = "";
var times = 0;
var angleSteps = 0.05;
var spritePoint = 0;
var explosionGroup = new Set([]);
var rocks = new Set([]);
var sampleRock = null;

function angleToVector(ang) {
  return [Math.cos(ang), Math.sin(ang)];
}

function degreeToRadian(degree) {
  return degree * Math.PI / 180;
}

function modulo(n, m) {
  return ((n % m) + m) % m;
}

function distance(p, q) {
  return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2));
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
var missileInfo = new ImageInfo([10, 10], 80);
var missileImage = document.getElementById("missileImg");
var missileSound = new Audio('audio/missile_sound.mp3');
var missiles = [];

// Asteroid
var asteroidInfo = new ImageInfo([90, 90]);
var asteroidImage = document.getElementById("asteroidImg");

class Ship {
  constructor(pos, vel, angle, size) {
    this.pos = [pos[0],pos[1]];
    this.vel = [vel[0],vel[1]];
    this.angle = angle;
    this.size = size;
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
    this.pos[0] = modulo((this.pos[0] + this.vel[0]), canvas.width);
    this.pos[1] = modulo((this.pos[1] + this.vel[1]), canvas.height);
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
    thrustSound.play();
  }

  thrustersOff() {
    this.thrust = false;
    spritePoint = 0;
    thrustSound.pause();
    thrustSound.currentTime = 0;
  }

  shoot() {
    let missileVel = [this.vel[0] + this.forward[0] * 3, this.vel[1] + this.forward[1] * 3];
    let missilePos = [(this.pos[0] + 1 * this.forward[0]) + 40, (this.pos[1] + 1 * this.forward[1]) + 40];
    missiles.push(new Sprite(missilePos, missileVel, missileImage, missileInfo));
  }

  getPosition() {
    return this.pos;
  }

  getSize() {
    return this.size;
  }
}

class Sprite {
  constructor(pos, vel, image, info) {
    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.image = image;
    this.info = info;
    this.age = 0;
  }

  draw() {
    ctx.drawImage(this.image, this.pos[0], this.pos[1]);
  }

  update() {
    if(this.age < this.info.getLifeSpan()) {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.pos[0] = modulo(this.pos[0], canvas.width);
      this.pos[1] = modulo(this.pos[1], canvas.height);
      this.age += 1;
    } else {
      this.pos = [canvas.width, canvas.height];
    }
  }

  getSize() {
    return this.info.getSize();
  }

  getPosition() {
    return this.pos;
  }

  collide(otherObj) {
    // To do: calculate radius, replace size with radius;
    if(distance(this.getPosition(), otherObj.getPosition()) <= this.getSize()[0]) {
      return true;
    } else {
      return false;
    }
  }
}

function groupCollide(group, otherObj) {
  var mySet = new Set(group);
  for(let i of mySet) {
    if(i.collide(otherObj)) {
      var ind = group.indexOf(i);
      group.splice(ind, 1);
    }
  }
  if(mySet.length != group.length) {
    return true;
  } else {
    return false;
  }
}

function rockSpawner() {
  let rockPos = [100, 100];
  let rockVel = [0, 0];
  let myRock = new Sprite(rockPos, rockVel, asteroidImage, asteroidInfo);
  rocks.add(myRock);
  sampleRock = myRock;
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
    missileSound.play();
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

var myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0 * Math.PI / 180, [90, 90]);
var sampleRock = rocks[0];
function animateAll() {
  myShip.update();
  myShip.draw();
  for(let missile of missiles) {
    missile.update();
    missile.draw();
  }
  // for(let rock of rocks) {
  //   rock.update();
  //   rock.draw();
  // }
  sampleRock.update();
  sampleRock.draw();
  if(sampleRock.collide(myShip)) {
    console.log("Collision detected!");
  }
  // console.log(distance(myShip.getPosition(), sampleRock.getPosition()));
  requestAnimationFrame(animateAll);
}

rockSpawner();

animateAll();
