var camera, scene, renderer, container;
var controls, trackballControls;
var group, planeGroup, texture;
var hemisphereLight, shadowLight;
var textMesh, textMesh2, textPivot;
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

    var imagePrefix = "/img/";
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
    trackballControls.zoomSpeed = 0.3
    trackballControls.panSpeed = 0.3

    trackballControls.noRotate = false;
    trackballControls.noZoom = false;
    trackballControlsMoving = true;


    // DAT.GUI
    // =============================================

    controls = new function(){
        this.positionX = 0
        this.positionY = 0

        this.textPivotPosX = -65
        this.textPivotPosY = 5
        this.textPivotPosZ = 0
    }

    var gui = new dat.GUI();
    gui.add(controls, 'positionX', -20, 20)
    gui.add(controls, 'positionY', -20, 20)

    var f1 = gui.addFolder('text')
    f1.add(controls, 'textPivotPosX', -600, 600)
    f1.add(controls, 'textPivotPosY', -600, 600)
    f1.add(controls, 'textPivotPosZ', -600, 600)
    f1.open()
}

// RENDER
// =============================================

function render(){
    scene.position.x = controls.positionX
    scene.position.y = controls.positionY

    scene.traverse(function(node){
        if (node.name === "textPivot"){
            node.position.x = controls.textPivotPosX
            node.position.y = controls.textPivotPosY
            node.position.z = controls.textPivotPosZ
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

    loader.load( '/fonts/optimer_regular.typeface.json', function ( font ) {
        textPivot = new THREE.Object3D();
        textPivot.name = "textPivot"
        textPivot.position.x = -65
        textPivot.position.y = 5
        textPivot.position.z = 0

        var options = {
            font: font,
            size: 10,
            height: 1,
            curveSegments: 15,
            bevelThickness: 1,
            bevelSize: 1,
            bevelEnabled: true,
            bevelSegments: 15
        }

        var textGeo = new THREE.TextGeometry( "Hello! I'm Matt Fewer.", options);

        var textMaterial = new THREE.MeshPhongMaterial( {
            specular: 0x53167d,
            color: 0x53167d,
            shininess: 100
        } );

        textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.set( 0,0,0 );
        textMesh.name = "first_line"
        textMesh.receiveShadow = true

        textPivot.add(textMesh)
        scene.add(textPivot)

        // SECOND LINE
        // =============================================

        textGeo = new THREE.TextGeometry( "I like to build websites.", options);

        textMesh2 = new THREE.Mesh( textGeo, textMaterial );
        textMesh2.position.set( 0,-30,0 );
        textMesh2.name = "second_line"
        textMesh2.receiveShadow = true
        textPivot.add(textMesh2)
    } );
};

function createPlane(x,y,name,img_path) {

    var planeGeo = new THREE.PlaneGeometry(20, 10);

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

    createPlane(-25, -20, "plane1", "/img/websites/advanced_cosmetic_dentistry.jpg")
    createPlane(0, -20, "plane2", "/img/websites/rexmenu.jpg")
    createPlane(25, -20, "plane3", "/img/websites/dr_maieve.jpg")

    createPlane(-25, -40, "plane3", "/img/websites/dr_alison_black.jpg")
    createPlane(0, -40, "plane5", "/img/websites/atlas_vein.jpg")
    createPlane(25, -40, "plane6", "/img/websites/galleria.jpg")

    createPlane(-25, -60, "plane7", "/img/websites/priest_dental.jpg")
    createPlane(0, -60, "plane8", "/img/websites/retinal_san_antonio.jpg")
    createPlane(25, -60, "plane9", "/img/websites/schlessinger.jpg")

    createPlane(-25, -80, "plane10", "/img/websites/static_home.jpg")
    createPlane(0, -80, "plane11", "/img/websites/tsrh_home.jpg")
    createPlane(25, -80, "plane12", "/img/websites/urogynecology_center.jpg")

    createPlane(-25, -100, "plane13", "/img/websites/gentle_dental.jpg")
    createPlane(0, -100, "plane14", "/img/websites/mcdowell.jpg")
    createPlane(25, -100, "plane15", "/img/websites/dental_phobia.jpg")

    createPlane(-25, -120, "plane16", "/img/websites/belcor_builders.jpg")
    createPlane(0, -120, "plane17", "/img/websites/eye_surgery_center.jpg")
    createPlane(25, -120, "plane18", "/img/websites/centerderm.jpg")

    createPlane(-25, -140, "plane19", "/img/websites/smiles_4_a_lifetime.jpg")
    createPlane(0, -140, "plane20", "/img/websites/tennessee_vein.jpg")
    createPlane(25, -140, "plane21", "/img/websites/the_vein_clinic.jpg")

    scene.add(planeGroup);
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

function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children, true);


    // PORTFOLIO PLANE FLIP TWEEN
    // =============================================

    var targetPosition, currentPosition;
    if (intersects.length > 0 && intersects[0].object.name != "second_line" && intersects[0].object.name != "first_line") {


        // TWEENBACK
        // =============================================

        if (intersects[0].object.rotation.y > 0){

            currentPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 360
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
                z: camera.position.z - 10,
                rot: camera.rotation._y + 360
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


    // NAVIGATION
    // =============================================

    } else if (intersects[0].object.name === "navMesh") {
        console.log(intersects[0].object.name + " selected");

        // intersects[0].object.position.x = 180;

        // camera.position.x = -100
    }
}
function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
