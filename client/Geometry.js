var THREE = require("three");
var TWEEN = require("tween");

module.exports = {
  sphere:sphere,
  pointerLine:pointerLine,
  torus:torus,
  arrow:arrow,
  loadGoats:loadGoats,
  clock:clock

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

function arrow(scene, scale, dir){
  scale = scale || 0.01;
  var direction = dir ? -1: 1; 
  var shapeArr = [
    new THREE.Vector3(0,40 * direction,0),
    new THREE.Vector3(15,20 * direction,0),
    new THREE.Vector3(5,20 * direction,0),
    new THREE.Vector3(5,0 * direction,0),
    new THREE.Vector3(-5,0 * direction,0),
    new THREE.Vector3(-5,20 * direction,0),
    new THREE.Vector3(-15,20 * direction,0)
  ];

  // shapeArr.forEach(function(point){
  //   var sph = sphere(2, "green");
  //   sph.position.copy(point);
  //   scene.add(sph);
  // });

  var shape = new THREE.Shape(shapeArr);
  var color = new THREE.Color(Math.random()* 150 + 50,0,0);
  var material = new THREE.MeshPhongMaterial({
    color: color,
  });

  var options = {
    steps:1,
    amount:1
  };

  var geo = new THREE.ExtrudeGeometry(shape, options);
  var mesh = new THREE.Mesh(geo, material );

  scene.add(mesh);
  return mesh;
}

function loadGoats (scene, callback){
  var assets =[];
  for(var i = 1; i < 10; i++){
    assets.push("downgoat" + i + ".jpg");
    assets.push("upgoat" + i + ".jpg");
  }
  var prefix = "./assets/goats/";

  assets.forEach(function (url){
    // instantiate a loader
    var loader = new THREE.TextureLoader();

    // load a resource
    loader.load(
      // resource URL
      prefix +url,
      // Function when resource is loaded
      function ( texture ) {
        // do something with the texture
        var material = new THREE.MeshBasicMaterial( {
          map: texture
        });
        var geo = new THREE.BoxGeometry(100,100,10);
        var mesh = new THREE.Mesh(geo,material);
        mesh.visible = true;
        mesh.name = "goats";
        scene.add(mesh);

        if (callback){
          callback.call(this, mesh);
        }
      },
      // Function called when download progresses
      function ( xhr ) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      // Function called when download errors
      function ( xhr ) {
        console.log( 'An error happened' );
      }
    );
  });
}


function clock (scene){
  return;
  var textGeos = [];
  var params = {
    font: new THREE.Font(),
    size : 1, 
    height : 1,
    bevelEnabled : false
  };
  for (var i =0 ; i <= 9; i++){
    textGeos.push(THREE.TextGeometry(i, params));
  }

  var mat = new THREE.MeshPhongMaterial({
    color:new THREE.Color(0,30,180)
  });

  var time1 = textGeos.map(function (num){ return new THREE.Mesh(num.clone(), mat.clone());});
  var time2 = textGeos.map(function (num){ return new THREE.Mesh(num.clone(), mat.clone());});
  var time3 = textGeos.map(function (num){ return new THREE.Mesh(num.clone(), mat.clone());});

  var space = 300;

  time1.forEach(function (mesh){
    var x = Math.random()* space + 2*space;
    var y = Math.random()* space + 2*space;
    var z = Math.random()* space + 2*space;
    mesh.position.set(x,y,z);
    scene.add(mesh);
  });

  time2.forEach(function (mesh){
    var x = Math.random()* space + 2*space;
    var y = Math.random()* space + 2*space;
    var z = Math.random()* space + 2*space;
    mesh.position.set(x,y,z);
    scene.add(mesh);
  });

  time3.forEach(function (mesh){
    var x = Math.random()* space + 2*space;
    var y = Math.random()* space + 2*space;
    var z = Math.random()* space + 2*space;
    mesh.position.set(x,y,z);
    scene.add(mesh);
  });
}