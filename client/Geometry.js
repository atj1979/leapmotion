var THREE = require("three");

module.exports = {
  sphere:sphere,
  pointerLine:pointerLine,
  torus:torus
};

function sphere(size, color){
  color = color || 0xdd3333;
  size = size || 5;
  var sph = new THREE.SphereGeometry(size,32,32);
  var material = new THREE.MeshPhongMaterial({
    color:color
  });
  var mesh = new THREE.Mesh(sph,material);
  return mesh;
}

function pointerLine (vertices, color){
  color = color || 0xdd0000;
  var material = new THREE.LineBasicMaterial({
    color: color
  });

  var geometry = new THREE.Geometry();

  geometry.vertices.push(
    new THREE.Vector3( -10, 0, 0 ),
    new THREE.Vector3( 0, 10, 0 )
  );

  var line = new THREE.Line( geometry, material );
  return line;
}

function torus (){
  var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
  var torus = new THREE.Mesh( geometry, material );
  torus.name = "torus";
  return torus;
}