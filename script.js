//////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById('maze');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// setInterval(world,30);

//////////////////////////////////////////////////////////////////////////////

var blocks = [];
var dimention = 50;
var xlen = parseInt(canvas.width  / dimention);
var ylen = parseInt(canvas.height / dimention);
var xgap = (canvas.width  % dimention)/2;
var ygap = (canvas.height % dimention)/2;
var character;
var goal;
var index;
var goal_index;

var p1pos = firebase.database().ref('/p1pos/');
var p2pos = firebase.database().ref('/p2pos/');
var gpos = firebase.database().ref('/gpos/');

//////////////////////////////////////////////////////////////////////////////

generateBlocks();
generateMaze();
generateChars();
world();

document.onkeydown = function(e) {
    	e = e || window.event;
	    if      (e.keyCode == '38')	 character.moveUP();
	    else if (e.keyCode == '40')	 character.moveDOWN();
	    else if (e.keyCode == '37')	 character.moveLEFT();
	    else if (e.keyCode == '39')	 character.moveRIGHT();
      world();
};

//////////////////////////////////////////////////////////////////////////////

function pathFinder() {
  // ...
}
function generateMaze() {
  for (var i = 0; i < blocks.length; i++) {
    if      ((i)%xlen == 0) {
      if (randomBetween(0,3) == 0) blocks[i].wall[2] = 1;
    }
    else if (i > xlen*(ylen-1)) {
      if (randomBetween(0,3) == 0) blocks[i].wall[3] = 1;
    }
    else {
      if (randomBetween(0,3) == 0) blocks[i].wall[2] = 1;
      if (randomBetween(0,3) == 0) blocks[i].wall[3] = 1;
    }
  }
  pathFinder();
}
function generateBlocks() {
	for (var i = ygap; i < canvas.height-ygap; i+=dimention) {
		for (var j = xgap; j < canvas.width-xgap; j+=dimention) {
			blocks.push(new Block(j, i, dimention));
		}
	}
	index = parseInt(((xlen*ylen)/2)-(xlen/2))+1;
  goal_index = parseInt(((xlen*ylen)/2)+(xlen/2))-2;
}
function generateChars() {
  character = new Character(index);
  goal = new Character(goal_index);
}
function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width,canvas.height);
}
function randomBetween(min,max) {
	return Math.floor((Math.random()*(max - min)+min));
}

//////////////////////////////////////////////////////////////////////////////

function world() {
	clearCanvas();
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].update().draw();
	}
  if (character && goal) {
    character.update().draw();
    goal.update().draw();
  }
}

//////////////////////////////////////////////////////////////////////////////

function Block(x,y,dim) {
	this.x = x;
	this.y = y;
	this.dim = dim;

	this.wall = [0,0,0,0];
  this.visible = [1,1,1,1];

	this.update = function() {
		return this;
	}

	this.drawWall = function() {
		context.lineWidth = 5;
    context.shadowColor = "#fff";
    context.shadowBlur = 15;
    context.lineCap = "round";
		context.strokeStyle = "rgba(255,255,255,1)";
		if (this.wall[2] == 1 && this.visible[2] == 1) {
			context.beginPath();
			context.moveTo(this.x+this.dim, this.y+this.dim);
			context.lineTo(this.x,          this.y+this.dim);
			context.stroke();
		}
		if (this.wall[3] == 1 && this.visible[3] == 1) {
			context.beginPath();
			context.moveTo(this.x,          this.y+this.dim);
			context.lineTo(this.x,          this.y);
			context.stroke();
		}
    context.shadowBlur = 0;
		context.lineWidth = 1;
	}

	this.draw = function() {
    this.drawWall();
	}
}

function Character(index) {
  this.i = index;
  this.radius = dimention/2-5;

  this.moveUP = function() {
  	if (this.i-xlen >= 0) {
      if (blocks[this.i-xlen].wall[2] == 1) {
        blocks[this.i-xlen].visible[2] = 1;
      }
      else {
        this.i-=xlen;
      }
  	}
  }
  this.moveDOWN = function() {
  	if (this.i+xlen <= xlen*ylen-1) {
      if (blocks[this.i].wall[2] == 1) {
        blocks[this.i].visible[2] = 1;
      }
      else {
        this.i+=xlen;
      }
  	}
  }
  this.moveLEFT = function() {
  	if ((this.i)%xlen != 0) {
      if (blocks[this.i].wall[3] == 1) {
        blocks[this.i].visible[3] = 1;
      }
      else {
        this.i-=1;
      }
  	}
  }
  this.moveRIGHT = function() {
  	if ((this.i+1)%xlen != 0) {
      if (blocks[this.i+1].wall[3] == 1) {
        blocks[this.i+1].visible[3] = 1;
      }
      else {
        this.i+=1;
      }
  	}
  }

  this.update = function() {
    this.x = blocks[this.i].x + (dimention/2);
    this.y = blocks[this.i].y + (dimention/2);
    return this;
  }

  this.draw = function() {
    context.lineWidth = 5;
    context.shadowColor = "#fff";
    context.shadowBlur = 15;
    context.strokeStyle = "rgba(255,255,255,1)"
    context.fillStyle = "rgba(255,255,255,0.5)";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI*2, false);
    context.stroke();
    context.fill();
  }
}

//////////////////////////////////////////////////////////////////////////////
