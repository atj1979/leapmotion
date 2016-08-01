var THREE = require("three");
module.exports = {
  tipsTogether:tipsTogether,
  thumbIndexTogether:thumbIndexTogether


};




function tipsTogether (leapHand, distanceAllowed){
  if (!leapHand || !leapHand.fingers){
    return;
  }
  distanceAllowed = distanceAllowed || 2;
    
  var fingers = leapHand.fingers.map(function (finger){
    return new THREE.Vector3().fromArray(finger.tipPosition);
  });
  var maximumDistance = fingers.reduce(function (maxDistance, fingerP, i, arr){
    if (maxDistance === 0 || !arr[i+1]){
      return maxDistance;
    }
    var distance = fingerP.distanceTo(arr[i+1]);
    return distance > maxDistance ? distance : maxDistance; 
  }, 0);
  console.log(maximumDistance);
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