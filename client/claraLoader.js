var THREE = require("three");

module.exports = {
  load:load,
};

function load (filePath, scene, callback){
  // BEGIN Clara.io JSON loader code
  var objectLoader = new THREE.ObjectLoader();
  objectLoader.load(filePath, function ( obj ) {
    var group = new THREE.Group();
    if (obj.constructor === THREE.Scene){
      var kids = [];
      obj.children.forEach(function (child){
        kids.push(child);
      });
   

      kids.forEach(function (kid){
        group.add(kid);
      });
    }
    // scene.add(group);
    if (callback){
      callback.call(this, group);
    }
    return group;
  }, progress, errors);
  // END Clara.io JSON loader code
}



function progress(){}
function errors(val){
  console.log(val);
}