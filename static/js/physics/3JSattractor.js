/**
 * Created by benji on 2/22/17.
 */
// Creating 3D attractor and particle physics simulation using ThreeJS

var scene, camera, renderer, controls;
var geometry, material, mesh;

var particles = [];
var numParticles = 20;
var shapeSize = 100;


init();
animate();


// the Particle object, will be passed a geometry, and initial coordinates
// random int function from mozilla dev network
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function Particle(shape, material, x, y, z){

    this.mesh = new THREE.Mesh(shape, material);
    this.mesh.position.set(x, y, z);

    this.addToScene = function () {

        scene.add(this.mesh);
        console.log(this.mesh.position);

    }

}

function createParticles(numP){

    for ( var i = 0; i < numP; i ++){

        var shape = new THREE.BoxGeometry(shapeSize, shapeSize, shapeSize);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff00ff, wireframe:false
        });
        var x = getRandomInt(0, 100),
            y = getRandomInt(0, 100),
            z = getRandomInt(0, 100);



        var particle = new Particle(shape, material, x, y, z );
        particle.addToScene();
        particles.push(particle);

    }

}

function init(){

    //set up the scene, camera, lights, controls, and renderer

    scene = new THREE.Scene();

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth, window.innerHeight), 0.1, 10000);
    camera.position.z = 100;

    //lights, positioned above initially
    //var spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(0,50,0);
    // spotLight.castShadow = false;
    // scene.add(spotLight);


    renderer = new THREE.WebGLRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;



    // now create and add the objects to the scene

    // createParticles(numParticles);

     var shape = new THREE.BoxGeometry(shapeSize, shapeSize, shapeSize);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff00ff, wireframe:false
        });
        var x = getRandomInt(0, 100),
            y = getRandomInt(0, 100),
            z = getRandomInt(0, 100);



        var particle = new Particle(shape, material, x, y, z );
        particle.addToScene();
        particles.push(particle);

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