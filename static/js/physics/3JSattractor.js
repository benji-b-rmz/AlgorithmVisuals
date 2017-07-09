/**
 * Created by benji on 2/22/17.
 */
// Creating 3D attractor and particle physics simulation using ThreeJS

var scene;
var camera;
var renderer;
var controls;
var geometry, material, mesh;

var particles = [],
    attractors = [],
    numParticles = 20,
    shapeSize = 2,
    sceneSize = 100;



var attractors = [],
    amplitude = 1,
    angle = 0.0,
    frequency = 0.1;

init();
animate();


// the Particle object, will be passed a geometry, and initial coordinates
// random int function from mozilla dev network
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addPointLight(x, y, z, color) {

    var sphere = new THREE.SphereGeometry(3, 5, 5);
    var pointLight = new THREE.PointLight(color, 2.5, 100, 2);
    pointLight.position.set(x, y, z);
    pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: color })));
    scene.add( pointLight );
    scene.add(pointLight);

}


function Particle(shape, material, x, y, z){

    this.mesh = new THREE.Mesh(shape, material);
    this.mesh.position.set(x, y, z);

    //set physics properties velocity, acceleration,
    this.vel = new THREE.Vector3(0, 0, 0);
    this.acc = new THREE.Vector3(0, 0, 0);

    this.update = function () {

        this.vel.add(this.acc);
        //limit the velocity vector strength;
        this.mesh.position.add(this.vel); //update the position

        this.acc.multiplyScalar(0);
    };

    this.applyForce = function(forceVector){
        this.acc.add(forceVector);
    };

    this.addToScene = function () {

        scene.add(this.mesh);
        console.log(this.mesh.position);

    };

}

function createParticles(numP){

    for ( var i = 0; i < numP; i ++){

        var shape = new THREE.BoxGeometry(shapeSize, shapeSize, shapeSize);
        var material = new THREE.MeshStandardMaterial({
            color: 0xffffff, wireframe:false
        });
        var x = getRandomInt(-sceneSize/2, sceneSize/2),
            y = getRandomInt(-sceneSize/2, sceneSize/2),
            z = getRandomInt(-sceneSize/2,sceneSize/2);

        var particle = new Particle(shape, material, x, y, z );
        particle.addToScene();
        particles.push(particle);

    }
}

function addAttractor(x, y, z){
    var attractor = new THREE.Vector3(x, y, z);
    attractors.push(attractor);
}

function addLights(){
    var redColor = 0xff0000,
        greenColor = 0x00ff00;
    cyanColor = 0x00ffff;
    addPointLight(-10, 0, 0, redColor);
    addPointLight(10, 0, 0, greenColor);
    addPointLight(0, 0, 0, cyanColor);
}


function init(){

    //set up the scene, camera, lights, controls, and renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 10000);
    camera.position.z = 100;

    // lights, positioned above initially
    addLights();

    renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;

    //add the attractors
    addAttractor(0, 0, 0);
    addAttractor(10, 0, 0);
    addAttractor(-10, 0, 0);
    // now create and add the objects to the scene
    createParticles(numParticles);
    // add the canvas to the webpage:
    document.body.appendChild(renderer.domElement);

}

function applyAttractorForcesToParticles(){
    // apply a force from every attractor to each particle
    for(var i = 0; i < attractors.length; i++){

        for ( var j = 0; j < particles.length; j ++){

            // get the direction of the force by subtraction then normalize
            var forceVec = new THREE.Vector3(
                (attractors[i].x - particles[j].mesh.position.x),
                (attractors[i].y - particles[j].mesh.position.y),
                (attractors[i].z - particles[j].mesh.position.z));

            forceVec.normalize(); // normalize the vector so we only have the direction
            forceVec.multiplyScalar(0.1); // reduce the strength of the force

            particles[j].applyForce(forceVec);
            particles[j].update();

        }

    }
}

function animate() {

    requestAnimationFrame( animate ); //call this function up to 60 times per second

    controls.update(); //recalc camera based on control input

    applyAttractorForcesToParticles();

    renderer.render( scene, camera );

}


window.addEventListener('resize', resizeTHREE, false);


function resizeTHREE() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}