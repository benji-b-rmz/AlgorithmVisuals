/**
 * Created by benji on 7/4/17.
 */


var scene;
var camera;
var renderer;
var controls;

var FLAG_WIDTH = 32,
    FLAG_HEIGHT = 20,
    RED_STRIPES = 7;

init();
animate();

function initLights(scene){
    var lightColor = 0xffffff;
    var sphere = new THREE.SphereGeometry(3, 5, 5);
    var pointLight = new THREE.PointLight(lightColor, 2.5, 200, 2);
    pointLight.position.set(10, 50, 20);
    pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: lightColor })));
    scene.add( pointLight );
}

function addOrbitalControls( camera, rend ) {
    controls = new THREE.OrbitControls( camera, rend.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;
}

function addFlag( scene ){
    // create the white base of the flag
    var flagGeometry = new THREE.BoxGeometry(FLAG_WIDTH, FLAG_HEIGHT, 5);
    var flagRectangle = new THREE.Mesh(
        flagGeometry,
        new THREE.MeshLambertMaterial({color: 0xFFFFFF})
    );
    scene.add( flagRectangle );

    // add the stripes
    for(var i = 0; i <= RED_STRIPES; i++){
        var flagStripe = new THREE.Mesh(
            new THREE.BoxGeometry(FLAG_WIDTH, FLAG_HEIGHT/13, 6),
            new THREE.MeshLambertMaterial({color: 0xFF0000})
        );
        flagStripe.position.y = FLAG_HEIGHT/2 - ((FLAG_HEIGHT/RED_STRIPES) * i);
        scene.add(flagStripe);
    }
    // add the blue box
    var blueGeometry = new THREE.BoxGeometry(FLAG_WIDTH/2, FLAG_HEIGHT/2 + (FLAG_HEIGHT/RED_STRIPES) , 6.5);
    var blueMesh = new THREE.Mesh (
        blueGeometry,
        new THREE.MeshLambertMaterial({color: 0x0000FF})
    );
    blueMesh.position.set(-FLAG_WIDTH/4, FLAG_HEIGHT/4 , 0);
    scene.add(blueMesh);
}

function init() {
    // initialize the scene and meshes
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );
    //lights
    initLights(scene);
    //camera
    camera = new THREE.PerspectiveCamera( 90, ( window.innerWidth / window.innerHeight ), 0.1, 10000);
    camera.position.z = 100;
    //add objects
    addFlag(scene);
    //action
    renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    addOrbitalControls( camera, renderer );
    document.body.appendChild( renderer.domElement );

}

function animate(){
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', resizeTHREE, false );

function resizeTHREE() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}