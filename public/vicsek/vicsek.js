function setup() {

	this.c = createCanvas(windowWidth || 1366, windowHeight || 768, WEBGL);

    this.yAngle = 0;
    this.xAngle = 0;
	this.zoom = 1;

	this.N = 128;
	this.L = createVector(700., 700., 700.);
	this.timeDelay = 0;
	this.eta = 45.;
	this.r = 100.;
	this.vel = 5.;
	this.deltaT = 1;

	this.particles = [];
	for (var i = 0; i < N; i++) {
		particles[i] = new Particle();
	}

    //html elements
    this.parentDiv = createDiv('Controls');
    parentDiv.style('background-color', 'rgba(150, 150, 150, 0.6)');
    parentDiv.style('color', 'white');
    parentDiv.style('display', 'none');
    parentDiv.position(0, 20);
    this.fr = createP();
    fr.style('font-size', '12')
    parentDiv.child(fr);

    
    this.nP = createP('Number of particles:');
    nP.style('font-size', '12');
    parentDiv.child(nP);
    this.nInput = createInput(N, 'number');
    nInput.size(120);
    parentDiv.child(nInput);

    this.lP = createP('Size of box:');
    lP.style('font-size', '12');
    parentDiv.child(lP);
    this.lInputX = createInput(L.x/100, 'number');
    lInputX.size(40);
    parentDiv.child(lInputX);
    this.lInputY = createInput(L.y/100, 'number');
    lInputY.size(40);
    parentDiv.child(lInputY);
    this.lInputZ = createInput(L.z/100, 'number');
    lInputZ.size(40);
    parentDiv.child(lInputZ);

    this.startP = createP('Restart with new vars:');
    startP.style('font-size', '13');
    parentDiv.child(startP);
    this.restartBtn = createButton('Start');
    parentDiv.child(restartBtn);
    restartBtn.mouseClicked(restart);
  
    this.isShowControls = false;
    this.optionsBtn = createButton('Show Options');
    optionsBtn.position(0, 0);
    optionsBtn.mouseClicked(()=>{
      if(isShowControls) {
        parentDiv.style('display', 'none');
      } else {
        parentDiv.style('display', 'block');
      }
      isShowControls = !isShowControls;
    });
    //html elements end

}

function draw() {
	scale(zoom);
	rotateY(yAngle);
    rotateX(xAngle);
    //camera(0, 0, height/2., rotateX, rotateY, 0, 0, 1, 0);
	background(0, 0, 0);

	fr.html('FPS: ' + floor(frameRate()));


	translate(-L.x/2, -L.y/2, -L.z/2);

	push();
	noFill();
	translate(L.x/2, L.y/2, L.z/2);
	box(L.x, L.y, L.z);
	pop();

	
	
	distances = getDistances(particles);

	for(var i = 0; i < particles.length; i++) {

		neighbours = getNeighbours(distances, i);
		avg = particles[i].getAvg(neighbours);
		noise = particles[i].getVec().mult(this.eta);
		newDir = avg.add(noise).normalize();
		newPos = particles[i].getPos().add(newDir.mult(this.deltaT*this.vel));

		particles[i].update(newPos, newDir);

		particles[i].show();

	}
}

function restart() {
	background(0, 0, 0);
	N = nInput.value();

	L.x = lInputX.value()*100;
	L.y = lInputY.value()*100;
	L.z = lInputZ.value()*100;

	particles = [];
	for (var i = 0; i < N; i++) {
		particles[i] = new Particle();
	}
}

function mouseDragged() {
    yAngle = atan((mouseX-height/2)*0.1);
    xAngle = atan((mouseY-width/2)*0.1);   
}

function mouseWheel(e) {
	zoom -= e.delta*0.001;
	//console.log(zoom);
}

function getDistances(particles) {
	this.distances = [];
	for (var i = particles.length - 1; i >= 0; i--) {
		distances[i] = [];
	}

	for(var i = 0; i < particles.length; i++){
		parI = particles[i].getPos();
		for(var j = 0; j < particles.length; j++){
			parJ = particles[j].getPos();
			dx = abs(parI.x - parJ.x);
			dy = abs(parI.y - parJ.y);
			dz = abs(parI.z - parJ.z);
			dx = dx - round(dx/L.x)*L.x;
			dy = dy - round(dy/L.y)*L.y;
			dz = dz - round(dz/L.z)*L.z;

			this.distances[i][j] = sqrt(dx**2+dy**2+dz**2)
		}
	}

	return this.distances;
}

function getNeighbours(distances, index) {

	neighbours = [];

	for (var i = 0; i < distances.length; i++) {
		if(distances[index][i] < this.r)
			neighbours.push(i);
	}

	//console.log(neighbours);
	return neighbours;

}

function Particle() {
	this.pos = createVector(random(L.x), random(L.y), random(L.z));
	this.theta = random(0, TWO_PI);
	this.zed = random(-1, 1);
	this.vec = createVector(cos(this.theta) * sqrt(1 - this.zed**2), sin(this.theta) * sqrt(1 - this.zed**2), this.zed);

	this.getAvg = function(neighbours) {
		n = neighbours.length;
		vecs = createVector(0, 0, 0);

		for (var i = neighbours.length - 1; i >= 0; i--) {
			vecs.add(particles[neighbours[i]].getVec());
		}
		
		avgVector = vecs.div(n);

		return avgVector;
	}

	this.getPos = function() {
		return this.pos;
	}

	this.getVec = function() {
		return this.vec;
	}

	this.update = function(position, vector) {
		this.pos = position;
		this.vec = vector;

		if(this.pos.x > L.x)
			this.pos.x = 0;
		if(this.pos.x < 0)
			this.pos.x = L.x;
		if(this.pos.y > L.y)
			this.pos.y = 0;
		if(this.pos.y < 0)
			this.pos.y = L.y;
		if(this.pos.z > L.z)
			this.pos.z = 0;
		if(this.pos.z < 0)
			this.pos.z = L.z;
	}

	this.show = function() {
		stroke(255, 255, 255);
		//scl = (vel + 10)%10;
		//console.log(scl);
		push();
		fill(255);
		translate(this.pos);
		box(5);
		pop();
	}
}