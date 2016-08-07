
var THREE = require("three");

module.exports = {
  load:load,
};

function load(filePath, scene, callback){

  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load( './models/collada/monster/monster.dae', function ( collada ) {

    dae = collada.scene;

    dae.traverse( function ( child ) {
      if ( child instanceof THREE.SkinnedMesh ) {
        var animation = new THREE.Animation( child, child.geometry.animation );
        animation.play();
      }
    });

    dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
    dae.updateMatrix();

    if (callback){
      callback.call(this, dae);
    }
  });
  
}


