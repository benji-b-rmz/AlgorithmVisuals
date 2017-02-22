/**
 * Created by benji on 2/17/17.
 */

// inspired by Dan Shiffman's video on attractors
    // check it out here: https://www.youtube.com/watch?v=OAcXnzRNiCY&t=780s

var NUM_PARTICLES = 200;
var PARTICLES = [];
var ATTRACTOR;
var F_G; // simulated force of gravity -y force

function Particle() {

    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 4;
    this.color = 0;


    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel); //p5 has built in vector functions
        this.acc.mult(0);
    }

    this.applyForce = function (force) {
        this.acc.add(force);
    }

    this.show = function () {
        this.color += 1;
        if(this.color > 255){
            this.color = 0;
        }
        stroke(this.color,255,255,255);

        strokeWeight(4);
        point (this.pos.x, this.pos.y);
    }

    this.bottom = function () {// prevent the particles from falling off bottom, send them to top
        if(this.pos.y > height){
            this.pos.y = 0;
        }
    }
}


function centerCanvas() {

    var x = (windowWidth - width)/2;
    var y = (windowHeight - height)/2;
    cnv.position(x, y);

}

function windowResized(){
    setup();
    centerCanvas();
}

function setup() {

    background(0);
    colorMode(HSB, 255);
    F_G = createVector(0, 9.8);
    cnv = createCanvas(window.innerWidth, window.innerHeight);
    centerCanvas();

    //initialize the particles

    for(var i = 0; i < NUM_PARTICLES; i++){
        PARTICLES[i] =  new Particle();
    }

}

function draw() {

    // var mouseAttractor = createVector(mouseX, mouseY); //grab the location of the mouse
    // console.log(mouseAttractor);
    if (mouseIsPressed){
        ellipse(mouseX, mouseY, 50, 50);
        var mouseAttractor = createVector(mouseX, mouseY);
        ATTRACTOR = mouseAttractor;
    }

    //use vector subtraction to get the direction vector from the piont to the mouse
    for (var i = 0; i < PARTICLES.length; i ++){

        PARTICLES[i].applyForce(F_G);
        if (ATTRACTOR != null){
            var force = createVector(
                ATTRACTOR.x - PARTICLES[i].pos.x,
                ATTRACTOR.y - PARTICLES[i].pos.y
            );
            PARTICLES[i].applyForce(force);
        }


        PARTICLES[i].update();
        PARTICLES[i].bottom(); // check if the particle fell off screen
        PARTICLES[i].show(); //display the updated location
    }
    stroke(200);
    strokeWeight(4);
    point(mouseX, mouseY);



}