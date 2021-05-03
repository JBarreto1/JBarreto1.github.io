let ballLoc = 0 //which step is the ball on?
let ballOnReg = true //which stair set is the ball on? 1=reg 0=flashing
let regWidth = 60
let flashWidth = 80
let regSpeed = 2
let flSpeed1 = 4
let flSpeed2 = -2
let regular = []
let flashing = []

function setup() {
	createCanvas(600,500);
	for (let i = -2; i < 10; i++) {
		let x = 60 * i
		let r = new Stairs(x,40,regWidth,120,regSpeed)
		regular.push(r)
	}
	for (let i = -2; i < 10; i++) {
		let x = 60 * i
		let r = new Stairs(x,40,flashWidth,0,flSpeed1)
		flashing.push(r)
	}
}

function draw() {
	background(0);
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
		regular[curBallLoc].show(true)
		for (let i = 0; i < flashing.length; i++) {
			// console.log(flashing[i].x)
			// console.log(regular[ballLoc].x)
			if (flashing[i].x == regular[curBallLoc].x && regular[curBallLoc].currentSpeed > flashing[i].currentSpeed) {
				ballLoc = i
				ballOnReg = false
			}
		}
	} else {
		flashing[curBallLoc].show(true)
		for (let i = 0; i < regular.length; i++) {
			if (regular[i].x == flashing[curBallLoc].x && (flashing[curBallLoc].currentSpeed > regular[i].currentSpeed)) {
				ballLoc = i
				ballOnReg = true
			}
		}
	}
}

class Stairs {
	constructor(x, y, stepWidth, color, speed) {
		this.x = x
		this.y = y
		this.stepWidth = stepWidth
		this.color = color
		this.counter = 1
		this.currentSpeed = speed
	}
	move(speedOne,speedTwo) {
		if (this.x > 600) {
			this.x = -120
		} else {
			if (typeof speedTwo === 'undefined') {
				this.x = this.x + speedOne
			} else {
				if (Math.ceil(this.counter / 50) % 2 === 1 ) {
					this.x = this.x + speedOne
					this.currentSpeed = speedOne
				} else {
					this.x = this.x + speedTwo
					this.currentSpeed = speedTwo
				}
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

	// show() {
	// 	stroke(255)
	// 	strokeWeight(1);
	// 	let newx = this.x - 1000
	// 	let newy = this.y
	// 	fill(this.color)
	// 	beginShape();
	// 	vertex(newy + 20, newx);
	// 	for (var i = 0; i < 200; i++) {
	// 		if (i % 2 === 0){
	// 			vertex(newy + 60, newx)
	// 		} else {
	// 			vertex(newy + 60 + this.stepWidth, newx)
	// 			newx = newx + 50
	// 		}
	// 	}
	// 	vertex(newy + 20, newx);
	// 	endShape(CLOSE);
	// 	return this.x
	// }
}