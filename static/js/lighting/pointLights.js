/**
 * Created by benji on 2/27/17.
 */


var scene;
var camera;
var renderer;
var controls;
var geometry, material, mesh;



init();
animate();


// the Particle object, will be passed a geometry, and initial coordinates
// random int function from mozilla dev network
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function init(){

    //set up the scene, camera, lights, controls, and renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 10000);
    camera.position.z = 100;

    //the scene's objects
    var boxGeom = new THREE.BoxGeometry(20, 20, 20);
    var boxMaterial = new THREE.MeshStandardMaterial({color:0xffffff});
    var mainBox = new THREE.Mesh( boxGeom, boxMaterial );
    scene.add(mainBox);

    //make a few point lights
    var redColor = 0xff0000,
        greenColor = 0x00ff00,
        blueColor = 0x0000ff;

    var lightBox = new THREE.BoxGeometry(2, 2, 2);

    var redLight = new THREE.PointLight( redColor, 2.5, 70, 2);
    redLight.add( new THREE.Mesh( lightBox, new THREE.MeshBasicMaterial({ color: redColor })) );
    redLight.position.set(25,0,25);

    var greenLight = new THREE.PointLight( greenColor, 2.5, 70, 2);
    greenLight.add( new THREE.Mesh( lightBox, new THREE.MeshBasicMaterial({ color: greenColor })) );
    greenLight.position.set(0,25,25);


    var blueLight = new THREE.PointLight( blueColor, 2.5, 70, 2);
    blueLight.add( new THREE.Mesh( lightBox, new THREE.MeshBasicMaterial({ color: blueColor })) );
    blueLight.position.set(-25,0,25);

    scene.add( redLight, greenLight, blueLight);

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

    requestAnimationFrame( animate ); //call this function up to 60 times per second

    controls.update(); //recalc camera based on control input

    renderer.render( scene, camera );

}


window.addEventListener('resize', resizeTHREE, false);


function resizeTHREE() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}