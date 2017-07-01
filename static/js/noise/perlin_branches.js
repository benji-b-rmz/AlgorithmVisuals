/**
 * Created by Benji on 2/12/17.
 * a modified version of Daniel Shiffman's video on perlin noise with P5 JS,
 *  find him here:
 *  http://patreon.com/codingtrain
 *  https://youtu.be/BjoM9oKOAKY
 */



function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 4;
    this.h = 0;
    this.h = true;

    this.prevPos = this.pos.copy();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.follow = function(vectors) {
        var x = floor(this.pos.x / scl);
        var y = floor(this.pos.y / scl);
        var index = x + y * cols;
        var force = vectors[index];
        this.applyForce(force);
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.show = function() {
        stroke(this.h, 255, 255, 25);

        this.h = this.h +1;

        if (this.h >= 255){
            this.h = 0;
        }

        strokeWeight(4);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    }

    this.updatePrev = function() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    this.edges = function() {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        }

    }

}


var cols, rows;

var zoff = 0;

var fr;
var incr = 0.001;
var num_particles = 1000;
var particles = [];
var scl = 10;



var flowfield = [];

var cnv;



function centerCanvas() {

    var x = (windowWidth - width)/2;
    var y = (windowHeight - height)/2;
    cnv.position(x, y);

}


function setup() {
    background(4);
    cnv = createCanvas(window.innerWidth, window.innerHeight);
    centerCanvas();
    colorMode(HSB, 255);


    cols = floor(width / scl);
    rows = floor(height / scl);
    fr = createP('');


    flowfield = new Array(cols * rows);
    //
    for (var i = 0; i < num_particles; i++) {
        particles[i] = new Particle();
    }
}

function windowResized(){
    setup();
    centerCanvas();
}

function draw() {

    randomSeed(10);

    var yoff = 0;

    console.log(noise(1));


    for (var y = 0; y < rows; y++){

        var xoff = 0;

        for (var x = 0; x < cols; x++){
            var index = (x + y * cols);
            var angle = noise(xoff, yoff, zoff) * TWO_PI;

            var v = p5.Vector.fromAngle(angle);
            flowfield[index] = v;

            xoff += incr;

        }
        yoff += incr;

        zoff += 0.0001;
    }

    for (var i = 0; i < particles.length; i ++){
        stroke(255,0,0);
        strokeWeight(4);
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].show();
        particles[i].edges();

    }
    fr.html(floor(frameRate()));


}