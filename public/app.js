var camera, scene, renderer, container;
var controls;
var group, planeGroup, texture;
var hemisphereLight, shadowLight;
var planeRotation = 0;

var mouse = { x: 0, y: 0 }, INTERSECTED;

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
    document.addEventListener('mousedown', onDocumentMouseDown, false);

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

function createPlane(x,y,name,img_path) {
    // PLANES where iframes will be
    var planeGeo = new THREE.PlaneGeometry(20, 10);
    var planeMaterial = new THREE.MeshNormalMaterial();
    planeMaterial.side = THREE.DoubleSide;

    // var wireframeMaterial = new THREE.MeshBasicMaterial({});
    // wireframeMaterial.wireframe = true;

    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(img_path, function(texture){})
    });

    material.side = THREE.DoubleSide

    // var mesh = THREE.SceneUtils.createMultiMaterialObject(planeGeo, [planeMaterial, material])
    var mesh = new THREE.Mesh(planeGeo, material)
    mesh.name = name
    mesh.position.set(x,y,0)

    scene.add(mesh)
    planeGroup.add(mesh)
}

function createPlaneGroup(){
    planeGroup = new THREE.Group();

    createPlane(-25, -20, "plane1", "./img/websites/dralisonblack.png")
    createPlane(-25, 0, "plane2", "./img/websites/galleria.png")
    createPlane(-25, 20, "plane3", "./img/websites/gentledental.png")
    createPlane(0, -20, "plane4", "./img/websites/mcdowell.png")
    createPlane(0, 0, "plane5", "./img/websites/rexmenu.png")
    createPlane(0, 20, "plane6", "./img/websites/static_home.png")
    createPlane(25, -20, "plane7", "./img/websites/tsrh_home.png")
    createPlane(25, 0, "plane8", "./img/websites/dralisonblack.png")
    createPlane(25, 20, "plane9", "./img/websites/dralisonblack.png")

    scene.add(planeGroup);
}
init()
function init(){
    createScene();
    createPlaneGroup();
    // createLights();
    render();
}

function render(){
    renderer.render(scene, camera);

    scene.position.x = controls.positionX
    scene.position.y = controls.positionY

    scene.traverse(function(node){
        if ( node instanceof THREE.Mesh){
            if (node.rotation.y > 0){
                node.rotation.y += 0.1
            }
            // node.rotation.y += controls.nodeRotationY
        }
    })
    requestAnimationFrame(render);
}

function onDocumentMouseDown(event) {

    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        console.log(intersects[0]);
        intersects[0].object.rotation.y += 0.1
        intersects[1].object.rotation.y += 0.1
    }
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
function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
