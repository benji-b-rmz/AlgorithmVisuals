/**
 * Created by benji on 2/2/17.
 */

/*
   Solving a randomly generated maze with the A* algorithm
    Showing the nodes it traverses during search
 */
var scene, camera, renderer, controls;
var geometry, material, mesh;
//the dimensions and size of the cells generated
var COLS = 20;
var ROWS = 20;
var CUBE_SIZE = 50;
var WIDTH, HEIGHT;
var TOP = 0, BOT = 1, LEFT = 2, RIGHT = 3; // the wall indices
var gridCells = [[]];
var stack = [];
var currentCell;


var traversing = true;
var solving = false;
var start, goal;
var closedSet = [];
var openSet = [];
var cameFrom = make2DArray(COLS, ROWS, null);
var gScore = make2DArray(COLS, ROWS, Number.MAX_VALUE);
var fScore = make2DArray(COLS, ROWS, Number.MAX_VALUE);

var xOffSet = - (CUBE_SIZE * COLS)/2;
var yOffSet = - (CUBE_SIZE * ROWS)/2;

init();
animate();


function getIndex(i, j){

    if(i < 0 || i >= COLS || j < 0 || j >= ROWS){
        return undefined;
    }
    return gridCells[i][j];
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
}


function Cell (col, row){
    this.isCurrent = false;
    this.col = col;
    this.row = row;
    this.geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    this.material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:false});
    this.highlightMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
    this.visitedMaterial = new THREE.MeshBasicMaterial({color:0x000000, wireframe:true});

    //the CUBE portion of the object
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = (col * CUBE_SIZE) + xOffSet;
    this.mesh.position.y = (row * CUBE_SIZE) + yOffSet;
    this.mesh.position.z = 0;

    //the WALL portion of CELL:
    this.walls = [true,true,true,true];
    this.topGeom    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE/10, CUBE_SIZE+1);
    this.botGeom    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE/10, CUBE_SIZE+1);
    this.leftGeom   = new THREE.BoxGeometry(CUBE_SIZE/10, CUBE_SIZE, CUBE_SIZE+1);
    this.rightGeom  = new THREE.BoxGeometry(CUBE_SIZE/10, CUBE_SIZE, CUBE_SIZE+1);

    this.wallMaterial = new THREE.MeshLambertMaterial({ color: 0x0f0fff, wireframe:false});
    this.removedMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true});


    this.topWall    = new THREE.Mesh(this.topGeom, this.wallMaterial);
    this.topWall.position.x = (this.mesh.position.x);
    this.topWall.position.y = (this.mesh.position.y) + CUBE_SIZE/2;

    this.botWall    = new THREE.Mesh(this.botGeom, this.wallMaterial);
    this.botWall.position.x = (this.mesh.position.x);
    this.botWall.position.y = (this.mesh.position.y) - CUBE_SIZE/2;

    this.leftWall   = new THREE.Mesh(this.leftGeom, this.wallMaterial);
    this.leftWall.position.x = (this.mesh.position.x) - CUBE_SIZE/2;
    this.leftWall.position.y = (this.mesh.position.y);

    this.rightWall  = new THREE.Mesh(this.rightGeom, this.wallMaterial);
    this.rightWall.position.x = (this.mesh.position.x) + CUBE_SIZE/2;
    this.rightWall.position.y = (this.mesh.position.y);


    this.wallMeshes = [this.topWall, this.botWall, this.leftWall, this.rightWall];

    this.setWallMaterial = function () {
        for (var i = 0; i < this.wallMeshes.length; i++){
            if (this.walls[i]){
                this.wallMeshes[i].material = this.wallMaterial;
            } else {
                this.wallMeshes[i].visible = false;
            }
        }
    };

    this.visited = false;

    this.addToScene = function(){
        scene.add(this.mesh);
        for(var i = 0; i < this.wallMeshes.length; i++){
            scene.add(this.wallMeshes[i]);
        }
    };

    this.highlight = function(){
        this.mesh.material = this.highlightMaterial;
        this.visited = false;
        this.mesh.visible = true;
    };

    this.display = function(){
        if(this.isCurrent) {
            this.mesh.visible = true;
            this.highlight();
        } else if (this.visited){
            this.mesh.visible = false;
        }
        this.setWallMaterial();
    };

    this.rotate = function(){
        this.mesh.rotation.y += 0.1;
    };

    this.getNeighbors = function(){
        var neighbors = [];

        var top     = getIndex(col, row+1);
        var bot     = getIndex(col,row - 1);
        var right   = getIndex(col - 1,row);
        var left    = getIndex(col + 1,row);

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
        if (neighbors.length > 0){

            var r = (Math.floor(Math.random()*neighbors.length));
            console.log(r);
            return neighbors[r];
        } else {
            return undefined;
        }
    }
}

function manhattanDistance(current, goal){

    return (Math.abs(current.col - goal.col) + Math.abs(current.row - goal.row));

}

