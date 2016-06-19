var leap = require("leapjs");
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var TWEEN = require("tween");

var camera, scene, renderer, controls;
init(window);
animate();
function init(window) {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 400;

    scene = new THREE.Scene();
    var light, object;
    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    var cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);

    var gridHelper = new THREE.GridHelper(100, 1);
    scene.add(gridHelper);

    controls = new OrbitControls( camera, container );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;


    window.lmp = {
        scene:scene,
        light:light,
        renderer:renderer,
        camera:camera,
        cameraHelper:cameraHelper,
        controls:controls
    }
    target(scene);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(time) {

    requestAnimationFrame( animate );
    TWEEN.Update(time);
    render();
}

function render() {
    renderer.render( scene, camera );
}

function target(scene){
    var geo = new THREE.SphereGeometry(5,32,32);
    var material = new THREE.MeshPhongMaterial();
    var mesh = new THREE.Mesh(geo,material);
    scene.add(mesh);
    mesh.position.set(0,400,0);

    var tween = new TWEEN(mesh.position);
    tween.to({y:0});
}
