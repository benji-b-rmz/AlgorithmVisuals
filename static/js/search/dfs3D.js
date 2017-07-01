/**
 * Created by benji on 1/18/17.
 */

// Using THREE js to make a DFS recursive backtracker to generate a maze

var scene, camera, renderer, controls;
var geometry, material, mesh;

var COLS = 6;
var ROWS = 6;
var LAYERS = 6;

var CUBE_SIZE = 100;
var WIDTH, HEIGHT;

var gridCells = [[]];

var stack = [];

var xOffSet = - (CUBE_SIZE * COLS)/2;
var yOffSet = - (CUBE_SIZE * ROWS)/2;
var zOffSet = - (CUBE_SIZE * LAYERS)/2;

init();
animate();
var currentCell;


function getThreeIndex(i, j, k){

    if(i < 0 || i >= COLS || j < 0 || j >= ROWS || k < 0 || k >= LAYERS){
        return undefined;
    }
    return gridCells[i][j][k];
}


function removeWalls(a, b){

    var x = a.col - b.col;
    if (x === 1){
        a.walls[2] = false;
        b.walls[3] = false;
    } else if ( x === -1){
        a.walls[3]= false;
        b.walls[2] = false;
    }

    var y = a.row - b.row;
    if(y === 1){
        a.walls[1] = false;
        b.walls[0] = false;
    } else if( y === -1){
        a.walls[0] = false;
        b.walls[1] = false;

    }

    var z = a.layer - b.layer;
    if( z === 1){

        a.walls[5] = false;
        b.walls[4] = false;

    } else if( z === -1){

        a.walls[4] = false;
        b.walls[5] = false;

    }


}

function ThreeCell(col, row, layer){

    this.col = col;
    this.row = row;
    this.layer = layer;

    this.geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    this.material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe:true});

    //the default mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = (col * CUBE_SIZE) + xOffSet;
    this.mesh.position.y = (row * CUBE_SIZE) + yOffSet;
    this.mesh.position.z = (layer * CUBE_SIZE + zOffSet);

    //the visited material;
    this.visitedMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    this.currentMaterial = new THREE.MeshBasicMaterial({color: 0x00f0ff, wireframe: false});


    //state variables
    this.visited = false;
    this.isCurrent = false;


    // the WALLS portion of the CELL
    //the walls booleans set in the order of top,bot,left, right, front, back
    this.walls = [true,true,true,true,true,true];
    // the geometries for the different walls
    this.topGeom    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE/10, CUBE_SIZE);
    this.botGeom    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE/10, CUBE_SIZE);
    this.leftGeom   = new THREE.BoxGeometry(CUBE_SIZE/10, CUBE_SIZE, CUBE_SIZE);
    this.rightGeom  = new THREE.BoxGeometry(CUBE_SIZE/10, CUBE_SIZE, CUBE_SIZE);
    this.frontGeom  = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE/10);
    this.backGeom    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE/10);

    this.wallMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe:false, transparent:true, opacity:0.2});
    var testMaterial = new THREE.MeshBasicMaterial({color:0xff00ff, wireframe:true});


    this.topWall    = new THREE.Mesh(this.topGeom, this.wallMaterial);
    this.topWall.position.x = (this.mesh.position.x);
    this.topWall.position.y = (this.mesh.position.y) + CUBE_SIZE/2;
    this.topWall.position.z = (this.mesh.position.z);

    this.botWall    = new THREE.Mesh(this.botGeom, this.wallMaterial);
    this.botWall.position.x = (this.mesh.position.x);
    this.botWall.position.y = (this.mesh.position.y) - CUBE_SIZE/2;
    this.botWall.position.z = (this.mesh.position.z);

    this.leftWall   = new THREE.Mesh(this.leftGeom, this.wallMaterial);
    this.leftWall.position.x = (this.mesh.position.x) - CUBE_SIZE/2;
    this.leftWall.position.y = (this.mesh.position.y);
    this.leftWall.position.z = (this.mesh.position.z);

    this.rightWall  = new THREE.Mesh(this.rightGeom, this.wallMaterial);
    this.rightWall.position.x = (this.mesh.position.x) + CUBE_SIZE/2;
    this.rightWall.position.y = (this.mesh.position.y);
    this.rightWall.position.z = (this.mesh.position.z);

    this.frontWall   = new THREE.Mesh(this.frontGeom, this.wallMaterial);
    this.frontWall.position.x = (this.mesh.position.x);
    this.frontWall.position.y = (this.mesh.position.y);
    this.frontWall.position.z = (this.mesh.position.z) +  CUBE_SIZE/2;

    this.backWall  = new THREE.Mesh(this.backGeom, this.wallMaterial);
    this.backWall.position.x = (this.mesh.position.x);
    this.backWall.position.y = (this.mesh.position.y);
    this.backWall.position.z = (this.mesh.position.z) - CUBE_SIZE/2;

    this.wallMeshes = [this.topWall, this.botWall, this.leftWall, this.rightWall, this.frontWall, this.backWall];

    if( layer == LAYERS-1){
        this.walls[4] = false;
    }
    if (row == ROWS - 1){
        this.walls[0] = false;
    }
    if (col == COLS -1 ) {
        this.walls[3] = false;
    }
    if( layer == 0){
        this.walls[5] = false;
    }
    if (row == 0){
        this.walls[1] = false;
    }
    if (col == 0 ) {
        this.walls[2] = false;
    }



    this.setWallMaterial = function () {
        for (var i = 0; i < this.wallMeshes.length; i++){
            if (this.walls[i]){
                this.wallMeshes[i].material = this.wallMaterial;
            } else {
                this.wallMeshes[i].visible = false;
            }
        }
    };

    this.addToScene = function() {
        scene.add(this.mesh);
        this.mesh.visible = false;
        for (var i = 0; i < this.wallMeshes.length; i ++){
            scene.add(this.wallMeshes[i]);
        }
    };

    this.highlight = function () {
        this.mesh.visible = true;
        this.mesh.material = this.currentMaterial;
    };


    this.display = function(){
        if(this.isCurrent){
            this.highlight();
        }
        else if(this.visited) {
            this.mesh.visible = false;
        }
        this.setWallMaterial();
    };


    this.getNeighbors = function(){
        var neighbors = [];

        var top     = getThreeIndex(this.col,    this.row+1,     this.layer);
        var bot     = getThreeIndex(this.col,    this.row - 1,   this.layer);
        var right   = getThreeIndex(this.col- 1, this.row,       this.layer);
        var left    = getThreeIndex(this.col+ 1, this.row,       this.layer);
        var front   = getThreeIndex(this.col,    this.row,       this.layer+1);
        var back    = getThreeIndex(this.col,    this.row,       this.layer-1);


        if (top && !top.visited){
            neighbors.push(top);
        }
        if (bot && !bot.visited){
            neighbors.push(bot);
        }
        if (right && !right.visited){
            neighbors.push(right);
        }
        if (left && !left.visited){
            neighbors.push(left);
        }
        if (front && !front.visited){
            neighbors.push(front);
        }
        if (back && !back.visited){
            neighbors.push(back);
        }
        if (neighbors.length > 0){

            var r = (Math.floor(Math.random()*neighbors.length));
            console.log(r);
            return neighbors[r];
        } else {
            return undefined;
        }

    }


}



