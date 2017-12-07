function setup() {
    createCanvas(1366, 768);

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

    this.vectorMagnitude = 1;
    this.maxVelocity = 2;
    this.flowfield = [];
    this.particles = [];
    for(let i = 0; i < 2000; i++){
        particles[i] = new Particle();
    }   

    this.hue = 0;
    this.satur = 0;
    this.c;
    this.isPsychedelia = false;
    this.bgc = 200;
    background(bgc);

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
        background(bgc);
    });
    this.magSliderP = createP('Set magnitude of vectors:');
    magSliderP.position(width + 10, 90);
    this.magnitudeSlider = createSlider(0.01, 10, 1);
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
    isPsychedeliaCheck = createCheckbox('Psychedelia!', false);
    isPsychedeliaCheck.position(width + 10, 290);
    isPsychedeliaCheck.changed(()=>{
        isPsychedelia = !isPsychedelia;
    });
    this.clearBtn = createButton('Clear');
    clearBtn.position(width + 10, 310);
    clearBtn.mousePressed(clearScreen);
}

function draw() {

    scale(zoom);
    if(isShowingVectors) {background(bgc);}
    fr.html('FPS: ' + floor(frameRate()));
    vectorMagnitude = magnitudeSlider.value();
    maxVelocity = velocitySlider.value();
    partNumSliderP.html('Change the number of particles: ' + particleNumberSlider.value());
    //console.log(frameRate());
    if(isTimeDep){
        zoff += 0.01;
    }
    let yoff = 0;
    stroke(0, 100);
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
                //stroke(0, 100);
                push();
                translate(j * scl, i * scl);
                rotate(v.heading());
                line(0, 0, scl, 0);
                pop();
            }
            
        }
        yoff += coarse;
    }

    if(isPsychedelia) {
        let c = color('hsla('+hue++%360+',100%,50%,255)');
        stroke(c);
    } else {
        stroke(0, 100);
    }      
    // strokeWeight(1) ;
    // if(isShowingVectors) {
    //     strokeWeight(2);
    // }
    for(let i = 0; i < particles.length; i++) {    
        particles[i].update();
        particles[i].show();
        particles[i].follow(flowfield);  
    }  
    
}

function clearScreen() {
    background(bgc);
}

function setParticleNumber() {
    background(bgc);
    particles = [];
    for(let i = 0; i < particleNumberSlider.value(); i++){
        particles[i] = new Particle();
    }
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = createVector(0, 0);//this.pos;
    //this.prevPos.x= this.pos.x;
    //this.prevPos.y = this.pos.y;

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(maxVelocity);
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
        //console.log(this.prevPos);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
        if(abs(this.pos.x-this.prevPos.x) > width/2 || abs(this.pos.y-this.prevPos.y) > height/2) {
            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;
        }
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
        // if(isShowingVectors) {
        //     stroke(0);
        // } else {
        //     stroke(0, 20);
        // }

        // strokeWeight(2);
        //push();
        //translate(this.pos.x, this.pos.y);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        //point(this.pos.x, this.pos.y);
        //pop();
    }
}