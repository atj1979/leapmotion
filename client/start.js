
var $ = require("jquery");
var Leap = require("leapjs");
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var TWEEN = require("tween");


var gestures = require("./gestures");
var Geometry = require("./Geometry");

var camera, scene, renderer, controls, tween, container, light, leapController;
var hand = {};
var rightIndexFingerSphere;
var rightThumbPointerLine, 
  rightIndexPointerLine,
  rightMiddlePointerLine,
  rightRingPointerLine,
  rightPinkyPointerLine;

var leftThumbPointerLine, 
  leftIndexPointerLine,
  leftMiddlePointerLine,
  leftRingPointerLine,
  leftPinkyPointerLine;

var handGeo = {
  right:{
    indexFinger:{
      sphere:rightIndexFingerSphere, 
      pointer:rightIndexPointerLine
    }
  }
};





init(window);
animate();

function init(window) {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 400;

  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x404040 ) );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  // var cameraHelper = new THREE.CameraHelper(camera);
  // scene.add(cameraHelper);

  var gridHelper = new THREE.GridHelper(100, 5);
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
    // cameraHelper:cameraHelper,
    controls:controls,
    // leapController:leapController
  }
  var tween = projectile(scene);

  window.addEventListener("keypress", function(){
    tween.start();
  });

  setupRings([new THREE.Vector3(50,50,-200),new THREE.Vector3(-50,100,-200),new THREE.Vector3(50,150,-200)], scene);

  window.THREE = THREE;
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
  updateIndexFingerSphere();
  updatePointerLine();
  var a = gestures.tipsTogether(hand.left);
  console.log(a);
}



function leapSetup (){
  Leap.loop({
        // frame callback is run before individual frame components
        frame: function(frame){
        
        },
        // hand callbacks are run once for each hand in the frame
        hand: function(hnd){
          updateHandModel(hnd);
        }
 });
}