function make3DArray(rows, cols, layers){

    var arr = [];
    for(var i = 0; i < cols; i++){
        arr[i] = [];
        for(var j = 0; j < rows; j ++){
            arr[i][j] = [];
            for(var k = 0; k < layers; k++){
                var newCell = new ThreeCell(i,j,k);
                newCell.addToScene();
                arr[i][j].push(newCell);
            }
        }
    }

    return arr;

}
// inspired by Matthew Crumley's answer in stack overflow for creating multidimensional arrays
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
// extended to 3d, initializing the cell objects here

function init(){

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.z = 1000;

    gridCells = make3DArray(ROWS, COLS, LAYERS);


    currentCell = gridCells[0][0][0];
    currentCell.isCurrent = true;


    renderer = new THREE.WebGLRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight);


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

            var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

     var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(CUBE_SIZE * COLS/2, CUBE_SIZE * ROWS/2, CUBE_SIZE* LAYERS*2);
        spotLight.castShadow = true;
        scene.add(spotLight);

    var backLight = new THREE.SpotLight(0xffffff);
    backLight.position.set(CUBE_SIZE * COLS/2, CUBE_SIZE * ROWS/2, - CUBE_SIZE* LAYERS*2);
    spotLight.castShadow = true;
    scene.add(backLight);


    document.body.appendChild(renderer.domElement);
}



var traversing = true;

function animate(){

    requestAnimationFrame( animate );

    controls.update();

    for (var i = 0; i < COLS; i ++){
        for (var j = 0; j < ROWS; j++){
            for(var k = 0; k < LAYERS; k++){
                gridCells[i][j][k].display();
            }
        }
    }
    if (traversing) {
        currentCell.visited = true;
        currentCell.isCurrent = false;
        var next = currentCell.getNeighbors();
        console.log(next);
        if (next) {

            stack.push(currentCell);
            next.visited = true;

            removeWalls(currentCell, next);
            currentCell = next;
            currentCell.isCurrent = true;

        } else if ( stack.length > 0){

            currentCell = stack.pop();
            currentCell.isCurrent = true;

        } else{

            traversing = false;

        }
    }

    renderer.render( scene, camera);

}

window.addEventListener('resize', resizeTHREE, false);


function resizeTHREE(){

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
