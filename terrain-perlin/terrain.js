function setup() {
    createCanvas(1366, 768, WEBGL);

    gridX = width;
    gridY = height;

    this.flying = 0;
    
    this.scl = 25;
    this.zoom = 1.5;
    this.allPolies = false;
    this.rows = floor(gridY/scl);
    this.cols = floor(gridX/scl);
    this.harshness = 0.07;

    // this.yAngle = 0;
    // this.xAngle = 0;

    this.terrain = new Array(rows);
    for(let i = 0; i < terrain.length; i++) {
        this.terrain[i] = new Array(cols);
    } 

    this.p1 = createP('Change the size of the poligons:');
    p1.position(10, 0);
    p1.style('color', 'white');
    this.sclSlider = createSlider(1, 40, 25);
    sclSlider.position(10, 40);
    sclSlider.style('width', '150px');
    this.updateBtn = createButton('Set');
    updateBtn.position(165, 40);
    updateBtn.mousePressed(updateGrid);
    this.check = createCheckbox('Turn all poligons on (heavy!)', false);
    check.position(10, 70);
    check.style('color', 'white');
    check.changed(()=>{
        allPolies = !allPolies;
    });
    /*---*/
    this.p2 = createP('Change the harshness of the terain:');
    p2.position(230, 0);
    p2.style('color', 'white');
    this.harshSlider = createSlider(0.0, 0.6, 0.07, 0.01);
    harshSlider.position(230, 40);
    harshSlider.style('width', '150px');
}

function draw() {
    //controls
    harshness = harshSlider.value();
    //rotateY(PI / 3);
    rotateX(PI / 3);
    scale(zoom);
    translate(-gridX/2, -gridY*2/4);
    //console.log(frameRate());
    flying -= harshness;

    this.yoff = flying;
    for(let i = 0; i < terrain.length; i++) {
        this.xoff = 0.0;
        for(let j = 0; j < terrain[i].length; j++) {
            terrain[i][j] = map(noise(xoff, yoff), 0, 1, -scl*6, scl*6);
            //terrain[i][j] = random(-50, 50);
            xoff += harshness;
        }
        yoff += harshness;
    }
    
    
    // noFill();
    // stroke(255);
    // fill(155);
    background(51);
    for(let y = 0; y < rows - 1; y++) {
        noStroke();
        for(let x = 0; x < cols - 1; x++) {
            fill(map(terrain[y][x], -scl*6, scl*6, 0, 255));
            beginShape(TRIANGLES);
            vertex(x*scl, y*scl, terrain[y][x]);
            vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
            vertex((x+1)*scl, y*scl, terrain[y][x+1]);
            endShape(); 
            if(allPolies) {
                beginShape(TRIANGLES);
                vertex((x+1)*scl, y*scl, terrain[y][x+1]);
                vertex((x+1)*scl, (y+1)*scl, terrain[y+1][x+1]);
                vertex((x)*scl, (y+1)*scl, terrain[y+1][x]);
                endShape(); 
            }
            
            
        }
    }
}

function mouseWheel(e) {
    zoom -= e.delta*0.001;
    //console.log(zoom);
}

// function mouseDragged() {
//     yAngle = atan((mouseX-height/2)*0.1);
//     xAngle = atan((mouseY-width/2)*0.1);   
// }
function updateGrid() {
    scl = sclSlider.value();
    rows = floor(gridY/scl);
    cols = floor(gridX/scl);
    //console.log(scl);
    terrain = new Array(rows);
    for(let i = 0; i < terrain.length; i++) {
        terrain[i] = new Array(cols);
    } 
}
