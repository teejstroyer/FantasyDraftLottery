//Canvas Props
let containerSize;
let canvasSize;
let containerX;
let containerY;
let ballSize;
//AnimationProps
let picking = false;
let pickTime = 0;
//Dom Elements
let teamInput;
let teamText;
let teamsRemaining;
//ADD LIST REFERENCE HERE

//State Objects
let balls = [];
let teams = [];
let selectedBalls = [];
let lastPick;

document.body.onload = function() {
  getTeamsFromLocalStorage();
  teamInput = document.getElementById("teams-edit");
  teamText = document.getElementById("teams");
  teamsRemaining = document.getElementById("remaining-teams");

  var teamString = teams.join(',');
  teamInput.value = teamString;
  teamText.textContent = teamString;
}

function setDimensions() {
  var minDim = min([windowWidth, windowHeight]);
  containerSize = minDim / 2;
  canvasSize = containerSize + 10;
  containerX = canvasSize / 2;
  containerY = canvasSize / 2;
  ballSize = containerSize / 6;
}

function setup() {
  setDimensions();
  frameRate(30);
  createCanvas(canvasSize, canvasSize);
  initializeTeams();
  render();
}

function windowResized() {
  setDimensions();
  resizeCanvas(canvasSize, canvasSize);
  initializeTeams();
  render();
}

function getTeamsFromLocalStorage() {
  let teamStorage = localStorage.getItem("teams");
  if (teamStorage)
    teams = teamStorage.split(',').filter(Boolean);
}

function initializeTeams() {
  getTeamsFromLocalStorage();
  balls = [];
  for (var name of teams) {
    balls.push(
      new Ball(
        name,
        containerX,
        containerY,
        ballSize,
        "#ffff",
        containerX,
        containerY,
        containerSize / 2 - ballSize / 2
      )
    );
  }
  clearPickList();
  setTeamsLeft();
  render();
}

function draw() {
  if (pickTime > 2000) {
    picking = false;
    pickTime = 0;

    balls.sort((b1, b2) => b1.distance - b2.distance);
    lastPick = balls.shift();
    addToPickList(lastPick.name);
    setTeamsLeft();
    render();
  }

  if (picking) {
    pickTime += deltaTime;
    render();
  }

  if (lastPick) {
    lastPick.x = containerX;
    lastPick.y = containerY;

    if (lastPick.size < containerSize) {
      lastPick.size *= 1.05;
    }
    if (lastPick.size > containerSize) {
      lastPick.size = containerSize;
    }
    lastPick.display();

    if (lastPick.size == containerSize) {
      textSize(containerSize / lastPick.name.length);
      fill("#000");
      textAlign(CENTER);
      text(lastPick.name, containerX, containerY);
    }
  }
}

function render() {
  //background('#f00');
  strokeWeight(1);
  fill("#0f0");
  circle(containerX, containerY, containerSize);

  balls.forEach((ball) => {
    if (picking) {
      ball.move();
    }
    ball.display();
  });

  noFill();
  strokeWeight(10);
  circle(containerX, containerY, containerSize);
}

function editTeams(caller) {
  if (caller.value != "save") {
    //Add/edit is called
    caller.value = "save";
    teamText.style.display = "none";
    teamInput.style.display = "inline";
    teamInput.setSelectionRange(teamText.textContent.length, teamText.textContent.length);
    teamInput.focus();
  }
  else {
    //Save was called
    caller.value = "add";
    teamText.style.display = "inline";
    teamInput.style.display = "none";

    teamInput.value = teamInput.value.toUpperCase();
    teamText.textContent = teamInput.value;
    localStorage.setItem("teams", teamInput.value);
    initializeTeams();
    clearPickList();
  }
}

function setTeamsLeft() {
  const remainingNames = balls.map(i => i.name);
  teamsRemaining.textContent = "Teams left:" + remainingNames.sort();
}

function makePick() {
  if (balls.length > 0) {
    picking = true;
    lastPick = null;
  }
}

function addToPickList(text) {
  var x = document.getElementById("pickList");
  var node = document.createElement('li');
  node.appendChild(document.createTextNode(text));
  x.appendChild(node);
}

function clearPickList() {
  var x = document.getElementById("pickList");
  while (x.firstChild) {
    x.removeChild(x.firstChild);
  }
}

class Ball {
  constructor(name, x, y, size, fill, containerX, containerY, containerR) {
    this.name = name;
    this.size = size;
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.dx = Math.random() * ballSize - ballSize / 2;
    this.dy = Math.random() * ballSize - ballSize / 2;
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
    var tdx = this.x - this.containerX;
    var tdy = this.y - this.containerY;
    if (Math.sqrt(tdx * tdx + tdy * tdy) >= this.containerR - this.size / 2) {
      var v = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      var angleToCollisionPoint = Math.atan2(-tdy, tdx);
      var oldAngle = Math.atan2(-this.dy, this.dx);
      var newAngle = 2 * angleToCollisionPoint - oldAngle;
      this.dx = -v * Math.cos(newAngle);
      this.dy = v * Math.sin(newAngle);
    }
  }

  get distance() {
    return dist(this.x, this.y, this.containerX, this.containerY);
  }
}
