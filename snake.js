
document.addEventListener("keydown", changeDir);
let dir = "right";
let tailDir;
let goStart = Date.now();
let score = 0;

function View(params) {
	this.canvas = document.getElementById("canvas");
	this.ctx = canvas.getContext('2d');

	this.boardSize = params.boardSize;
	this.box = params.box;
	this.VACANT = params.VACANT;
	this.bodyColor = params.bodyColor;
	this.speed = params.speed;
	this.foodColor = params.foodColor;
	this.headColor = params.headColor;
}

let viewParams = {
	boardSize: 17,
	box: 32,
	VACANT: "white",
	bodyColor: "green",
	headColor: "darkgreen",
	speed: 500,
	foodColor: "red"
};
let view = new View(viewParams);

View.prototype.updateScore = function() {
	score += 10;
	let message = "Score: " + score;
	let scoreBoard = document.getElementById("score");
	scoreBoard.innerHTML = message;
}

View.prototype.drawHead = function(array, color) {
	this.ctx.fillStyle = color;
	this.ctx.strokeStyle = "black";
	this.ctx.fillRect(array[0].x*this.box, array[0].y*this.box, this.box, this.box);
	this.ctx.strokeRect(array[0].x*this.box, array[0].y*this.box, this.box, this.box);
}

View.prototype.drawSnake = function(array, body, head) {
	this.ctx.fillStyle = head;
	this.ctx.strokeStyle = "black";
	this.ctx.fillRect(array[0].x*this.box, array[0].y*this.box, this.box, this.box);
	this.ctx.strokeRect(array[0].x*this.box, array[0].y*this.box, this.box, this.box);
	this.ctx.fillStyle = body;
	this.ctx.strokeStyle = "black";
	for (i=1; i<array.length; i++) {
		this.ctx.fillRect(array[i].x*this.box, array[i].y*this.box, this.box, this.box);
		this.ctx.strokeRect(array[i].x*this.box, array[i].y*this.box, this.box, this.box);
	}	
};

View.prototype.drawBox = function(x, y, color) {
	this.ctx.fillStyle = color;
	this.ctx.strokeStyle = "black";
	this.ctx.fillRect(x*this.box, y*this.box, this.box, this.box);	
	this.ctx.strokeRect(x*this.box, y*this.box, this.box, this.box);
};

View.prototype.drawBoard = function() {
	for (r = 0; r<this.boardSize; r++) {
		for (c=0; c<this.boardSize; c++) {
			this.drawBox(r, c, this.VACANT);
		}
	}
}
view.drawBoard();

View.prototype.gameOver = function() {
	if (snake.collision()) {
		alert("Game over!");
		return true;
	}
}

function Snake(params) {
	this.canvas = document.getElementById("canvas");
	this.ctx = canvas.getContext('2d');

	this.coords = params.coords;
}

let snakeParams = {
	coords: [{x: 7, y: 8}, {x: 6, y: 8}, {x: 5, y: 8}]
}
let snake = new Snake(snakeParams);

Snake.prototype.food = {
	x: 0,
	y: 0
}

Snake.prototype.collision = function() {
	for (i=1; i<this.coords.length; i++) {
		if (this.coords[0].x === this.coords[i].x && this.coords[0].y === this.coords[i].y) {
			return true;
		} 
	}
	if (this.coords[0].x >= view.boardSize || this.coords[0].y >= view.boardSize) {
		return true;
	} else if (this.coords[0].x < 0 || this.coords[0].y < 0) {
		return true;
	}	
}

Snake.prototype.eat = function() {
	if (this.coords[0].x === this.food.x && this.coords[0].y === this.food.y) {
		return true;
	}
}

Snake.prototype.drawFood = function() {
	view.drawBox(this.food.x, this.food.y, view.foodColor);	
}

