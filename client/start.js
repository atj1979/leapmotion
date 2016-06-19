
var $ = require("jquery");
var Leap = require("leapjs");
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var TWEEN = require("tween");

var camera, scene, renderer, controls, tween;
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

  leapController = leapSetup();

  window.lmp = {
    scene:scene,
    light:light,
    renderer:renderer,
    camera:camera,
    cameraHelper:cameraHelper,
    controls:controls,
    leapController:leapController
  }
  var tween = projectile(scene);

  window.addEventListener("keypress", function(){
    tween.start();
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(time) {
  requestAnimationFrame( animate );
  TWEEN.update();
  render();
}

function render() {
  renderer.render( scene, camera );
}



function leapSetup (){
  var controller = new Leap.Controller();
  controller.connect();
  debugger
  return controller;
}







//******MOVE OUT *********//
function projectile(scene){
  var geo = new THREE.SphereGeometry(5,32,32);
  var material = new THREE.MeshPhongMaterial();
  var mesh = new THREE.Mesh(geo,material);
  scene.add(mesh);
  mesh.position.set(0,400,0);

  var start = mesh.position.clone(); // Will be modified
  var end = new THREE.Vector3();
  return fromTo(mesh, end);
}

function fromTo(obj, end, start, time, reset){
  time = time || 2;
  start = start || obj.position.clone();
  tween = new TWEEN.Tween(start.clone());
  tween
    .to(end, 2000)
    .easing(TWEEN.Easing.Cubic.In)
    .onUpdate(function (val){
      obj.position.set((1-val) * start.x, (1-val) * start.y, (1-val) * start.z);
    })
    .onComplete(function (){
      if (reset){
        obj.position.set(start.x, start.y, start.z);
      }
    });
  return tween;
}







