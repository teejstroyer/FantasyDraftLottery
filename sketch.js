let containerSize = 400;
let canvasSize = containerSize + 10;
let containerX = canvasSize / 2;
let containerY = canvasSize / 2;
let ballSize = containerSize / 6;
let balls = [];
let picking = false;

function setup() {
  createCanvas(canvasSize, canvasSize);
  let names = [
    "bob",
    "mike",
    "carl",
    "frank",
    "james",
    "carl",
    "desusj",
    "fin",
    "red",
    "bar",
    "kramer",
    "jay",
  ];

  for (var name of names) {
    balls.push(
      new Ball(
        name,
        containerX,
        containerY,
        ballSize,
        "#fff9",
        containerX,
        containerY,
        containerSize / 2 - ballSize / 2
      )
    );
  }
  pickAlert("");
  render();
}

let pickTime = 0;
let scaling = false;
let selectedBalls = [];

function draw() {
  //background('#fff');
  if (pickTime > 2000) {
    picking = false;
    pickTime = 0;
    
    balls.sort((b1, b2) => b1.distance-b2.distance);
    var pick = balls.shift();
    
    pickAlert(pick.name);
    addToPickList(pick.name);
    
  }
  
  if(scaling){
    
  }

  if (picking) {
    pickTime += deltaTime;
    render();
  }
}

function render() {
  DrawBowl();
  MoveBalls();
  DrawOuterRing();
}

function makePick() {
  picking = true;
  pickAlert("");
}

function addToPickList(text){
  var x = document.getElementById("pickList");
  var node = document.createElement('li');
  node.appendChild(document.createTextNode(text));
  x.appendChild(node);
}

function pickAlert(text) {
  var x = document.getElementById("pickIn");
  x.innerHTML = text;
}

function MoveBalls() {
  balls.forEach((ball) => {
    ball.move(deltaTime);
    ball.display();
  });
}

function DrawBowl() {
  strokeWeight(1);
  fill("#0f0");
  circle(containerX, containerY, containerSize);
}

function DrawOuterRing() {
  noFill();
  strokeWeight(10);
  circle(containerX, containerY, containerSize - 10);
}

class Ball {
  constructor(name, x, y, size, fill, containerX, containerY, containerR) {
    this.name = name;
    this.size = size;
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.dx =
      (Math.random() < 0.5 ? 1 : -1) *
      Math.floor((Math.random() * size) / 2 + 1);
    this.dy =
      (Math.random() < 0.5 ? 1 : -1) *
      Math.floor((Math.random() * size) / 2 + 1);
    this.containerX = containerX;
    this.containerY = containerY;
    this.containerR = containerR;
  }

  display() {
    fill(this.fill);
    circle(this.x, this.y, this.size);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    var dx = this.x - this.containerX;
    var dy = this.y - this.containerY;
    if (Math.sqrt(dx * dx + dy * dy) >= this.containerR - this.size / 2) {
      var v = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      var angleToCollisionPoint = Math.atan2(-dy, dx);
      var oldAngle = Math.atan2(-this.dy, this.dx);
      var newAngle = 2 * angleToCollisionPoint - oldAngle;
      this.dx = -v * Math.cos(newAngle);
      this.dy = v * Math.sin(newAngle);
      
    }
  }
  
  get distance(){
    return dist(this.x,this.y,this.containerX, this.containerY);
  }
}
