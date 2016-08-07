var THREE = require("three");
var TWEEN = require("tween");


module.exports = {
  theGoats:theGoats,

};



function theGoats (goat){
  var time =Date.now();
  goat.lookat(new THREE.Vector3());

}