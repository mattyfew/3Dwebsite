var camera, scene, renderer, container;
var controls, trackballControls;
var group, planeGroup, texture;
var hemisphereLight, shadowLight;
var text1, text2;
var planeRotation = 0;

// testing

var mouse = { x: 0, y: 0 }, INTERSECTED;

var loader = new THREE.TextureLoader();
var clock = new THREE.Clock()

function createScene(){

    container = document.getElementById('container');
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.enabled = true;
    // renderer.setClearColor(0x3399ff);

    scene = new THREE.Scene();

    // CAMERAS
    // =============================================

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


    // SKYBOX
    // =============================================

    // var axes = new THREE.AxisHelper(100);
    // scene.add(axes);

    var imagePrefix = "img/";
    var urls = [
        `space.jpg`,
        `space.jpg`,
        `space.jpg`,
        `space.jpg`,
        `space.jpg`,
        `space.jpg`
    ]
    var skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls)
    scene.background = skyBox


    // TRACKBALL CONTROLS
    // =============================================

    trackballControls = new THREE.TrackballControls(camera)
    trackballControls.rotateSpeed = 0.2
    trackballControls.zoomSpeed = 0.1
    trackballControls.panSpeed = 0.1


    // DAT.GUI
    // =============================================

    controls = new function(){
        this.positionX = 0
        this.positionY = 0
        this.nodeRotationY = 0.02
    }

    var gui = new dat.GUI();
    gui.add(controls, 'positionX', -20, 20)
    gui.add(controls, 'positionY', -20, 20)
    gui.add(controls, 'nodeRotationY', 0.01, 0.09)
}


// CREATE PLANES
// =============================================

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

    createPlane(-25, 20, "plane1", "./img/websites/advanced_cosmetic_dentistry.png")
    createPlane(0, 20, "plane2", "./img/websites/rexmenu.png")
    createPlane(25, 20, "plane3", "./img/websites/dr_maieve.png")

    createPlane(-25, 0, "plane3", "./img/websites/dr_alison_black.png")
    createPlane(0, 0, "plane5", "./img/websites/atlas_vein.png")
    createPlane(25, 0, "plane6", "./img/websites/galleria.png")

    createPlane(-25, -20, "plane7", "./img/websites/priest_dental.png")
    createPlane(0, -20, "plane8", "./img/websites/retinal_san_antonio.png")
    createPlane(25, -20, "plane9", "./img/websites/schlessinger.png")

    createPlane(-25, -40, "plane10", "./img/websites/static_home.png")
    createPlane(0, -40, "plane11", "./img/websites/tsrh_home.png")
    createPlane(25, -40, "plane12", "./img/websites/urogynecology_center.png")

    createPlane(-25, -60, "plane13", "./img/websites/gentle_dental.png")
    createPlane(0, -60, "plane14", "./img/websites/mcdowell.png")
    createPlane(25, -60, "plane15", "./img/websites/dental_phobia.png")

    createPlane(-25, -80, "plane16", "./img/websites/belcor_builders.png")
    createPlane(0, -80, "plane17", "./img/websites/eye_surgery_center.png")
    createPlane(25, -80, "plane18", "./img/websites/centerderm.png")

    createPlane(-25, -100, "plane19", "./img/websites/smiles_4_a_lifetime.png")
    createPlane(0, -100, "plane20", "./img/websites/tennessee_vein.png")
    createPlane(25, -100, "plane21", "./img/websites/the_vein_clinic.png")

    scene.add(planeGroup);
}


// RENDER
// =============================================

function render(){
    scene.position.x = controls.positionX
    scene.position.y = controls.positionY

    scene.traverse(function(node){
        if ( node instanceof THREE.Mesh && node.name != "Matt"){
            if (node.rotation.y > 0){
                node.rotation.y += 0.1
            }
            // node.rotation.y += controls.nodeRotationY
        }
    })

    var delta = clock.getDelta()
    trackballControls.update(delta)
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

init()
function init(){
    createScene();
    createLights();
    createNav();
    createPlaneGroup();
    render();
}


// =============================================

function createNav(){
    // var options = {
    //     size: 90,
    //     height: 90,
    //     weight: 'normal',
    //     font: 'helvetiker',
    //     style: 'normal',
    //     bevelThickness: 2,
    //     bevelSize: 4,
    //     bevelSegments: 3,
    //     bevelEnabled: true,
    //     curveSegments: 12,
    //     steps: 1
    // };
    var loader = new THREE.FontLoader();

    loader.load( './fonts/helvetiker_bold.typeface.js', function ( font ) {

        var textGeo = new THREE.TextGeometry( "Matt Fewer", {
            font: font,
            size: 100,
            height: 50,
            curveSegments: 12,
            bevelThickness: 2,
            bevelSize: 3,
            bevelEnabled: true
        } );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 0,0,-500 );
        mesh.name = "Matt"

        scene.add( mesh );

    } );
};


function onDocumentMouseDown(event) {

    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].object.name != "Matt") {
        console.log(intersects[0]);
        intersects[0].object.rotation.y += 0.1
        // intersects[1].object.rotation.y += 0.1
    }
}

function createLights() {
    var ambiColor = "#ffffff"
    var ambientLight = new THREE.AmbientLight(ambiColor)
    scene.add(ambientLight)
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
