function Walker(x, y, stuck) {
    this.pos = createVector( x || random(width), y || random(height));
    this.stuck = stuck || false;

    this.getBin = function() {
        this.y = floor(this.pos.y/scl);
        this.x = floor(this.pos.x/scl);
        this.index = this.x + this.y * cols;
        return this.index;
    }

    this.getDistSq = function(a,b) {
        // let distX = a.pos.x - b.pos.x;
        // let distY = a.pos.y - b.pos.y;
        // return distX*distX + distY*distY;
        return (a.pos.x - b.pos.x)*(a.pos.x - b.pos.x) + (a.pos.y - b.pos.y)*(a.pos.y - b.pos.y);
    }

    this.stick = function() {
        let bin = constrain(this.getBin(), cols+1, bins.length-cols-1);

        //console.log(bin);
        for(let i = 0; i < bins[bin+1].length; i++) {
            let distSq = this.getDistSq(this, bins[bin+1][i]);
            if(distSq < r*r && random() < stickiness) {
                //if(random() < stickiness) {
                    this.stuck = true;
                //}  
            }
        }
        for(let i = bins[bin].length-1; i >= 0; i--) {
            let distSq = this.getDistSq(this, bins[bin][i]);
            if(distSq < r*r && random() < stickiness) {
                //if(random() < stickiness) {
                    this.stuck = true;
                //}  
            }
        }
        for(let i = 0; i < bins[bin-1].length; i++) {
            let distSq = this.getDistSq(this, bins[bin-1][i]);
            if(distSq < r*r && random() < stickiness) {
                //if(random() < stickiness) {
                    this.stuck = true;
                //}  
            }
        }
        for(let i = 0; i < bins[bin+cols].length; i++) {
            let distSq = this.getDistSq(this, bins[bin+cols][i]);
            if(distSq < r*r && random() < stickiness) {
                //if(random() < stickiness) {
                    this.stuck = true;
                //}  
            }
        }
        for(let i = 0; i < bins[bin-cols].length; i++) {
            let distSq = this.getDistSq(this, bins[bin-cols][i]);
            if(distSq < r*r && random() < stickiness) {
                //if(random() < stickiness) {
                    this.stuck = true;
                //}  
            }
        }

        if(this.stuck) {
            crystal.push(this);
            bins[bin].push(this);
            //console.log(crystal);
            switch (arrangement) {
                case 'center':
                    if(this.getDistSq(this, crystal[0]) < crystalSize*crystalSize) {
                        walkers[walkers.indexOf(this)] = new Walker();
                    } else {
                        walkers.splice(walkers.indexOf(this), 1);
                    } 
                    break;
                case 'frame':
                    if(bins[bins.length/2][0] === undefined) {
                        walkers[walkers.indexOf(this)] = new Walker();
                    } else {
                        walkers.splice(walkers.indexOf(this), 1);
                    } 
                    if(!showWalkers) {
                        this.show();
                    }
                    break;
            }
            // if(this.getDistSq(this, crystal[0]) < crystalSize*crystalSize) {
                // walkers[walkers.indexOf(this)] = new Walker();
            // } else {
                // walkers.splice(walkers.indexOf(this), 1);
            // } 
            if(bins[bins.length/2][0] === undefined) {
                walkers[walkers.indexOf(this)] = new Walker();
            } else {
                walkers.splice(walkers.indexOf(this), 1);
            } 
            if(!showWalkers) {
                this.show();
            }
        }
    }

    this.walk = function() {
        if(!stuck) {
            switch (floor(random(4))) {
                case 0:
                    this.pos.x = (width + ++this.pos.x)%width;
                    break;
                case 1:
                    this.pos.x = (width + --this.pos.x)%width;
                    break;
                case 2:
                    this.pos.y = (height + ++this.pos.y)%height;
                    break;
                case 3:
                    this.pos.y = (height + --this.pos.y)%height;
            }
        }
    }

    this.show = function() {
        fill(255);
        if(this.stuck) {
            // let hu = map(this.getDistSq(this, crystal[0])%(crystalSize*crystalSize), 0, crystalSize*crystalSize, 0, 315);
            let hu = map((this.pos.x - width/2)*(this.pos.x - width/2) + (this.pos.y - height/2)*(this.pos.y - height/2)
                %(crystalSize*crystalSize), 0, width*width/4, 0, 315);
            fill(hu, 100, 100, 0.7);
        }
        ellipse(this.pos.x, this.pos.y, r, r);
        //point(this.pos.x, this.pos.y);
    }
}