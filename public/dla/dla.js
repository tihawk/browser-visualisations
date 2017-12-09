var crystal = [];
var walkers = [];

var bins = [];
var cols, rows;

var stickiness = 1;

var r = 4;
var scl = 20;
var iterations = 100;
var walkersNum = 1000;
var crystalSize;

var showWalkers = true;

function preload() {
var isShowOptions = false;
//controls
const optionsBtn = createButton('Show Options');
optionsBtn.position(0, 0);
optionsBtn.mouseClicked(()=>{
    if(isShowOptions) {
        optionsDiv.style('display', 'none');
    } else {
        optionsDiv.style('display', 'block');
    }
    isShowOptions = !isShowOptions;
});

const optionsDiv = createDiv('Options');
optionsDiv.position(0, 20);
optionsDiv.style('display', 'none');
optionsDiv.style('color', 'white');
optionsDiv.style('background-color', 'rgba(200, 200, 200, 0.5)');

this.fps = createP(floor(frameRate()));
optionsDiv.child(fps);

const stickSliderP = createP('Stickiness:')
optionsDiv.child(stickSliderP);
this.stickinessSlider = createSlider(0.01, 1, stickiness, 0.01);
optionsDiv.child(stickinessSlider);

const radiusSliderP = createP('Particle Size:');
optionsDiv.child(radiusSliderP);
this.radiusSlider = createSlider(1, 10, r, 1);
optionsDiv.child(radiusSlider);

const iterSliderP = createP('Iterations per frame:');
optionsDiv.child(iterSliderP);
this.iterationsSlider = createSlider(1, 1000, iterations);
optionsDiv.child(iterationsSlider);

const walkerSliderP = createP('Walkers at once*:');
optionsDiv.child(walkerSliderP);
this.walkersNumSlider = createSlider(1, 1000, walkersNum);
optionsDiv.child(walkersNumSlider);

const showWalkersCheck = createCheckbox('Show Walkers', showWalkers);
optionsDiv.child(showWalkersCheck);
showWalkersCheck.changed(()=>{
    showWalkers = !showWalkers;
    background(51);
    for(particle of crystal) {
        particle.show();
    }
});

const requiresResetP = createP('* - requires reset');
optionsDiv.child(requiresResetP);

const resetBtn = createButton('Reset');
optionsDiv.child(resetBtn);
resetBtn.mousePressed(()=>{
    walkersNum = walkersNumSlider.value();
    walkers = [];
    crystal = [];
    bins = [];
    setup();
});

}
function setup() {
    
    this.c = createCanvas(windowHeight, windowHeight);
    colorMode(HSB);
    noStroke();
    background(51);
    crystalSize = height/2 - 10;

    cols = floor(width/scl);
    rows = floor(height/scl);

    bins = new Array(cols + rows*cols);
    for(let i = 0; i < bins.length; i++) {
        bins[i] = [];
    }
    //console.log(bins);

    //generate attractor
    crystal.push(new Walker(width/2, height/2, true));
    bins[crystal[0].getBin()].push(crystal[0]);
    crystal[0].show();

    //generate walkers
    for(let i = 0; i < walkersNum; i++) {
        walkers.push(new Walker());
    }    

    //controls
    
}

function draw() {
    //controls:
    fps.html('FPS: ' + floor(frameRate()));
    stickiness = stickinessSlider.value();
    r = radiusSlider.value();
    iterations = iterationsSlider.value();
    
    for(let i = 0; i < iterations; i++) {
        for(let j = 0; j < walkers.length; j++) {
            walkers[j].walk();
            walkers[j].stick();
        } 
    }
    
    if(showWalkers) {
        background(51);
        for(let i = 0, len = walkers.length; i < len; i++) {
            walkers[i].show();
        }

        
        for(let i = 0; i < crystal.length; i++) {
            crystal[i].show();
            //console.log(crystal);
        }
    }
    
}

