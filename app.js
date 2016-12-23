var camera, scene, renderer, container;
var sceneCube, cameraCube;
var group, texture;
var hemisphereLight, shadowLight;
var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

var loader = new THREE.TextureLoader();

function createScene(){

    container = document.getElementById('container');
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x3399ff);

    scene = new THREE.Scene();

    group = new THREE.Group();
    group.position.y = 0
    scene.add(group);

    // CAMERAS
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );

    camera.position.x = 0;
    camera.position.z = 20;
    camera.position.y = 0;
    container.appendChild(renderer.domElement)

    window.addEventListener('resize', handleWindowResize, false);
}

var createPlane = function() {
    // PLANES where iframes will be
    var planeGeo = new THREE.PlaneGeometry(10, 10);
    var planeMaterial = new THREE.MeshNormalMaterial();
    planeMaterial.side = THREE.DoubleSide;
    var wireframeMaterial = new THREE.MeshBasicMaterial();
    wireframeMaterial.wireframe = true;

    var mesh = THREE.SceneUtils.createMultiMaterialObject(planeGeo, [planeMaterial, wireframeMaterial])
    scene.add(mesh)
}



// CUBE

var Cube = function() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "Matt's Cube - Cubie"
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.mesh.add(cube)
}
var mattsCube
function createCube() {
    mattsCube = new Cube();
    mattsCube.mesh.scale.set(1,1,1);
    mattsCube.mesh.position.y = 0;
    scene.add( mattsCube.mesh );
}
function updateCube(){
    mattsCube.mesh.rotation.x += 0.1;
    mattsCube.mesh.rotation.y += 0.1;
}




// TRIANGLE

var triangleShape
function createTriangle() {
    triangleShape = new THREE.Shape();
    triangleShape.moveTo(  80, 20 );
    triangleShape.lineTo(  40, 80 );
    triangleShape.lineTo( 120, 80 );
    triangleShape.lineTo(  80, 20 ); // close path

    addShape( triangleShape, extrudeSettings, 0x8080f0, 5, 0, 0, 0, 0, 0, 1 );
}

function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    // flat shape with texture
    loader.load( "img/UV_Grid_Sm.jpg", function(texture){
        var geometry = new THREE.ShapeGeometry( shape );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) );
        mesh.position.set( x, y, z - 175 );
        mesh.rotation.set( rx, ry, rz );
        mesh.scale.set( s, s, s );
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 0.008, 0.008 );
        group.add( mesh );

    });
}

function createLights(){
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

init()
function init(){
    createScene();
    createLights();
    createCube();
    createTriangle()
    render();
}

function render(){
    updateCube();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
