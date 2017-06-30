// Benjamin Ramirez Feb 7, 2017
// creating sorting 2d algorithm visuals with PIXI js
var circle_array = [];
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var stage = new PIXI.Container();
var NUM_ELEMENTS = 10;
var MAX_RADIUS = 30;

init();
animate();

function init(){

    for(var i = 0; i < NUM_ELEMENTS; i++){
        //generate a circle with a random radius, add it to the array
        var circle = new Circle(i, window.innerHeight/2, Math.floor(Math.random()*20)+10);
        circle_array.push(circle);
        stage.addChild(circle.graphic);

    }
    document.body.appendChild(renderer.view);
}

function animate(){

    requestAnimationFrame(animate);
    bubbleSort(circle_array);

    displayArray(circle_array);
    renderer.render(stage);
}

function Circle(x, y, radius ) {
    this.graphic = new PIXI.Graphics();
    this.radius = radius;
    this.x = x;
    this.y = y;

    this.draw = function () {
        this.graphic.beginFill(0xff00ff);
        this.graphic.drawCircle((this.x/NUM_ELEMENTS) * window.innerWidth + MAX_RADIUS, this.y, this.radius);
        this.graphic.endFill();
    }

}
function displayArray(array){
    for (var i = 0; i < array.length; i ++){

        array[i].x = i;
        array[i].draw();
    }
}

function bubbleSort(array){

    var swap;
    do{
        swap = false;
        for(var i = 0; i < array.length-1; i++){
            if(array[i].radius > array[i+1].radius){
                swapElements(array, i, i+1);
                swap = true;
                console.log(array);
            }
        }
    }while(swap);

}

function swapElements(array, i, i2) {
    var temp = array[i];
    array[i] = array[i2];
    array[i2] = temp;
}

