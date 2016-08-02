var THREE = require("three");
module.exports = {
  tipsTogether: tipsTogether,
  thumbIndexTogether: thumbIndexTogether,
  classicGunReady: classicGunReady,
  classicGunFire: classicGunFire,
  indexPinkyTouch:indexPinkyTouch

};




function tipsTogether (leapHand, distanceAllowed){
  if (!leapHand || !leapHand.fingers){
    return;
  }
  distanceAllowed = distanceAllowed || 30;
    
  var fingers = leapHand.fingers.map(function (finger){
    return new THREE.Vector3().fromArray(finger.tipPosition);
  });
  var maximumDistance = fingers.reduce(function (maxDistance, fingerP, i, arr){
    if (!arr[i+1]){
      return maxDistance;
    }
    var distance = fingerP.distanceTo(arr[i+1]);
    return distance > maxDistance ? distance : maxDistance; 
  }, 0);
  return maximumDistance < distanceAllowed;
}

function thumbIndexTogether (leapHand, distanceAllowed){
  if (!leapHand || !leapHand.fingers){
    return;
  }
  var thumbTip = new THREE.Vector3().fromArray(leapHand.indexFinger.tipPosition);
  var indexTip = new THREE.Vector3().fromArray(leapHand.thumb.tipPosition);
  return thumbTip.distanceTo(indexTip) < distanceAllowed;
}

function indexPinkyTouch(leapHands, distanceAllowed){
  distanceAllowed = distanceAllowed || 30;
  if (!leapHands || !leapHands.right || !leapHands.left){
    return;
  }

  var rInd = new THREE.Vector3().fromArray(leapHands.right.indexFinger.tipPosition);
  var rPinky = new THREE.Vector3().fromArray(leapHands.right.pinky.tipPosition);
  var lInd = new THREE.Vector3().fromArray(leapHands.left.indexFinger.tipPosition);
  var lPinky = new THREE.Vector3().fromArray(leapHands.left.pinky.tipPosition);
  // console.log(rInd.distanceTo(lPinky), lInd.distanceTo(rPinky));
  
  if (rInd.distanceTo(lPinky) < distanceAllowed){
    return true;
  }
  if (lInd.distanceTo(rPinky) < distanceAllowed){
    return true;
  }
  return false;
}

function classicGunReady (){}
function classicGunFire (){}