function getNeighbors(cell){
    var neighbors = [];
    //refactor for DRYness
    if (cell.walls[TOP] == false){
        neighbors.push(gridCells[cell.col][cell.row + 1]);
    }
    if (cell.walls[BOT] == false){
        neighbors.push(gridCells[cell.col][cell.row - 1]);
    }
    if (cell.walls[LEFT] == false){
        neighbors.push(gridCells[cell.col - 1][cell.row]);
    }
    if (cell.walls[RIGHT] == false){
        neighbors.push(gridCells[cell.col + 1][cell.row]);
    }

    return neighbors;
}

function reconstructPath(cameFrom, current){
    totalPath = [current];
    while(current != null){
        current = cameFrom[current.col][current.row];
        totalPath.push(current);
    }
    return totalPath;
}

function containsObject(obj, list) {
    //this function from: http://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array=
    // thanks cdhowie
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}


function make2DArray(cols, rows, value){
    var arr = [];
    for (var i = 0; i < cols; i ++){
        arr[i] = [];
        for (var j = 0; j < rows; j++){
            arr[i].push(value);
        }
    }
    return arr;
}

function init(){

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.z = 1000;

    gridCells = make2DArray(COLS, ROW, null); // initialize the grid array
    for(var i = 0; i < COLS; i ++){
        for (var j = 0; j < ROWS; j++){
            var newCell = new Cell(i, j);
            newCell.addToScene();
            gridCells[i][j] = newCell;

        }
    }
    currentCell = gridCells[0][0];

    //add lighting in order to see the '3D' shading of the lambert material walls
    var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(CUBE_SIZE * COLS/2, CUBE_SIZE * ROWS/2, CUBE_SIZE* ROWS/2);
        spotLight.castShadow = true;
        scene.add(spotLight);


    renderer = new THREE.WebGLRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight);


    controls = new THREE.OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = false;

    document.body.appendChild(renderer.domElement);
}


function animate(){

    requestAnimationFrame( animate );
    controls.update();
    var search;

    for (var i = 0; i < COLS; i ++){
        for (var j = 0; j < ROWS; j++){
            gridCells[i][j].display();
        }
    }

    if (traversing) {
        currentCell.visited = true;
        currentCell.isCurrent = false;
        // get a random cell from the surrounding cells that has not been visited
        var next = currentCell.getNeighbors();
        if (next) {
            // if we found an unvisited neighbor, add it to stack, and remove walls transitioned through
            stack.push(currentCell);
            next.visited = true;
            removeWalls(currentCell, next);
            currentCell = next;
            currentCell.isCurrent = true;

        } else if (stack.length > 0) {
            // if we found no neighbors, but there are cells on stack, backtrack.
            currentCell = stack.pop();
            currentCell.isCurrent = true;

        } else {
            // the stack is empty, the maze has been traversed
            solving = true;
            start = gridCells[0][0];
            goal = gridCells[COLS-1][ROWS-1];

            fScore[start.col][ start.row] = manhattanDistance(start, goal);
            gScore[start.col][ start.row] = 0;
            openSet.push(start);
            traversing = false;

        }

    }else if(solving){
        console.log("solving the maze");
        var current;
        if(openSet.length > 0){

            var minScore = Number.MAX_VALUE;

            for(var i = 0; i < openSet.length; i++){
                var nodeScore = fScore[openSet[i].col][openSet[i].row];
                if (nodeScore < minScore){
                    minScore = nodeScore;
                    current = openSet[i];
                }
            }
            console.log(current);
            if (current == gridCells[COLS-1][ROWS-1]){ //we solved the maze, return the path
                console.log("SUCCESS");
                solving = false;
                search =  reconstructPath(cameFrom, current);

            }else {

                openSet.splice(openSet.indexOf(current), 1);
                closedSet.push(current);

                var neighbors = getNeighbors(current);

                for (var i = 0; i < neighbors.length; i++) {
                    if (containsObject(neighbors[i], closedSet)) {
                        console.log("found neighbor in closedSet");
                        continue;
                    }
                    var tempGScore = gScore[current.col][current.row] + 1; //the distance between neighbors==1
                    if (!(containsObject(neighbors[i], openSet))) { //discover the new node
                        openSet.push(neighbors[i]);
                    } else if (tempGScore >= gScore[neighbors[i].col][neighbors[i].row]) {
                        continue; //this is not a better path
                    }
                    // if the neighbor passes the checks, it is added with the current as the previous
                    cameFrom[neighbors[i].col][neighbors[i].row] = current;
                    gScore[neighbors[i].col][neighbors[i].row] = tempGScore;
                    fScore[neighbors[i].col][neighbors[i].row] = gScore[neighbors[i].col][neighbors[i].row] + manhattanDistance(neighbors[i], goal);

                }
                search = reconstructPath(cameFrom, current);
            }

            console.log("REDISPLAYING");
            console.log(search);
            for (var i =0; i < search.length; i++ ) {
                if(search[i])search[i].highlight();
            }

        }else{
            console.log("NO SOLUTION FOUND");
            solving = false;
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