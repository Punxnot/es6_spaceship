"use strict";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const shipCanvas = document.getElementById('shipCanvas');
const shipCtx = shipCanvas.getContext("2d");
var shipImage = document.getElementById("shipImg");
var thrustSound = new Audio('audio/thrust_sound.mp3');
var explosionSound = new Audio('audio/explosion_sound.mp3');
const acc = 0.4;
const dec = 0.95;
var shipMoving = false;
var shipRotating = false;
var direction = "";
var angleSteps = 0.05;
var spritePoint = 0;
var explosionGroup = new Set([]);
var rocks = [];
var missiles = [];
var started = false;
var score = 0;
var lives = 3;
var scoreContainer = document.getElementById("scoreContainer");
var livesContainer = document.getElementById("livesContainer");
livesContainer.innerHTML = "Lives: " + lives;

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

// Asteroid
var asteroidInfo = new ImageInfo([90, 90]);
var asteroidImage = document.getElementById("asteroidImg");

// Explosion
var explosionImage = document.getElementById("explosionImg");
var explosionInfo = new ImageInfo([128, 128], 24, true);

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
    let myMissile = new Sprite(missilePos, missileVel, missileImage, missileInfo);
    missiles.push(myMissile);
  }

  getPosition() {
    return this.pos;
  }

  getSize() {
    return this.size;
  }

  getCenter() {
    let x = this.pos[0] + this.getSize()[0] / 2;
    let y = this.pos[1] + this.getSize()[1] / 2;
    return [x, y];
  }
}

class Sprite {
  constructor(pos, vel, image, info) {
    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.image = image;
    this.info = info;
    this.animated = info.getAnimated();
    this.age = 0;
  }

  draw() {
    if(this.animated) {
      ctx.drawImage(this.image,this.age*this.getSize()[0],0,this.getSize()[0],this.getSize()[1],this.pos[0],this.pos[1],this.getSize()[0],this.getSize()[1]);
    } else {
      ctx.drawImage(this.image, this.pos[0], this.pos[1]);
    }
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

  getCenter() {
    let x = this.pos[0] + this.getSize()[0] / 2;
    let y = this.pos[1] + this.getSize()[1] / 2;
    return [x, y];
  }

  collide(otherObj) {
    // To do: calculate radius, replace size with radius;
    if(distance(this.getCenter(), otherObj.getCenter()) <= (this.getSize()[0] + otherObj.getSize()[0])/2) {
      return true;
    } else {
      return false;
    }
  }
}

function groupCollide(group, otherObj) {
  var mySet = new Set(group);
  var count = 0;
  for(let i of mySet) {
    if(i.collide(otherObj)) {
      let ind = group.indexOf(i);
      group.splice(ind, 1);
      otherObj.age = otherObj.lifespan;
      let explosion = new Sprite(i.getPosition(), [0, 0], explosionImage, explosionInfo);
      explosionGroup.add(explosion);
      explosionSound.play();
      if(mySet.size != group.length) {
        count += 1;
      }
    }
  }
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}

function groupGroupCollide(group1, group2) {
  var count = 0;
  var set1 = new Set(group1);
  for(let i of set1) {
    if(groupCollide(group2, i)) {
      count += 1;
      let ind = group1.indexOf(i);
      group1.splice(ind, 1);
    }
  }
  return count;
}

function rockSpawner() {
  let rockPos = [Math.floor(Math.random() * canvas.width) + 1, Math.floor(Math.random() * canvas.height) + 1];
  let rockVel = [0.3, 0.3];
  // Randomly choose value: [1, -1][Math.floor(Math.random() * 2)]
  rockVel[0] = ([1, -1][Math.floor(Math.random() * 2)]) * (rockVel[0] + 0.07 * score);
  rockVel[1] = ([1, -1][Math.floor(Math.random() * 2)]) * (rockVel[1] + 0.07 * score);
  let myRock = new Sprite(rockPos, rockVel, asteroidImage, asteroidInfo);
  if(rocks.length < 6 && started) {
    if(distance(rockPos, myShip.getPosition()) > myShip.getSize()[0]*1.5) {
      rocks.push(myRock);
    }
  }
}

function newGame() {
  rocks = [];
  missiles = [];
  lives = 3;
  score = 0;
  started = true;
  myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0 * Math.PI / 180, [90, 90]);
}

// Listen to key press
document.addEventListener("keydown", function(e){
  if(started) {
    switch(e.keyCode) {
      case 87:
        if(!shipMoving) {
          myShip.thrustersOn();
          shipMoving = true;
        }
        break;
      case 65:
        if(!shipRotating) {
          direction = "left";
          myShip.turnLeft();
          shipRotating = true;
        }
        break;
      case 68:
        if(!shipRotating) {
          direction = "right";
          myShip.turnRight();
          shipRotating = true;
        }
        break;
      case 32:
        myShip.shoot();
        missileSound.play();
        break;
    }
  }
});

document.addEventListener("keyup", function(e){
  if(started) {
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
  }
});

var myShip = new Ship([canvas.width/2, canvas.height/2], [0, 0], 0 * Math.PI / 180, [90, 90]);

function animateAll() {
  myShip.update();
  myShip.draw();
  for(let missile of missiles) {
    missile.update();
    missile.draw();
  }
  for(let rock of rocks) {
    rock.update();
    rock.draw();
  }
  for(let explosion of explosionGroup) {
    explosion.update();
    explosion.draw();
  }
  if(groupCollide(rocks, myShip)) {
    lives -= 1;
    livesContainer.innerHTML = "Lives: " + lives;
  }
  if(lives == 0) {
    started = false;
    rocks = [];
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", canvas.width/2 - 100, canvas.height/2 - 20);
  }

  score += groupGroupCollide(rocks, missiles);
  scoreContainer.innerHTML = "Score: " + score;

  requestAnimationFrame(animateAll);
}

setInterval(function() {
  rockSpawner();
}, 1000);

animateAll();
