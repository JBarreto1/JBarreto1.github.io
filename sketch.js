let ballLoc = 0 //which step is the ball on?
let ballOnReg = true //which stair set is the ball on? true=reg false=flashing
let regWidth = 60 //control the width of the regular step in pixels
let flashWidth = 80 //control the width of the flash step in pixels

let regSpeed = 1 //one speed for regular and 2 for the flashing
let flSpeed1 = 4 //the fast flashing DOWN speed
let flSpeed2 = -1 //slow flashing UP speed

let period = 50

let showReg = true
let showFlashing = true

let regular = []
let flashing = []

let button, regButton, flButton, bothButton

function paramInput() {
	regSpeed = parseInt(document.getElementById("regSpeed").value);
	flSpeed1 = parseInt(document.getElementById("flSpeed1").value);
	enteredflSpeed2 = parseInt(document.getElementById("flSpeed2").value);
	flSpeed2 = -enteredflSpeed2
	period = parseInt(document.getElementById("period").value);
	// document.getElementById("demo").innerHTML = x;
	// let x = document.getElementById("regSpeed").value;
	
	// console.log(typeof(x))
	resetSketch()
}


function setup() {
	createCanvas(500,500);
	button = createButton('Reset');
	regButton = createButton('Regular');
	flButton = createButton('Flashing');
	bothButton = createButton('Both');
	resetSketch()
	button.mousePressed(resetSketch);
	regButton.mousePressed( () => {
		showReg = true;
		showFlashing = false
		resetSketch()
	}
	);
	flButton.mousePressed(() => {
		showReg = false;
		showFlashing = true
		resetSketch()
	});
	
	bothButton.mousePressed(() => {
		showReg = true;
		showFlashing = true
		resetSketch()
	});
}

function draw() {
	background(0);
	//move and draw all the steps for both flashing and regular stairs EXCEPT the one that has the ball
	for (let i = 0; i < flashing.length; i++) {
		flashing[i].move(flSpeed1,flSpeed2)
		if (i != ballLoc || ballOnReg) {
			flashing[i].show()
		}
	}
	for (let i = 0; i < regular.length; i++) {
		regular[i].move(regSpeed)
		if (i != ballLoc || !ballOnReg) {
			regular[i].show()
		}
	}	
	let curBallLoc = ballLoc
	if (ballOnReg) {
		for (let i = 0; i < flashing.length; i++) {
			//if the ball is on the regular stair cycle through the flashing steps
			//if one of the flashing steps is between where the ball is now and where its going to be LOWER then it catches the ball
			if (flashing[i].x <= regular[curBallLoc].x + regular[curBallLoc].currentSpeed && flashing[i].x >= regular[curBallLoc].x) {
				if (regular[curBallLoc].currentSpeed > flashing[i].currentSpeed) {
					ballLoc = i
					ballOnReg = false
				}
			}
		}
		regular[curBallLoc].show(true)
	} else {
		for (let i = 0; i < regular.length; i++) {
			//if the ball is on the regular stair cycle through the flashing steps
			//if one of the flashing steps is between where the ball is now and where its going to be HIGHER then it catches the ball
			if (regular[i].x > flashing[curBallLoc].x - flashing[curBallLoc].currentSpeed && regular[i].x < flashing[curBallLoc].x) {
				if(flashing[curBallLoc].currentSpeed > regular[i].currentSpeed) {
					ballLoc = i
					ballOnReg = true
				}
			}
		}
		flashing[curBallLoc].show(true)
	}
}

class Stairs {
	constructor(x, y, stepWidth, color, speed) {
		this.x = x
		this.y = y
		this.stepWidth = stepWidth
		this.color = color
		this.counter = 0
		this.currentSpeed = speed
	}
	move(speedOne,speedTwo) {
		//move the stairs down. if we reach the bottom (we went beyond the 600 canvas) jump to a bit beyond the top
		if (this.x > 600) {
			this.x = -120
		} else {
			//if there is only one speed, then it's the regualr stairs and just move at that speed
			if (typeof speedTwo === 'undefined') {
				this.x = this.x + speedOne
			} else {
				//cycle every 50 between fast down and slow up speed
				if (Math.ceil(this.counter / period) % 3 === 0 ) {
					this.x = this.x + speedOne
					this.currentSpeed = speedOne
				} else {
					this.x = this.x + speedTwo
					this.currentSpeed = speedTwo
				}
				//every time the ratchet moves, count up - then I can adjust how long it moves before switching direction
				this.counter = this.counter + 1
			}
		}
	}
	show(hasBall) {
		stroke(255)
		strokeWeight(1);
		fill(this.color)
		let newx = this.x
		let newy = this.y
		beginShape();
		vertex(newy, newx);
		vertex(newy + this.stepWidth, newx);
		vertex(newy, newx + 90);
		endShape(CLOSE);
		if (hasBall){
			fill(250)
			ellipse(newy + 50, newx - 15, 30);
		}
	}
}

function resetSketch() {
	regular = []
	flashing = []
	ballLoc = 0
	//construct the stairs for both ratchets
	//each ratchet is made of 12 steps that begin of screen (negative x value)
	if (showReg) {
		ballOnReg = true
		for (let i = -2; i < 10; i++) {
			let x = 60 * i
			let r = new Stairs(x,40,regWidth,120,regSpeed)
			regular.push(r)
		}
	} else {
		ballOnReg = false //if the regular stair is off, the ball has to start on flashing
	}
	if (showFlashing){
		for (let i = -2; i < 10; i++) {
			let x = 60 * i
			let r = new Stairs(x,40,flashWidth,0,flSpeed1)
			flashing.push(r)
		}
	}
	//button colors
	let col = color(4, 170, 109);
	let pressCol = color(4,82,170);
	if (showFlashing && showReg) {
		bothButton.style('background-color', pressCol)
		regButton.style('background-color', col)
		flButton.style('background-color', col)
	} else {
		if (showReg) {
			bothButton.style('background-color', col)
			regButton.style('background-color', pressCol)
			flButton.style('background-color', col)
		} if (showFlashing) {
			bothButton.style('background-color', col)
			regButton.style('background-color', col)
			flButton.style('background-color', pressCol)
		}
	}
}