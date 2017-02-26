/**
 * Created by benji on 2/25/17.
 */

// testing out raycasting for mousecapture

var scene, camera, renderer;
var geometry, material, mesh;

//the mousecap variables:
var raycaster,
    mouse;


var particles = [],
    numParticles = 10,
    shapeSize = 5,
    sceneSize = 100;

//game vars
var score = 0,
    lives = 5,
    scoreLabel;

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
    this.alive = true;
    //set physics properties velocity, acceleration,
    this.vel = new THREE.Vector3(0, 0, 0.1);
    this.acc = new THREE.Vector3(0, 0, 0);

    this.update = function () {

        this.vel.add(this.acc);
        //limit the velocity vector strength;
        // this.vel.clamp(minSpeed, maxSpeed);
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

    this.removeFromScene = function() {

        scene.remove(this.mesh);

        // console.log(this.mesh.position);
    }

}

function createParticles(numP){

    for ( var i = 0; i < numP; i ++){

        var shape = new THREE.BoxGeometry(shapeSize, shapeSize, shapeSize);
        var material = new THREE.MeshLambertMaterial({
            color: 0xff0000, wireframe:false
        });
        var x = getRandomInt(-sceneSize/2, sceneSize/2),
            y = getRandomInt(-sceneSize/2, sceneSize/2),
            z = 0;

        var particle = new Particle( shape, material, x, y, z );
        particle.addToScene();
        particles.push(particle);

    }

}


function updateLabel(){

    if ( lives > 0 ){

        scoreLabel.innerHTML = 'Score: ' + score + ' || Lives: ' + lives;
    }
    else {

        scoreLabel.innerHTML = 'GAME OVER';
    }

}

function removeObject(obj, list){

    var i;
    for ( i  = 0; i < list.length; i ++){
        if (list[i].mesh === obj){
            list.splice(i, 1);
        }
    }

}

function onMouseClick( event ){
    //from the documentation on raycasting
    //calc mouse position in normalized device coords
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    console.log(mouse.x, mouse.y);
    //update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //calculate the objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    for( var i = 0; i < intersects.length; i++){

        console.log(intersects[i]);
        // intersects[i].object.material.color.set(0xffff00);
        removeObject(intersects[i].object, particles);
        scene.remove(intersects[i].object);
        score += 1;
        updateLabel();
        createParticles(1);

    }

}


function init(){

    //set up the score div
    scoreLabel = document.createElement('div');
    scoreLabel.style.position = 'fixed';
    scoreLabel.style.zIndex = 1;
    scoreLabel.style.width =  100 + "%";
    scoreLabel.style.margin = 'auto';
    scoreLabel.style.fontFamily = 'Arial';
    scoreLabel.style.fontSize = 'Larger';
    scoreLabel.style.height = 50;
    // scoreLabel.style.backgroundColor = 'cyan';
    scoreLabel.style.color = 'white';
    updateLabel();

    scoreLabel.style.left = window.innerWidth/2 + 'px';
    document.body.appendChild(scoreLabel);

    //set up the scene, camera, lights, controls, and renderer
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

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


    // now create and add the objects to the scene
    createParticles(numParticles);


    // add the canvas to the webpage:
    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate); //call this function up to 60 times per second

    //while player is alive, keep moving particles
    if (lives > 0) {

        for (var i = 0; i < particles.length; i++) {

            // get the direction of the force by subtraction then normalize
            if (particles[i].alive == false){
                particles.splice(i, 1);
            }else{

                particles[i].update();

                if (particles[i].mesh.position.z > 60) {
                    particles[i].removeFromScene();
                    particles.splice(i, 1);
                    lives --;
                    createParticles(1);
                }
            }

        }
        console.log(lives);
        updateLabel();

        renderer.render(scene, camera);

    } else {

        updateLabel();
        renderer.render(scene, camera);

    }

}

window.addEventListener('resize', resizeTHREE, false);
window.addEventListener('click', onMouseClick, false);

function resizeTHREE() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}