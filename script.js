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
var move_ctr = -1;
var bump_ctr = 0;
var score = 0;

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
      bump_ctr++;
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
      bump_ctr++;
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
      bump_ctr++;
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
      bump_ctr++;
      blocks[index+1].visible[3] = 1;
    }
    else {
      blocks[index].isActive = false;
      index+=1; setCharPos(index);
    }
	}
}
function setCharPos(i) {
  move_ctr++;
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
  console.log('score: '+score+' --- '+'moves : '+move_ctr+' --- '+'bumps : '+bump_ctr);
}

//////////////////////////////////////////////////////////////////////////////

function Block(x,y,dim) {
	this.x = x;
	this.y = y;
	this.dim = dim;
	this.isActive = false;
	this.radius = dim/2-5;

	this.wall = [0,0,0,0];
  this.visible = [0,0,0,0];

	this.update = function() {
		return this;
	}

	this.drawWall = function() {
		context.lineWidth = 1;
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
		context.lineWidth = 1;
	}

	this.drawChar = function() {
		if (this.isActive) {
			context.fillStyle = 'rgba(255,255,255,0.5)';
			context.strokeStyle = 'rgba(255,255,255,1)';
			context.beginPath();
			context.arc(this.x+this.dim/2, this.y+this.dim/2, this.radius, Math.PI*2, false);
			context.fill();
			context.stroke();
		}
	}

	this.draw = function() {

    context.fillStyle = "rgba(255,255,255,0.2)";
    context.fillRect(this.x, this.y, this.dim, this.dim);

    this.drawWall();
		this.drawChar();
	}
}

//////////////////////////////////////////////////////////////////////////////
