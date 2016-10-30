//////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById('maze');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
setInterval(world,30);

//////////////////////////////////////////////////////////////////////////////

var blocks = [];
var dimention = 50;
var xlen = parseInt(canvas.width  / dimention);
var ylen = parseInt(canvas.height / dimention);
var xgap = (canvas.width  % dimention)/2;
var ygap = (canvas.height % dimention)/2;
var index;
var goal_index;

var p1pos = firebase.database().ref('/p1pos/');
var p2pos = firebase.database().ref('/p2pos/');
var gpos = firebase.database().ref('/gpos/');

//////////////////////////////////////////////////////////////////////////////

generateBlocks();
generateMaze();

document.onkeydown = function(e) {
    	e = e || window.event;
	    if      (e.keyCode == '38')	 moveUP();
	    else if (e.keyCode == '40')	 moveDOWN();
	    else if (e.keyCode == '37')	 moveLEFT();
	    else if (e.keyCode == '39')	 moveRIGHT();
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
	setCharPos(index);
  goal_index = parseInt(((xlen*ylen)/2)+(xlen/2))-2;
  setGoalPos(goal_index);
}
function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width,canvas.height);
}
function randomBetween(min,max) {
	return Math.floor((Math.random()*(max - min)+min));
}
function moveUP() {
	if (index-xlen >= 0) {
    if (blocks[index-xlen].wall[2] == 1) {
      blocks[index-xlen].visible[2] = 1;
    }
    else {
      blocks[index].isActive = false;
      index-=xlen; setCharPos(index);
    }
	}
}
function moveDOWN() {
	if (index+xlen <= xlen*ylen-1) {
    if (blocks[index].wall[2] == 1) {
      blocks[index].visible[2] = 1;
    }
    else {
      blocks[index].isActive = false;
      index+=xlen; setCharPos(index);
    }
	}
}
function moveLEFT() {
	if ((index)%xlen != 0) {
    if (blocks[index].wall[3] == 1) {
      blocks[index].visible[3] = 1;
    }
    else {
      blocks[index].isActive = false;
      index-=1; setCharPos(index);
    }
	}
}
function moveRIGHT() {
	if ((index+1)%xlen != 0) {
    if (blocks[index+1].wall[3] == 1) {
      blocks[index+1].visible[3] = 1;
    }
    else {
      blocks[index].isActive = false;
      index+=1; setCharPos(index);
    }
	}
}
function setCharPos(i) {
	blocks[i].isActive = true;
}
function setGoalPos(i) {
  blocks[i].isActive = true;
}

//////////////////////////////////////////////////////////////////////////////

function world() {
	clearCanvas();
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].update().draw();
	}
  console.log("pos1 "+p1pos);
}

//////////////////////////////////////////////////////////////////////////////

function Block(x,y,dim) {
	this.x = x;
	this.y = y;
	this.dim = dim;

	this.wall = [0,0,0,0];
  this.visible = [0,0,0,0];

	this.update = function() {
		return this;
	}

	this.drawWall = function() {
		context.lineWidth = 5;
    context.shadowColor = "#fff";
    context.shadowBlur = 15;
    context.lineCap = 'round';
		context.strokeStyle = "rgba(0,0,0,1)";
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
  this.x = 
  this.radius = dim/2-5;
  this.i = index;

  this.update = function() {
    return this;
  }

  this.draw = function() {

  }
}

//////////////////////////////////////////////////////////////////////////////