Snake.prototype.genFood = function() {
	this.food.x = Math.floor(Math.random()*view.boardSize);
	this.food.y = Math.floor(Math.random()*view.boardSize);
	for (i=0; i<this.coords.length; i++) {		
		if (this.food.x === this.coords[i].x && this.food.y === this.coords[i].y) {
			this.genFood();
		} else {
			this.drawFood();											
		}
	}
}

//Getting the direction of the tail (way too complicated ang buggy):
/*Snake.prototype.getTailDir = function() {
	let x1 = this.coords[this.coords.length-1].x;
	let x2 = this.coords[this.coords.length-2].x;
	let y1 = this.coords[this.coords.length-1].y;
	let y2 = this.coords[this.coords.length-2].y;
	let diffX = x2 - x1;
	let diffY = y2 - y1;
	if (diffX < 0) {
		tailDir = "left";
	} else if (diffX > 0) {
		tailDir = "right";
	} else if (diffX = 0) {
		if (diffY < 0) {
			tailDir = "up";
		} else if (diffY > 0) {
			tailDir = "down";
		}
	}
	return tailDir;
}*/

//Old way to grow (this caused a bug, so I resorted to just not popping the last piece when eating):
/*Snake.prototype.grow = function() {	
	this.getTailDir();
	if (tailDir === "left") {
		this.coords.push({x: this.coords[this.coords.length-1].x+1, y: this.coords[0].y+0});
	} else if (tailDir === "right") {
		this.coords.push({x: this.coords[this.coords.length-1].x-1, y: this.coords[0].y+0});
	} else if (tailDir === "up") {
		this.coords.push({x: this.coords[this.coords.length-1].x+0, y: this.coords[0].y+1});
	} else if (tailDir === "down") {
		this.coords.push({x: this.coords[this.coords.length-1].x+0, y: this.coords[0].y-1});
	}
	this.genFood();
}*/

Snake.prototype.move = function(m1, m2) {
	/*if (this.eat()) {	
		view.updateScore();
		this.grow();
	}*/
	if (!view.gameOver()) {	
		if(this.eat()) {
			let lastSnake = this.coords[this.coords.length-1];
			this.coords.unshift({x: this.coords[0].x+m1, y: this.coords[0].y+m2});
			view.drawSnake(snake.coords, view.bodyColor, view.headColor);	
			view.updateScore();
			this.genFood();
		} else {
			let lastSnake = this.coords[this.coords.length-1];
			view.drawBox(lastSnake.x, lastSnake.y, view.VACANT);
			this.coords.pop();
			this.coords.unshift({x: this.coords[0].x+m1, y: this.coords[0].y+m2});
			view.drawSnake(snake.coords, view.bodyColor, view.headColor);	
		}		
	}	
}

let slideLeft = function() {
	snake.move(-1, 0);	
}

let slideUp = function() {
	snake.move(0, -1);
}

let slideRight = function() {
	snake.move(1, 0);
}

let slideDown = function() {
	snake.move(0, 1);
}

function changeDir(event) {
	let x = event.keyCode;
	if (x === 37 && dir !== "right") {
		slideLeft();
		dir = "left";
		goStart = Date.now();
	} else if (x === 38 && dir !== "down") {
		slideUp();
		dir = "up";
		goStart = Date.now();
	} else if (x === 39 && dir !== "left") {
		slideRight();
		dir = "right";
		goStart = Date.now();
	} else if (x === 40 && dir !== "up") {
		slideDown();
		dir = "down";
		goStart = Date.now();
	}
}

function go() {
	let now = Date.now();
	let delta = now - goStart;
	if (delta > view.speed) {
		if (dir === "left") {
			slideLeft();
			goStart = Date.now();
		} else if (dir === "up") {
			slideUp();
			goStart = Date.now();
		} else if (dir === "right") {
			slideRight();
			goStart = Date.now();
		} else if (dir === "down") {
			slideDown();
			goStart = Date.now();
		}
	}
	if (!view.gameOver()) {
		requestAnimationFrame(go);
	}
}

go();
snake.genFood();