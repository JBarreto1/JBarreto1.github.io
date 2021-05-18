let winHeight = 600
let winWidth = 500

let ballLoc //which step is the ball on?
let ballOnReg = true //which stair set is the ball on? true=reg false=flashing
let regWidth = 60 //control the width of the regular step in pixels
let flashWidth = 80 //control the width of the flash step in pixels

let regSpeed = 1 //one speed for regular and 2 for the flashing
let flSpeed1 = 9 //the fast flashing DOWN speed
let flSpeed2 = -3 //slow flashing UP speed

let fracSpeed1 = 1 //slow down the movement of all of the steps (only move every x cycles)

let period = 11

let showReg = true
let showFlashing = true

let stepHeight = 80

let stepNum = 9
let stepOffset = 1

let regular = []
let flashing = []

let posTracker = 0
let showAveSpeed = false

let button, regButton, flButton, bothButton, avePos

// function paramInput() {
// 	regSpeed = parseInt(document.getElementById("regSpeed").value);
// 	flSpeed1 = parseInt(document.getElementById("flSpeed1").value);
// 	enteredflSpeed2 = parseInt(document.getElementById("flSpeed2").value);
// 	flSpeed2 = -enteredflSpeed2
// 	period = parseInt(document.getElementById("period").value);
// 	// document.getElementById("demo").innerHTML = x;
// 	// let x = document.getElementById("regSpeed").value;
	
// 	// console.log(typeof(x))
// 	resetSketch()
// }


