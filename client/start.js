
var $ = require("jquery");
var _ = require("lodash");
var Leap = require("leapjs");
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var TweenMax = require("gsap");
var TWEEN = require("tween");
window.TWEEN = TWEEN;

var gestures = require("./gestures");
var Geometry = require("./Geometry");

var camera, scene, renderer, controls, tween, container, light, leapController;
var hand = {};
var fingerLineGroups = [];
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
  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set(0, 200, 400);

  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x404040 ) );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  // var cameraHelper = new THREE.CameraHelper(camera);
  // scene.add(cameraHelper);

  var gridHelper = new THREE.GridHelper(100, 5);
  scene.add(gridHelper);

  controls = new OrbitControls( camera);
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
  };

  window.THREE = THREE;

  gameSetup(scene);
  // slowSphere(scene);
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
  updatePointerLine(scene);
  if ( gestures.indexPinkyTouch(hand) ){
    lmp.sphereGun.reload();
    console.log("reload");
  }
  if ( gestures.tipsTogether(hand.left)){
    if (!hand.right){
      return;
    }
    
    //Figure out the Vector the index finger is pointing
    var indS = new THREE.Vector3().fromArray(hand.right.fingers[1].positions[4]);
    var indE = new THREE.Vector3().fromArray(hand.right.fingers[1].positions[3]);
    var newEnd = indS.clone().sub(indE).setLength(1000).add(indE);
    lmp.sphereGun.fire(newEnd.clone(), indS.clone());
    

    // // Pointer on index finger for helping
    // if (!window.thing){
    //   window.thing = Geometry.pointerLine();
    //   scene.add(window.thing);
    // } else {
    //   window.thing.visible=true;
    //   window.thing.geometry.vertices[0].copy(newEnd);
    //   window.thing.geometry.vertices[1].copy(indS);
    //   window.thing.geometry.verticesNeedUpdate = true;
    // }

  };
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

function updatePointerLine(scene){
  if (!hand || !hand.right || !hand.left){
    return;
  }
  var rFingersJoints = hand.right.fingers.map(function(finger){
    return finger.positions;
  });
  var lFingersJoints = hand.left.fingers.map(function(finger){
    return finger.positions;
  });

  var allJoints = _.concat(rFingersJoints, lFingersJoints);
  if (allJoints.length !== fingerLineGroups.length){
    fingerLineGroups.forEach(function(lineGroup){
      lineGroup.forEach(function(line){
        recursiveRemove(line);
      })
    });
    fingerLineGroups=[];

    allJoints.forEach(function (jointGroup){
      var group = [];
      jointGroup.forEach(function (joint, i, jointArr){
        if (jointArr[i+2]){
          var line = Geometry.pointerLine([jointArr[i+2], jointArr[i+1]]);
          scene.add(line);
          group.push(line);
        }
      });
      fingerLineGroups.push(group);
    });
  } else {
    allJoints.forEach(function (jointGroup, i){
      var lines = fingerLineGroups[i];
      jointGroup.forEach(function (joint, i, jointArr){
        if (jointArr[i+2]){
          var line = lines[i];
          line.geometry.vertices[0].fromArray(jointArr[i+1]);
          line.geometry.vertices[1].fromArray(jointArr[i+2]);
          line.geometry.verticesNeedUpdate = true;
        }
      });
    });
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

// function fromTo(obj, end, start, time, resetFn, startFn){
//   time = time || 2000;
//   startFn = startFn || function (){obj.visible = true;};
//   resetFn = resetFn || function (){obj.visible = false;};
//   start = start || obj.position.clone();
//   end  = end || new THREE.Vector3();
//   tween = new TWEEN.Tween(start.clone());

//   tween
//     .to(end, time)
//     .onStart(startFn)
//     // .easing(TWEEN.Easing.Cubic.In)
//     .onUpdate(function (val){
//       obj.position.set((1-val) * start.x, (1-val) * start.y, (1-val) * start.z);
//       console.log(obj.position);
//     })
//     .onComplete(resetFn);
//   return {tween:tween, obj:obj};
// }







function setupRings (positionArr, scene){
  positionArr.forEach(function (v3){
    var torus = Geometry.torus();
    torus.position.set(v3.x, v3.y, v3.z);
    scene.add(torus);
  });
}

function makeObjs(num, storage, geo, size){
  storage = storage || [];
  geo = geo || Geometry.sphere; 
  for (var i = 0; i < num; i++){
    storage.push(geo(size));
  }
  return storage;
}

function gameSetup (scene){

  setupRings([new THREE.Vector3(50,50,-200),
    new THREE.Vector3(-50,100,-200),
    new THREE.Vector3(50,150,-200)], 
    scene);

  var ammo = makeObjs(100, null, null, 3);
  lmp.sphereGun = new Gun(scene, ammo);
}

function addAmmoToScene (scene, amm){
    amm.visible = false;
    scene.add(amm);
}

function Gun (scene, ammo){
  this.count = 0;
  this.projectiles = ammo.map(function (obj){
    addAmmoToScene(scene, obj);
    return obj;
  });

  this.fireIn = (function (endV, startV ){
    if (this.count > this.projectiles.length-1){
      return; 
    }
    this.currentProjectile = this.projectiles[this.count];
    var currentProjectile = this.currentProjectile;
    this.currentProjectile.visible = true;
    if (startV){
      this.currentProjectile.position.copy(startV);
    }
    this.currentProjectile.visible = true;
    var currentPosition ={
      x:currentProjectile.position.x,
      y:currentProjectile.position.y,
      z:currentProjectile.position.z
    };
    var endPosition = endV.clone(); 
    var tw = new TWEEN.Tween(currentPosition);
    tw.currentPosition = currentPosition;
    tw.endPosition = endPosition;
    tw.currentProjectile = currentProjectile;
    tw.to(endV.clone(), 4000);
    tw.onUpdate(function (){
      tw.currentProjectile.position.set(tw.currentPosition.x, tw.currentPosition.y, tw.currentPosition.z);
    });
    tw.onComplete(function (){
      tw.currentProjectile.visible = false;
    });
    tw.start();
    this.count++;
  }).bind(this);

  this.fire = _.throttle(this.fireIn, 1000);
  this.reload = function (){
    this.count = 0;
  };
}


function recursiveRemove(child) {
  if (!child) {
    return;
  }
  if (child.parent){
    child.parent.remove(child);
  }
  if (child.children){
    _.each(child.children, function(subchild) {
      recursiveRemove(subchild);
    });
  }
  if (child.geometry) {
    child.geometry.dispose();
  }
  if (child.texture){
    child.texture.dispose();
  }
  if (child.material) {
    if (child.material.map) {
      child.material.map.dispose();
    }
    child.material.dispose();
  }
}

