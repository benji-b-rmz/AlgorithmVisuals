/**
 * Created by benji on 3/31/17.
 */

var NUM_PARTICLES = 200;
var PARTICLES = [];
var F_G; // simulated force of gravity -y force
var START_TIME; //holds the amount of time before the start of the game(random)


function reactionCanvas(){

    this.ready = false; //initially false, used to detect early clicks
    this.color = 0x00ffff; //Initially purple,
    this.text = "Wait for it...";


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

    F_G = createVector(0, 9.8);
    cnv = createCanvas(window.innerWidth, window.innerHeight);
    centerCanvas();
    background(100);


    //initialize the random start time
    START_TIME = Math.floor((Math.random() * 5000) + 1000); //canvas will turn green within

}

function draw() {




}