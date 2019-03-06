function setup() {

	this.c = createCanvas(windowWidth || 1366, windowHeight || 768);
	background(15,35,83);

	this.numOfTrials = 0;
	this.numOfHits = 0;
	this.area = 0;

	this.axisA = 1;
	this.axisB = 1;

	this.particles = [];

	this.isSmiley = true;

    //html elements
    this.parentDiv = createDiv('');
    //parentDiv.style('background-color', 'rgba(0, 0, 0, 0.6)');
    parentDiv.style('color', 'white');
    parentDiv.style('display', 'block');
    parentDiv.position(0, 0);

    this.areaP = createP();
    parentDiv.child(areaP);
    this.areaP2 = createP();
    parentDiv.child(areaP2);
    this.TrialsP = createP();
    parentDiv.child(TrialsP);

    this.smileyCheck = createCheckbox('Smiley!', isSmiley);
    parentDiv.child(smileyCheck);
    smileyCheck.changed(()=>{
    	isSmiley = !isSmiley;
    	background(15,35,83);
    	for (var i = 0; i < particles.length; i++) {
    		particles[i].checkHit();
    		particles[i].show();
    	}
    });

    this.resetBtn = createButton('Reset');
    parentDiv.child(resetBtn);
    resetBtn.mouseClicked(reset);
    //html elements end
}

function draw() {
	//background(15,35,83);

	let p = new Particle();
	particles.push(p);
	p.checkHit();
	numOfTrials = particles.length;
	p.show();

	numOfHits = 0;
	for (var i = 0; i < particles.length; i++) {
		numOfHits += particles[i].pos.z;
	}

	area = 4*numOfHits/numOfTrials;
	areaP.html("Area of square: 4");
	areaP2.html('Area of shape: ' + round(area * 100) / 100 );
	TrialsP.html(numOfTrials + ' points');
}

function windowResized() {
	c.resize(windowWidth, windowHeight);
	background(15,35,83);
	for(i = 0; i < particles.length; i++) {
		particles[i].show();
	}
}

function reset() {
	background(15,35,83);
	numOfHits = 0;
	particles = [];
	numOfTrials = 0;
	numOfHits = 0;
}

function Particle() {

	this.pos = createVector(random(2.), random(2.), 0);

	this.checkHit = function() {

		//Offset coordinates to put the origin of the ellipse at (1,1)
		let tempPos = createVector(this.pos.x - 1, this.pos.y - 1);

		ellipseEquation = tempPos.x * tempPos.x / ( axisA * axisA ) + tempPos.y * tempPos.y / ( axisB * axisB );
		leftEye = ( tempPos.x + 0.4 ) * ( tempPos.x + 0.4 ) / ( 0.2 * 0.2 ) + ( tempPos.y + 0.3 ) * ( tempPos.y + 0.3 ) / ( 0.2 * 0.2 );
		rightEye = ( tempPos.x - 0.4 ) * ( tempPos.x - 0.4 ) / ( 0.2 * 0.2 ) + ( tempPos.y + 0.3 ) * ( tempPos.y + 0.3 ) / ( 0.2 * 0.2 );
		mouth = 0.4 * sqrt(0.6 * 0.6 - (tempPos.x) * (tempPos.x)) / (0.6 * (tempPos.y - 0.3));

		if (ellipseEquation < 1) {

			if (isSmiley){
				if (leftEye < 1 == false && rightEye < 1 == false && mouth > 1 == false) {
					this.pos.z = 1;		
				} else {
					this.pos.z = 0;
				}
			} else if (!isSmiley) {
				this.pos.z = 1;
			}	
		}

	}

	this.show = function(neighbours) {
		let tempPosX = map(this.pos.x, 0, 2., 0, height);
		let tempPosy = map(this.pos.y, 0, 2., 0, height);

		let rgb = createVector(255, 0, 0);
		if(this.pos.z == 0){
			rgb.y = 0;
		} else {
			rgb.y = 255;
		}

		stroke(rgb.x, rgb.y, rgb.z);
		strokeWeight(4);
		//scl = (vel + 10)%10;
		//console.log(scl);
		push();
		translate(tempPosX + width/2 - height/2, tempPosy);
		point(0, 0);
		pop();
	}
}