function updateHandModel (hnd){
  hand[hnd.type] = hnd;  
}
function updatePointerLine(){
  if (!rightIndexPointerLine){
    rightThumbPointerLine = Geometry.pointerLine();
    rightIndexPointerLine = Geometry.pointerLine();
    rightMiddlePointerLine = Geometry.pointerLine();
    rightRingPointerLine = Geometry.pointerLine();
    rightPinkyPointerLine = Geometry.pointerLine();
    scene.add(rightThumbPointerLine, rightIndexPointerLine, rightMiddlePointerLine, rightRingPointerLine, rightPinkyPointerLine);
  }

  if(hand.right){
    rightThumbPointerLine.geometry.vertices[0].fromArray(hand.right.thumb.positions[4]);
    rightThumbPointerLine.geometry.vertices[1].fromArray(hand.right.thumb.positions[3]);
    rightThumbPointerLine.geometry.verticesNeedUpdate = true;

    rightIndexPointerLine.geometry.vertices[0].fromArray(hand.right.indexFinger.positions[4]);
    rightIndexPointerLine.geometry.vertices[1].fromArray(hand.right.indexFinger.positions[3]);
    rightIndexPointerLine.geometry.verticesNeedUpdate = true;

    rightMiddlePointerLine.geometry.vertices[0].fromArray(hand.right.middleFinger.positions[4]);
    rightMiddlePointerLine.geometry.vertices[1].fromArray(hand.right.middleFinger.positions[3]);
    rightMiddlePointerLine.geometry.verticesNeedUpdate = true;

    rightRingPointerLine.geometry.vertices[0].fromArray(hand.right.ringFinger.positions[4]);
    rightRingPointerLine.geometry.vertices[1].fromArray(hand.right.ringFinger.positions[3]);
    rightRingPointerLine.geometry.verticesNeedUpdate = true;

    rightPinkyPointerLine.geometry.vertices[0].fromArray(hand.right.pinky.positions[4]);
    rightPinkyPointerLine.geometry.vertices[1].fromArray(hand.right.pinky.positions[3]);
    rightPinkyPointerLine.geometry.verticesNeedUpdate = true;
  }



  if (!leftIndexPointerLine){
    leftThumbPointerLine = Geometry.pointerLine();
    leftIndexPointerLine = Geometry.pointerLine();
    leftMiddlePointerLine = Geometry.pointerLine();
    leftRingPointerLine = Geometry.pointerLine();
    leftPinkyPointerLine = Geometry.pointerLine();
    scene.add(leftThumbPointerLine, leftIndexPointerLine, leftMiddlePointerLine, leftRingPointerLine, leftPinkyPointerLine);
  }

  if(hand.left){
    leftThumbPointerLine.geometry.vertices[0].fromArray(hand.left.thumb.positions[4]);
    leftThumbPointerLine.geometry.vertices[1].fromArray(hand.left.thumb.positions[3]);
    leftThumbPointerLine.geometry.verticesNeedUpdate = true;

    leftIndexPointerLine.geometry.vertices[0].fromArray(hand.left.indexFinger.positions[4]);
    leftIndexPointerLine.geometry.vertices[1].fromArray(hand.left.indexFinger.positions[3]);
    leftIndexPointerLine.geometry.verticesNeedUpdate = true;

    leftMiddlePointerLine.geometry.vertices[0].fromArray(hand.left.middleFinger.positions[4]);
    leftMiddlePointerLine.geometry.vertices[1].fromArray(hand.left.middleFinger.positions[3]);
    leftMiddlePointerLine.geometry.verticesNeedUpdate = true;

    leftRingPointerLine.geometry.vertices[0].fromArray(hand.left.ringFinger.positions[4]);
    leftRingPointerLine.geometry.vertices[1].fromArray(hand.left.ringFinger.positions[3]);
    leftRingPointerLine.geometry.verticesNeedUpdate = true;

    leftPinkyPointerLine.geometry.vertices[0].fromArray(hand.left.pinky.positions[4]);
    leftPinkyPointerLine.geometry.vertices[1].fromArray(hand.left.pinky.positions[3]);
    leftPinkyPointerLine.geometry.verticesNeedUpdate = true;

  }
}

function updateIndexFingerSphere (){
  if (!rightIndexFingerSphere){
    rightIndexFingerSphere = Geometry.sphere(1, 0x00ff00);
    scene.add(rightIndexFingerSphere);
  }
  if (hand.right){
      rightIndexFingerSphere.position.fromArray(hand.right.indexFinger.positions[4]);
  }
}


function arrToVector3(arr){
  return new THREE.Vector3(arr[0], arr[1], arr[2]);
}





//******MOVE OUT *********//
function projectile(scene){
  var sphere = Geometry.sphere(5, 0xadadff);
  scene.add(sphere);
  sphere.position.set(0,400,0);

  var start = sphere.position.clone(); // Will be modified
  var end = new THREE.Vector3();
  return fromTo(sphere, end, null, null, function (obj){
      sphere.visible=false;
      console.log(obj);
      // if (reset){
      //   obj.position.set(start.x, start.y, start.z);
      // }
    });
}

function fromTo(obj, end, start, time, resetFn, startFn){
  time = time || 2;
  startFn = startFn || function (){obj.visible = true;};
  resetFn = resetFn || function (){obj.visible = false;};
  start = start || obj.position.clone();
  tween = new TWEEN.Tween(start.clone());
  tween
    .to(end, 2000)
    .onStart(startFn)
    .easing(TWEEN.Easing.Cubic.In)
    .onUpdate(function (val){
      obj.position.set((1-val) * start.x, (1-val) * start.y, (1-val) * start.z);
    })
    .onComplete(resetFn);
  return tween;
}







function setupRings (positionArr, scene){
  positionArr.forEach(function (v3){
    var torus = Geometry.torus();
    torus.position.set(v3.x, v3.y, v3.z);
    scene.add(torus);
  });
}

