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
var character1;
var character2;
var index1;
var index2;

//////////////////////////////////////////////////////////////////////////////

generateBlocks();
generateMaze();
generateChars();

window.addEventListener("keypress", function(e) {
    if      (e.keyCode == 119) character1.moveUP();
    else if (e.keyCode == 115) character1.moveDOWN();
    else if (e.keyCode == 97)	 character1.moveLEFT();
    else if (e.keyCode == 100) character1.moveRIGHT();
});
document.onkeydown = function(e) {
  	e = e || window.event;
    if      (e.keyCode == '38')	 character2.moveUP();
    else if (e.keyCode == '40')	 character2.moveDOWN();
    else if (e.keyCode == '37')	 character2.moveLEFT();
    else if (e.keyCode == '39')	 character2.moveRIGHT();
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
	index1 = parseInt(((xlen*ylen)/2)-(xlen/2))+1;
  index2 = parseInt(((xlen*ylen)/2)+(xlen/2))-2;
}
function generateChars() {
  character1 = new Character(index1);
  character2 = new Character(index2);
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
  if (character1 && character2) {
    character1.update().draw();
    character2.update().draw();
  }
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
    context.shadowBlur = 0;
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
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255,255,255,1)"
    context.fillStyle = "rgba(255,255,255,0.5)";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI*2, false);
    context.stroke();
    context.fill();
    context.shadowBlur = 0;
  }
}

//////////////////////////////////////////////////////////////////////////////
