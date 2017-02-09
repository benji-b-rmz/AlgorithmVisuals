// Benjamin Ramirez Feb 7, 2017
// creating sorting 2d algorithm visuals with PIXI js
var circle_array = [];
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var stage = new PIXI.Container();
var NUM_ELEMENTS = 10;
var CIRC_DISTANCE = 60;
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
var sorting = true;
function animate(){

    requestAnimationFrame(animate);
    //bubbleSort(circle_array);
    insertionSort(circle_array);

    // if (sorting){
    //     sorting = false;
    // }
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
        //stage.addChild(this.graphic);
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
                var temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
                swap = true;
                console.log(array);
            }
        }
    }while(swap);

}

function insertionSort(array){

    for( var i = 1; i < array.length; i++){

        var j = i;
        while( (j > 0) && (array[j-1].radius > array[j].radius) ){
            var temp = array[j];
            array[j] = array[j-1];
            array[j-1] = temp;
            j = j-1;
            console.log(j);
        }
        console.log(array);
    }

}