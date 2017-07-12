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
    var floorGeom = new THREE.BoxGeometry(200, 2, 200);
    var floor = new THREE.Mesh(
        floorGeom,
        new THREE.MeshLambertMaterial({color: 0xffffff})
    );
    floor.receiveShadow = true;
    floor.castShadow = true;
    floor.position.set(0, -10, 0); //place below the origin
    // floor.rotateX(90.0);
    scene.add(floor);

    //create objects which cast shadows above the floor
    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(10, 10, 10),
        new THREE.MeshLambertMaterial({color: 0xff0000})
    );
    cube.castShadow = true;
    cube.position.set(-20, 0, 0);
    scene.add(cube);

    var tetrahedron = new THREE.Mesh(
        new THREE.TetrahedronGeometry(10, 0),
        new THREE.MeshLambertMaterial({color: 0x0000ff})
    );
    tetrahedron.castShadow = true;
    tetrahedron.position.set(20, 0, 0);
    scene.add(tetrahedron);

    torusMesh = new THREE.Mesh(
        new THREE.TorusGeometry(5, 1, 10, 10),
        new THREE.MeshLambertMaterial({color:0x00ff00})
    );
    torusMesh.castShadow = true;
    torusMesh.position.set(0, 0, -20);
    scene.add( torusMesh );

    torusKnotMesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(5, 1, 50, 3),
        new THREE.MeshLambertMaterial({color:0x00ffff})
    );
    torusKnotMesh.castShadow = true;
    torusKnotMesh.position.set(0, 0, 20);
    scene.add( torusKnotMesh );
}

function addPointLight(x, y, z, color) {

    var sphere = new THREE.SphereGeometry(3, 5, 5);
    var pointLight = new THREE.PointLight(color, 2.5, 200, 2);
    pointLight.position.set(x, y, z);
    pointLight.castShadow = true;
    pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: color })));
    scene.add(pointLight);

}

function addSpotLight(x, y, z, color) {
    var spotLight = new THREE.SpotLight(color);
    spotLight.position.set(x, y, z);
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);
}


function init(){

    //set up the scene, camera, lights, controls, and renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );

    //the camera obj parameters = (FoV, aspect ratio, znear, zfar)
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth/window.innerHeight), 0.1, 10000);
    camera.position.z = 50;
    camera.position.y = 20;
    camera.position.x = 20;

    //the scene's objects
    createSceneObjects(scene);
    addPointLight(0, 20, 0, 0xffffff);
    addSpotLight(20, 10, 0, 0xff00ff);

    //create the renderer
    renderer = Detector.webgl? new THREE.WebGLRenderer({antialias: true}): new THREE.CanvasRenderer();
    renderer.autoResize = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
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