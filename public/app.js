var camera, scene, renderer, container;
var controls, trackballControls;
var group, planeGroup, texture;
var hemisphereLight, shadowLight;
var textMesh;
var planeRotation = 0;

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

    renderer.setClearColor(0x3399ff);

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
    trackballControls.zoomSpeed = 0.5
    trackballControls.panSpeed = 0.9

    trackballControls.noRotate = false;
    trackballControls.noZoom = false;
    trackballControls.staticMoving = true;


    // DAT.GUI
    // =============================================

    controls = new function(){
        this.positionX = 0
        this.positionY = 0
        this.nodeRotationY = 0.02
        this.text_position_x = -350
    }

    var gui = new dat.GUI();
    gui.add(controls, 'positionX', -20, 20)
    gui.add(controls, 'positionY', -20, 20)
    gui.add(controls, 'nodeRotationY', 0.01, 0.09)
    gui.add(controls, 'text_position_x', -600, 600)
}

// RENDER
// =============================================

function render(){
    scene.position.x = controls.positionX
    scene.position.y = controls.positionY

    scene.traverse(function(node){
        if ( node instanceof THREE.Mesh && node.name != "textMesh"){
            if (node.rotation.y > 0){
                // node.rotation.y += 0.1
            }
        } else if (node.name === "textMesh"){
            node.position.x = controls.text_position_x
        }
    })

    var delta = clock.getDelta()
    trackballControls.update(delta)
    TWEEN.update()

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

init()
function init(){
    createScene();
    createText();
    createLights();
    createPlaneGroup();
    render();
}


// =============================================

function createText(){
    var loader = new THREE.FontLoader();
    var textMeshRef = textMesh

    loader.load( './fonts/helvetiker_bold.typeface.json', function ( font ) {

        var textGeo = new THREE.TextGeometry( "Matt Fewer", {
            font: font,
            size: 100,
            height: 20,
            curveSegments: 1,
            bevelThickness: 3,
            bevelSize: 5,
            bevelEnabled: true,
            bevelSegments: 3
        } );

        var textMaterial = new THREE.MeshPhongMaterial( {
            specular: 0xffffff,
            color: 0xeeffff,
            shininess: 100
        } );

        textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.set( 0,200,-500 );
        textMesh.name = "textMesh"
        textMesh.receiveShadow = true

        scene.add( textMesh );
    } );
};

function createPlane(x,y,name,img_path) {

    var planeGeo = new THREE.PlaneGeometry(20, 10);
    var planeMaterial = new THREE.MeshNormalMaterial();
    planeMaterial.side = THREE.DoubleSide;

    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(img_path, function(texture){})
    });
    material.side = THREE.DoubleSide

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


function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children, true);

    var targetPosition, currentPosition;
    if (intersects.length > 0 && intersects[0].object.name != "textMesh") {

        // TWEENBACK
        // =============================================

        if (intersects[0].object.rotation.y > 0){

            currentPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 180
            }
            console.log(currentPosition);

            var tweenBack = new TWEEN.Tween(currentPosition).to(firstPosition, 1000)
                .easing(TWEEN.Easing.Exponential.Out).onUpdate( function () {
                    intersects[0].object.rotation.y = (currentPosition.rot * Math.PI)/180
                    intersects[0].object.position.x = currentPosition.x
                    intersects[0].object.position.y = currentPosition.y
                    intersects[0].object.position.z = currentPosition.z
                })
            tweenBack.start()

        // TWEEN
        // =============================================

        } else {
            firstPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 0
            }
            currentPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 0
            }
            targetPosition = {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z - 20,
                rot: camera.rotation._y + 180
            }

            var tween = new TWEEN.Tween(currentPosition).to(targetPosition, 2000)
                .easing(TWEEN.Easing.Exponential.Out).onUpdate( function () {
                    intersects[0].object.rotation.y = (currentPosition.rot * Math.PI)/180
                    intersects[0].object.position.x = currentPosition.x
                    intersects[0].object.position.y = currentPosition.y
                    intersects[0].object.position.z = currentPosition.z
                })
            tween.start()
        }
    }
}

function createLights() {
    // AMBIENT LIGHT

    var ambiColor = "#ffffff"
    var ambientLight = new THREE.AmbientLight(ambiColor, 1)
    // scene.add(ambientLight)

    // POINT LIGHT

    var pointColor = "#ffffff";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.position.set(10,10,10);
    scene.add(pointLight);

}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
