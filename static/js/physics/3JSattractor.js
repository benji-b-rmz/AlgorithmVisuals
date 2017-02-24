/**
 * Created by benji on 2/22/17.
 */
// Creating 3D attractor and particle physics simulation using ThreeJS

var scene, camera, renderer, controls;
var geometry, material, mesh;

var particles = [];
var numParticles = 100;
var shapeSize = 3;

var attractor;


init();
animate();


// the Particle object, will be passed a geometry, and initial coordinates
// random int function from mozilla dev network
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addSpotLight(x, y, z, color) {

    var spotLight = new THREE.SpotLight(color);
    spotLight.position.set(x, y, z);
    spotLight.castShadow = false;
    scene.add(spotLight);

}

function createBackground(x, y, z, color){
    var geom = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshLambertMaterial({
        color: color,
        wireframe: false
    });
    var background = new Particle(geom, material, 0, 0, 0); // at origin
    background.addToScene();
}

function Particle(shape, material, x, y, z){

    this.mesh = new THREE.Mesh(shape, material);
    this.mesh.position.set(x, y, z);

    //set physics properties velocity, acceleration,
    this.vel = new THREE.Vector3(0, 0, 0);
    this.acc = new THREE.Vector3(0, 0, 0);

    this.update = function () {

        this.vel.add(this.acc);
        
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
        var material = new THREE.MeshLambertMaterial({
            color: 0xff00ff, wireframe:false
        });
        var x = getRandomInt(-50, 50),
            y = getRandomInt(-50, 50),
            z = getRandomInt(-50, 50);

        var particle = new Particle(shape, material, x, y, z );
        particle.addToScene();
        particles.push(particle);

    }

}

function init(){

    //set up the scene, camera, lights, controls, and renderer

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 10000);
    camera.position.z = 100;

    // lights, positioned above initially
    addSpotLight(0, 200, 0, 0xffffff);
    addSpotLight(0, 0, 200, 0xffffff);


    renderer = new THREE.WebGLRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;



    // now create and add the objects to the scene
    createParticles(numParticles);

    attractor = new THREE.Vector3(0,0,0);
    for (var i = 0; i < particles.length; i ++){

        var forceVec = new THREE.Vector3( attractor.x - particles[i].mesh.position.x,
                                        attractor.y - particles[i].mesh.position.y,
                                        attractor.z - particles[i].mesh.position.z);
        particles[i].applyForce(forceVec);

    }



    // add the canvas to the webpage:
    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame( animate ); //call this function up to 60 times per second

    controls.update(); //recalc camera based on control input

    for ( var i = 0; i < particles.length; i ++){

        particles[i].update();

    }

    renderer.render( scene, camera );

}


window.addEventListener('resize', resizeTHREE, false);


function resizeTHREE() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}