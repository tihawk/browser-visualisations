function setup() {
    createCanvas(800, 800);

    gridX = width;
    gridY = height;
    
    this.scl = 40;
    this.zoom = 1;

    this.rows = floor(gridY/scl);
    this.cols = floor(gridX/scl);

    this.coarse = 0.1;

    this.isShowingVectors = false;
    this.isTimeDep = true;
    this.zoff = 0.0;

    this.vectorMagnitude = 0.01;
    this.maxVelocity = 2;
    this.flowfield = [];
    this.particles = [];
    for(let i = 0; i < 2000; i++){
        particles[i] = new Particle();
    }   

    this.fr = createP();
    fr.position(width + 10, 0);
    this.isTimeDepCheck = createCheckbox('Time-dependent field', true);
    isTimeDepCheck.position(width + 10, 40);
    isTimeDepCheck.changed(()=>{
        isTimeDep = !isTimeDep;
    });
    isShowingVectorsCheck = createCheckbox('Show vector field', false);
    isShowingVectorsCheck.position(width + 10, 70);
    isShowingVectorsCheck.changed(()=>{
        isShowingVectors = !isShowingVectors;
        background(255);
    });
    this.magSliderP = createP('Set magnitude of vectors:');
    magSliderP.position(width + 10, 90);
    this.magnitudeSlider = createSlider(0.01, 10, 0.01);
    magnitudeSlider.position(width + 10, 130);
    this.velSliderP = createP('Set max velocity of particles:');
    velSliderP.position(width + 10, 150);
    this.velocitySlider = createSlider(1, 10, 2);
    velocitySlider.position(width + 10, 190);
    this.partNumSliderP = createP('Change the number of particles:');
    partNumSliderP.position(width + 10, 210);
    this.particleNumberSlider = createSlider(500, 10000, 2000);
    particleNumberSlider.position(width + 10, 250);
    this.setPartNumBtn = createButton('Set');
    setPartNumBtn.position(width + 150, 250);
    setPartNumBtn.mousePressed(setParticleNumber);
}

function draw() {

    scale(zoom);
    if(isShowingVectors) {background(255);}
    fr.html('FPS: ' + floor(frameRate()));
    vectorMagnitude = magnitudeSlider.value();
    maxVelocity = velocitySlider.value();
    partNumSliderP.html('Change the number of particles: ' + particleNumberSlider.value());
    //console.log(frameRate());
    if(isTimeDep){
        zoff += 0.01;
    }
    let yoff = 0;
    for(let i = 0; i < rows; i++) {
        let xoff = 0;
        for(let j = 0; j < cols; j++) {
            let index = j + i * cols;
            let flow = noise(xoff, yoff, zoff) * TWO_PI * 2;
            xoff += coarse;
            // fill(flow);
            // rect(j*scl, i*scl, scl, scl);
            let v = p5.Vector.fromAngle(flow);
            v.setMag(vectorMagnitude);
            flowfield[index] = v;

            if(isShowingVectors) {
                stroke(0, 100);
                push();
                translate(j * scl, i * scl);
                rotate(v.heading());
                line(0, 0, scl, 0);
                pop();
            }
            
        }
        yoff += coarse;
    }

    for(let i = 0; i < particles.length; i++) {
        particles[i].show();
        particles[i].update();
        particles[i].follow(flowfield);
    }  
}

function setParticleNumber() {
    background(255);
    particles = [];
    for(let i = 0; i < particleNumberSlider.value(); i++){
        particles[i] = new Particle();
    }
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(maxVelocity);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.follow = function(vectors) {
        let x = floor(this.pos.x / scl);
        let y = floor(this.pos.y / scl);
        let index = x + y * cols;
        let force = vectors[index];
        this.applyForce(force);
    }

    this.show = function() {
        if(isShowingVectors) {
            stroke(0);
        } else {
            stroke(0, 20);
        }

        strokeWeight(2);
        point(this.pos.x, this.pos.y);
    }
}