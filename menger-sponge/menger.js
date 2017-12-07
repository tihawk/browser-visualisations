function setup() {
    createCanvas(900, 900, WEBGL);
    //this.heading = 0;
    this.yAngle = 0;
    this.xAngle = 0;
    this.zoom = 1;
    this.size = width/2;

    this.b = [];
    b.push(new Box(0, 0, 0, size));
    
    this.next = createButton('Next');
    next.position(10, 10);
    next.mousePressed(nextMenger);
}

function draw() {
    scale(zoom);
    rotateY(yAngle);
    rotateX(xAngle);
    background(51);
    // stroke(255);
    // noFill();
    noStroke();
    directionalLight([255, 100, 0], 0, 0, 1);
    ambientMaterial([200, 150, 0]);
    
    //rotateX(heading);
    //rotateY(0.1*heading);
    // heading += 0.01;

    for(let i = 0; i < b.length; i++) {
        b[i].show();
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

function nextMenger() {
    let temp = [];
    for(let each of b) {
        temp.push(...each.generate());
    }
    b = temp;
}

function Box(x, y, z, size) {
    this.pos = createVector(x, y, z);
    this.size = size;

    this.show = function() {
        push(); 
        translate(this.pos);
        box(this.size);
        pop();
    } 

    this.generate = function() {
        boxes = [];
        let newSize = this.size/3;
        for(let i = -1; i < 2; i++) {
            for(let j = -1; j < 2; j++) {
                for(let k = -1; k < 2; k++) {
                    let sum = abs(i) + abs(j) + abs(k);
                    if(sum > 1) {
                        boxes.push(new Box(this.pos.x + i*newSize, this.pos.y + j*newSize, this.pos.z + k*newSize, newSize));
                    } 
                }
            }
        }
        console.log(boxes);
        return boxes;
    }
}