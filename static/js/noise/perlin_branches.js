/**
 * Created by benji on 2/12/17.
 * modified version of Daniel Shiffman's video on perlin noise with P5 JS,
 *  find him here:
 *   http://patreon.com/codingtrain
 *  https://youtu.be/BjoM9oKOAKY
 */



function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 4;
    this.h = 100;
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
        if (this.dir == true){
            this.h = this.h +1;
        }else{
            this.h = this.h - 1;
        }
        if (this.h >= 200){
            this.dir = false;
        }
        if(this.h <= 100){
            this.dir = true
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

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

var cols, rows;

var zoff = 0;

var fr;
var incr = 0.01;
var particles = [];
var scl = 10;



var flowfield = [];



function setup() {
    background(4);
    createCanvas(800, 800);
    colorMode(HSB, 255);


    cols = floor(width / scl);
    rows = floor(height / scl);
    fr = createP('');


    flowfield = new Array(cols * rows);
    //
    for (var i = 0; i < 1000; i++) {
        particles[i] = new Particle();
    }
    fr = createP('');




    // particles[0] = new Particle();
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

            // stroke(0,50);
            // push();
            // translate(x*scl, y * scl);
            // rotate(v.heading());
            // line(0, 0, scl, 0);
            //
            // pop();

        }
        yoff += incr;

        zoff += 0.0001;
    }

    for (var i = 0; i < particles.length; i ++){
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].show();
        particles[i].edges();
    }
    fr.html(floor(frameRate()));


}