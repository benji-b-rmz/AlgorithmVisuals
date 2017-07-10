/**
 * Created by benji on 7/9/17.
 */
// casting shadows from shapes onto plane


var scene;
var camera;
var renderer;
var controls;
var geometry, material, mesh;
var lights = [];
var objs = [];

init();
animate();



function createSceneObjects(scene){
    // first make the plane floor
    var floorGeom = new THREE.PlaneGeometry(20, 20);
    var floor = new THREE.Mesh(
        floorGeom,
        new THREE.MeshLambertMaterial({color: 0xffffff})
    );
    floor.receiveShadow = true;
    floor.position.set(0, -40, 0); //place below the origin
    floor.rotateX(90.0);
    scene.add(floor);

    //create objects which cast shadows above the floor
    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10),
        new THREE.MeshLambertMaterial({color: 0xff0000})
    );
    cube.castShadow = true;
    cube.position.set(-3, 0, 0);
    scene.add(cube);
}

function addPointLight(x, y, z, color) {

    var sphere = new THREE.SphereGeometry(3, 5, 5);
    var pointLight = new THREE.PointLight(color, 2.5, 200, 2);
    pointLight.position.set(x, y, z);
    pointLight.castShadow = true;
    pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: color })));
    scene.add( pointLight );
    scene.add(pointLight);

}

function init(){

    //set up the scene, camera, lights, controls, and renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 10000);
    camera.position.z = 100;

    //the scene's objects
    createSceneObjects(scene);
    addPointLight(0, 40, 0, 0xffffff);

    //create the renderer
    renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );

    //orbit controls(allows zooming(scroll) and rotating(mouse drag))
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;

    // add the canvas to the webpage:
    document.body.appendChild(renderer.domElement);

}


function animate() {

    requestAnimationFrame( animate );
    //call this function up to 60 times per second

    for( var i = 0; i < objs.length; i ++){

        objs[i].rotation.x += Math.PI * 0.01;
        objs[i].rotation.y += Math.PI * 0.01;

    }

    controls.update();
    //recalc camera based on control input
    renderer.render( scene, camera );

}


window.addEventListener('resize', resizeTHREE, false);


function resizeTHREE() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}