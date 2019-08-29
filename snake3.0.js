
document.addEventListener("keydown", changeDir);
let dir;
let tailDir;
let goStart = Date.now();
let score = 0;

let viewParams = {
	boardSize: 17,
	box: 32,
	VACANT: "white",
	bodyColor: "green",
	headColor: "darkgreen",
	speed: 500,
	foodColor: "red",
	speedMargin: 100
};
let view = new View(viewParams);

let snakeParams = {
	coords: [{x: 7, y: 8}, {x: 6, y: 8}, {x: 5, y: 8}]
}
let snake = new Snake(snakeParams);


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
	this.speedMargin = params.speedMargin;
}

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

View.prototype.upSpeed = function() {
	if (view.speed > 150 && score % 100 === 0) {
		view.speed -= view.speedMargin;
	}	
}

function Snake(params) {
	this.canvas = document.getElementById("canvas");
	this.ctx = canvas.getContext('2d');

	this.coords = params.coords;
}

Snake.prototype.food = {
	x: 0,
	y: 0
}

Snake.prototype.collision = function() {
	if (this.coords[0].x >= view.boardSize || this.coords[0].y >= view.boardSize || this.coords[0].x < 0 || this.coords[0].y < 0) {
		return true;
	}	
	for (i=1; i<this.coords.length; i++) {
		if (this.coords[0].x === this.coords[i].x && this.coords[0].y === this.coords[i].y) {
			return true;
		} 
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

//Getting the direction of the tail (way too complicated and buggy):
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
	let lastSnake = this.coords[this.coords.length-1];
	if (!view.gameOver()) {	
		this.coords.unshift({x: this.coords[0].x+m1, y: this.coords[0].y+m2});
		if(this.eat()) {			
			view.updateScore();
			this.genFood();
			view.upSpeed();
		} else {
			view.drawBox(lastSnake.x, lastSnake.y, view.VACANT);
			this.coords.pop();				
		}
		view.drawSnake(snake.coords, view.bodyColor, view.headColor);		
	}	
}

Snake.prototype.slideLeft = function() {
	this.move(-1, 0);	
}

Snake.prototype.slideUp = function() {
	this.move(0, -1);
}

Snake.prototype.slideRight = function() {
	this.move(1, 0);
}

Snake.prototype.slideDown = function() {
	this.move(0, 1);
}

function changeDir(event) {
	let x = event.keyCode;
	if (x === 37 && dir !== "right") {
		snake.slideLeft();
		dir = "left";
	} else if (x === 38 && dir !== "down") {
		snake.slideUp();
		dir = "up";
	} else if (x === 39 && dir !== "left") {
		snake.slideRight();
		dir = "right";
	} else if (x === 40 && dir !== "up") {
		snake.slideDown();
		dir = "down";		
	}
	goStart = Date.now();
}

function go() {
	let now = Date.now();
	let delta = now - goStart;
	if (delta > view.speed) {
		switch (dir) {
			case "left":
				snake.slideLeft();
				break;
			case "up":
				snake.slideUp();
				break;
			case "right":
				snake.slideRight();
				break;
			case "down":
				snake.slideDown();
				break;
			default: 
				snake.slideRight();				
				break;
		}
		goStart = Date.now();
	}		
	if (!view.gameOver()) {
		requestAnimationFrame(go);
	}
}

go();
snake.genFood();
