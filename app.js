var camera, scene, renderer, container;
var controls;
var group, planeGroup, texture;
var hemisphereLight, shadowLight;

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

    // CAMERAS
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 0.5;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );

    camera.position.x = 0;
    camera.position.z = 100;
    camera.position.y = 0;
    container.appendChild(renderer.domElement)

    window.addEventListener('resize', handleWindowResize, false);

    // dat.GUI & controls

    controls = new function(){
        this.positionX = 0;
        this.positionY = 0

        this.nodeRotationY = 0.02
    }

    var gui = new dat.GUI();
    gui.add(controls, 'positionX', -20, 20)
    gui.add(controls, 'positionY', -20, 20)
    gui.add(controls, 'nodeRotationY', 0.01, 0.09)
}

function createPlane(x,y) {
    // PLANES where iframes will be
    var planeGeo = new THREE.PlaneGeometry(10, 10);
    var planeMaterial = new THREE.MeshNormalMaterial();
    planeMaterial.side = THREE.DoubleSide;
    var wireframeMaterial = new THREE.MeshBasicMaterial();
    wireframeMaterial.wireframe = true;

    var mesh = THREE.SceneUtils.createMultiMaterialObject(planeGeo, [planeMaterial, wireframeMaterial])
    mesh.position.set(x,y,0)

    planeGroup.add(mesh)
    // scene.add(mesh)
}

function createPlaneGroup(){
    planeGroup = new THREE.Group();

    createPlane(0, -20)
    createPlane(0, 0)
    createPlane(0, 20)
    createPlane(-20, -20)
    createPlane(-20, 0)
    createPlane(-20, 20)
    createPlane(20, -20)
    createPlane(20, 0)
    createPlane(20, 20)

    scene.add(planeGroup);
}
init()
function init(){
    createScene();
    createPlaneGroup()
    // createLights();
    // createFrames();

    render();
}

function render(){
    renderer.render(scene, camera);

    scene.position.x = controls.positionX
    scene.position.y = controls.positionY

    scene.traverse(function(node){
        if ( node instanceof THREE.Mesh){
            node.rotation.y += controls.nodeRotationY
        }
    })

    // planeGroup.rotation.x += 0.1

    requestAnimationFrame(render);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

// function createFrames(){
//     var x = -20;
//     var y = 0;
//     for(var i = 0; i < 12; i++) {
//         console.log("i is "+ i);
//         if(x === 40){
//             console.log(y);
//             x = -20;
//             y -= 20;
//             createPlane(x, y , 0);
//         } else {
//             createPlane(x, y , 0);
//         }
//         x += 20
//     }
// }