function setup() {
	createCanvas(winWidth,winHeight);
	// button = createButton('Reset');
	regButton = createButton('Regular');
	flButton = createButton('Flashing');
	bothButton = createButton('Both');
	speedButton = createButton('Full Speed');
	speedButton.style('background-color', color(0,0,0))
	showAverageSpeed = createButton('Show Average Speed');
	resetSketch()
	// button.mousePressed(resetSketch);
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

	speedButton.mousePressed(() => {
		if (fracSpeed1 == 1) {
			fracSpeed1 = 2
			speedButton.html('Full Speed')
		} else {
			fracSpeed1 = 1
			speedButton.html('Half Speed')
		}
		resetSketch()
	});

	showAverageSpeed.mousePressed(() => {
		if (showAveSpeed) {
			showAveSpeed = false
			showAverageSpeed.html('Show Average Speed')
			avePos.remove()
		} else {
			showAveSpeed = true
			showAverageSpeed.html('Hide Average Speed')
			avePos = createDiv('').size(100, 100);
		}
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
			if (regular[curBallLoc].currentSpeed > flashing[i].currentSpeed) {
				if (flashing[i].x <= regular[curBallLoc].x + regular[curBallLoc].currentSpeed && flashing[i].x >= regular[curBallLoc].x + flashing[i].currentSpeed) {
					ballLoc = i
					ballOnReg = false
				}
			}
		}
		regular[curBallLoc].show(true)
		let curSpeed = regular[curBallLoc].currentSpeed
		let curCount = regular[curBallLoc].counter
		posTracker = ((posTracker * (curCount - 1)) + curSpeed) / curCount
	} else {
		for (let i = 0; i < regular.length; i++) {
			//if the ball is on the regular stair cycle through the flashing steps
			//if one of the flashing steps is between where the ball is now and where its going to be HIGHER then it catches the ball
			if(flashing[curBallLoc].currentSpeed > regular[i].currentSpeed) {
				if (regular[i].x > flashing[curBallLoc].x - flashing[curBallLoc].currentSpeed && regular[i].x < flashing[curBallLoc].x + regular[i].currentSpeed) {
					ballLoc = i
					ballOnReg = true
				}
			}
		}
		flashing[curBallLoc].show(true)
		let curSpeed = flashing[curBallLoc].currentSpeed
		let curCount = flashing[curBallLoc].counter
		posTracker = ((posTracker * (curCount - 1)) + curSpeed) / curCount
	}
	if (showAveSpeed) {
		let roundPos = -1 * posTracker.toFixed(2)
		avePos.html(roundPos);
		if (roundPos > 0) {
			avePos.style('background-color', color(4, 170, 109))
		}
		else {
			avePos.style('background-color', color(170, 4, 4))
		}
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
		if (this.counter % fracSpeed1 === 0) {
			//if there is only one speed, then it's the regualr stairs and just move at that speed
			if (typeof speedTwo === 'undefined') {
				this.x = this.x + speedOne
				// if (this.counter % fracSpeed1 === 0) {
				// 	this.x = this.x + speedOne
				// 	// this.x = this.x + 1
				// }
			} else {
				//cycle every period (50) between fast down and slow up speed
				// also adjust the period for fractional speed
				// console.log(this.counter)
				if (Math.ceil(this.counter / (period * fracSpeed1)) % 3 === 0 ) {
					this.x = this.x + speedOne
					// if (this.counter % fracSpeed1 === 0) {
					// 	this.x = this.x + speedOne
					// }
					this.currentSpeed = speedOne
				} else {
					this.x = this.x + speedTwo
					// if (this.counter % fracSpeed1 === 0) {
					// 	this.x = this.x + speedTwo
					// }
					this.currentSpeed = speedTwo
				}
			}
			//every time the ratchet moves, count up - then I can adjust how long it moves before switching direction
		}
		this.counter = this.counter + 1
	}
	show(hasBall) {
		stroke(255)
		strokeWeight(1);
		fill(this.color)
		let bottom = stepHeight * (stepNum - stepOffset)
		let top = (-1 * stepHeight * stepOffset)
		//move the stairs down. if we reach the bottom (we went beyond the canvas height) jump to a bit beyond the top
		if (this.x < top) {
			this.x = bottom - (top - this.x)
		}
		if (this.x > bottom) {
			this.x = top + (this.x - bottom)
		}

		let newx = this.x
		let newy = this.y
		beginShape();
		vertex(newy, newx);
		vertex(newy + this.stepWidth, newx);
		vertex(newy, newx + 120);
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
	ballLoc = Math.floor(stepNum / 2)
	posTracker = 0
	//construct the stairs for both ratchets
	//each ratchet is made of 12 steps that begin of screen (negative x value)
	let regColor = color(4,82,170); 
	let flColor = color(4, 170, 109)
	if (showReg) {
		ballOnReg = true
		for (let i = -1 * (stepOffset - 1); i < stepNum - stepOffset + 1; i++) {
			let x = stepHeight * i
			let r = new Stairs(x,stepHeight,regWidth,regColor,regSpeed)
			regular.push(r)
		}
	} else {
		ballOnReg = false //if the regular stair is off, the ball has to start on flashing
	}
	if (showFlashing){
		for (let i = -1 * (stepOffset - 1); i < stepNum - stepOffset + 1; i++) {
			let x = stepHeight * i
			let r = new Stairs(x,stepHeight,flashWidth,flColor,flSpeed1)
			flashing.push(r)
		}
	}
	//button colors
	// let col = color(4, 170, 109);
	// let pressCol = color(4,82,170);
	let black = color(0, 0, 0);
	let white = color(255,255,255);
	let pressRCol = color(4, 48, 100)
	let pressFlCol = color(4, 117, 76)
	if (showFlashing && showReg) {
		bothButton.style('background-color', color(50))
		bothButton.style('color', white)
		regButton.style('background-color', regColor)
		flButton.style('background-color', flColor)
	} else {
		if (showReg) {
			bothButton.style('background-color', color(220))
			bothButton.style('color', black)
			regButton.style('background-color', pressRCol)
			flButton.style('background-color', flColor)
		} if (showFlashing) {
			bothButton.style('background-color', color(220))
			bothButton.style('color', black)
			regButton.style('background-color', regColor)
			flButton.style('background-color', pressFlCol)
		}
	}
	
}