var camera, scene, renderer, container;
var datControls, controls;
var group, planeGroup, texture, youtube;
var textMesh, textMesh2, textPivot, textMesh3, contactButton, contactPivot;
var torusMesh, arrowMesh, buttonPivot, theTarget, runClickTweens;

var mouse = { x: 0, y: 0 }, INTERSECTED

var loader = new THREE.TextureLoader()
var clock = new THREE.Clock()
var YoutubePlane = function (id, x, y, z, ry) {
    var element = document.createElement('div')
    var width = '500px'
    var height = '400px'

    element.style.width = width;
    element.style.height = height;
    element.style.backgroundColor = '#ffffff'
    element.className = 'three-div'

    var iframe = document.createElement('iframe')
    iframe.style.width = width
    iframe.style.height = height
    iframe.style.border = '0px'
    iframe.src = ['http://www.youtube.com/embed/', id, '?rel=0'].join('')
    element.appendChild(iframe)

    var div = new THREE.CSS3DObject(element)
    div.position.set(x, y, z)
    div.rotation.y = ry
    div.name = "youtube"

    return div;
}
var ContactButton = function () {
    var element = document.createElement('div')
    var width = '500px'
    var height = '150px'

    element.style.width = width;
    element.style.height = height;
    element.style.backgroundColor = '#FF6900'
    element.className = 'contact-button'
    element.innerHTML = '<a href="mailto:mattfewerbiz@gmail.com">Email me!</a>';

    var div = new THREE.CSS3DObject(element)
    div.position.set(0,-330,0)
    div.name = "contactButton"

    return div;
}
function render(){
    // scene.position.x = datControls.positionX
    // scene.position.y = datControls.positionY
    //
    // scene.traverse(function(node){
    //     if (node.name === "textPivot"){
    //         node.position.x = datControls.textPivotPosX
    //         node.position.y = datControls.textPivotPosY
    //         node.position.z = datControls.textPivotPosZ
    //     }
    // })
    // if(runClickTweens === true){
    //     runTweens()
    // }

    requestAnimationFrame(render);
    buttonPivot.rotation.y += 0.1
    TWEEN.update()
    renderer.render(scene, camera);
    renderer2.render(scene2, camera);
    var delta = clock.getDelta()
    controls.update(delta)
}

init()
function init(){
    createScene();
    createText();
    createPlaneGroup();
    createTorus();
    createLights();
    render();
}

function createScene(){

    container = document.getElementById('container');
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // RENDERER #1

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.zIndex = 1000;

    container.appendChild(renderer.domElement)

    // RENDERER #2 - CSS3D

    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    container.appendChild(renderer2.domElement);

    scene2 = new THREE.Scene();
    scene = new THREE.Scene();

    youtube = new YoutubePlane('kJvrgyHXrMo', 0, -250, 0, 0) // The Monster
    youtube.scale.set(0.1, 0.1, 0.1)
    scene2.add(youtube)

    contactButton = new ContactButton()
    contactButton.scale.set(0.1, 0.1, 0.1)
    scene2.add(contactButton)

    // CAMERA

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 0.5;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
    camera.target = scene.position.clone();
    camera.position.set(0,-315,100)

    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    // SKYBOX

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

    /*
    // TRACKBALL CONTROLS

    trackballControls = new THREE.TrackballControls(camera)
    trackballControls.rotateSpeed = 0.2
    trackballControls.zoomSpeed = 0.3
    trackballControls.panSpeed = 0.3

    trackballControls.noRotate = false;
    trackballControls.noZoom = false;
    trackballControlsMoving = true;
    */

    // FLYCONTROLS

    controls = new THREE.FlyControls(camera)
    controls.movementSpeed = 35;
    controls.domElement = container
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    // DAT.GUI
    // =============================================

    datControls = new function(){
        this.positionX = 0
        this.positionY = 0

        this.textPivotPosX = -65
        this.textPivotPosY = 5
        this.textPivotPosZ = 0
    }

    // var gui = new dat.GUI();
    // gui.add(datControls, 'positionX', -20, 20)
    // gui.add(datControls, 'positionY', -20, 20)
    //
    // var f1 = gui.addFolder('text')
    // f1.add(datControls, 'textPivotPosX', -600, 600)
    // f1.add(datControls, 'textPivotPosY', -600, 600)
    // f1.add(datControls, 'textPivotPosZ', -600, 600)
    // f1.open()

}

// =============================================

function createText(){

    textPivot = new THREE.Object3D();
    textPivot.name = "textPivot"
    textPivot.position.set(-65 ,5 ,0)

    contactPivot = new THREE.Object3D();
    contactPivot.name = "contactPivot"
    contactPivot.position.set(0 ,-300 ,0)

    console.log(contactPivot);

    var loader = new THREE.FontLoader();
    var textMaterial = new THREE.MeshPhongMaterial( {
        specular: 0x53167d,
        color: 0x53167d,
        shininess: 100
    } );

    var options = {
        // font: font,
        size: 10,
        height: 1,
        curveSegments: 15,
        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true,
        bevelSegments: 15
    }

    loader.load( '/fonts/optimer_regular.typeface.json', function ( font ) {
        options.font = font;

        // FIRST LINE

        var textGeo = new THREE.TextGeometry( "Hello! I'm Matt Fewer.", options);
        textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.set( 0,0,0 );
        textMesh.name = "first_line"
        textMesh.receiveShadow = true
        textPivot.add(textMesh)

        // SECOND LINE

        textGeo = new THREE.TextGeometry( "I like to build websites.", options);

        textMesh2 = new THREE.Mesh( textGeo, textMaterial );
        textMesh2.position.set( 0,-30,0 );
        textMesh2.name = "second_line"
        textMesh2.receiveShadow = true
        textPivot.add(textMesh2)

        scene.add(textPivot)
    } );

    loader.load( '/fonts/optimer_regular.typeface.json', function ( font ) {
        options.font = font;

        // THIRD LINE

        textGeo = new THREE.TextGeometry( "Let's talk!", options);

        textMesh3 = new THREE.Mesh( textGeo, textMaterial );
        // textMesh3.position.set( -28,-320,0 );
        textMesh3.position.set( 0,0,0 );

        textMesh3.name = "third_line"
        textMesh3.receiveShadow = true

        contactPivot.add(textMesh3)

        scene.add(contactPivot)
        // scene.add(textMesh3)
    })

};
function createTorus(){

    buttonPivot = new THREE.Object3D();
    buttonPivot.name = "buttonPivot"
    buttonPivot.position.set(0, -30, 0)

    // ARROW

    var baseHeight = -4, baseWidth = 3;

    var shape = new THREE.Shape();

    shape.moveTo( 0,0 );
    shape.lineTo( baseWidth, 0 );
    shape.lineTo( baseWidth, baseHeight );
    shape.lineTo( baseWidth + 3, baseHeight );
    shape.lineTo( baseWidth / 2, baseHeight * 2 );
    shape.lineTo( -3, baseHeight );
    shape.lineTo( 0, baseHeight );
    shape.lineTo( 0, 0 );

    var extrudeSettings = {
    	steps: 5,
    	amount: 3,
    	bevelEnabled: true,
    	bevelThickness: 1,
    	bevelSize: 1,
    	bevelSegments: 1
    };

    var arrowGeom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var arrowMaterial = new THREE.MeshNormalMaterial();
    arrowMaterial.side = THREE.DoubleSide;
    arrowMesh = new THREE.Mesh( arrowGeom, arrowMaterial );
    arrowMesh.name = "arrowMesh"
    arrowMesh.position.set(-1.5, 3.5, -2)

    // TORUS

    var torusMaterial = new THREE.MeshNormalMaterial();
    torusMaterial.side = THREE.DoubleSide;

    var torusGeom = new THREE.TorusGeometry(10, 2, 4, 6, Math.PI * 2);
    torusMesh = new THREE.Mesh(torusGeom, torusMaterial);
    torusMesh.name = "torusMesh"

    buttonPivot.add(arrowMesh)
    buttonPivot.add(torusMesh)
    scene.add(buttonPivot)
}
function createPlaneGroup(){
    planeGroup = new THREE.Group();

    var startPosY = -60

    createPlane(-25, startPosY - 20, "plane1", "/img/websites/advanced_cosmetic_dentistry.jpg")
    createPlane(0, startPosY - 20, "plane2", "/img/websites/rexmenu.jpg")
    createPlane(25, startPosY - 20, "plane3", "/img/websites/dr_maieve.jpg")

    createPlane(-25, startPosY - 40, "plane3", "/img/websites/dr_alison_black.jpg")
    createPlane(0, startPosY - 40, "plane5", "/img/websites/atlas_vein.jpg")
    createPlane(25, startPosY - 40, "plane6", "/img/websites/galleria.jpg")

    createPlane(-25, startPosY - 60, "plane7", "/img/websites/priest_dental.jpg")
    createPlane(0, startPosY - 60, "plane8", "/img/websites/retinal_san_antonio.jpg")
    createPlane(25, startPosY - 60, "plane9", "/img/websites/schlessinger.jpg")

    createPlane(-25, startPosY - 80, "plane10", "/img/websites/static_home.jpg")
    createPlane(0, startPosY - 80, "plane11", "/img/websites/tsrh_home.jpg")
    createPlane(25, startPosY - 80, "plane12", "/img/websites/urogynecology_center.jpg")

    createPlane(-25, startPosY - 100, "plane13", "/img/websites/gentle_dental.jpg")
    createPlane(0, startPosY - 100, "plane14", "/img/websites/mcdowell.jpg")
    createPlane(25, startPosY - 100, "plane15", "/img/websites/dental_phobia.jpg")

    createPlane(-25, startPosY - 120, "plane16", "/img/websites/belcor_builders.jpg")
    createPlane(0, startPosY - 120, "plane17", "/img/websites/eye_surgery_center.jpg")
    createPlane(25, startPosY - 120, "plane18", "/img/websites/centerderm.jpg")

    createPlane(-25, startPosY - 140, "plane19", "/img/websites/smiles_4_a_lifetime.jpg")
    createPlane(0, startPosY - 140, "plane20", "/img/websites/tennessee_vein.jpg")
    createPlane(25, startPosY - 140, "plane21", "/img/websites/the_vein_clinic.jpg")

    scene.add(planeGroup);

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
}
function createLights() {
    /*
    // AMBIENT LIGHT

    var ambiColor = "#ffffff"
    var ambientLight = new THREE.AmbientLight(ambiColor, 1)
    scene.add(ambientLight)
    */

    /*
    // POINT LIGHT

    var pointColor = "#ffffff";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.position.set(10,10,10);
    scene.add(pointLight);
    */

    // SPOTLIGHT #1

    var pointColor = "#ffffff";
    var spotLight = new THREE.SpotLight(pointColor);
    spotLight.position.set(0,0,90);
    spotLight.castShadow = true;

    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);
    spotLight.target = target;
    scene.add(spotLight);

    // SPOTLIGHT #2

    spotLight2 = new THREE.SpotLight(pointColor);
    spotLight2.position.set(0,-360,90);
    spotLight2.castShadow = true;

    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, -330, 0);
    spotLight2.target = target;
    scene.add(spotLight2);
}

function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children, true);


    // PLANE FLIP TWEEN
    // =============================================

    var targetPosition, currentPosition;
    if (intersects.length > 0 && intersects[0].object.name.substring(0,5) === "plane") {

        // TWEENBACK

        if (intersects[0].object.rotation.y > 0){

            currentPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 360
            }

            var tweenBack = new TWEEN.Tween(currentPosition).to(firstPosition, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate( function () {
                    intersects[0].object.rotation.y = (currentPosition.rot * Math.PI)/180
                    intersects[0].object.position.x = currentPosition.x
                    intersects[0].object.position.y = currentPosition.y
                    intersects[0].object.position.z = currentPosition.z
                })
                .onComplete( function() {
                    youtube.scale.set(0.1,0.1,0.1)
                })
            tweenBack.start()

        // TWEEN

        } else {
            firstPosition = {
                x: intersects[0].object.position.x,
                y: intersects[0].object.position.y,
                z: intersects[0].object.position.z,
                rot: 0
            }
            camCurrentPosition = {
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

            var tween = new TWEEN.Tween(camCurrentPosition).to(targetPosition, 2000)
                .easing(TWEEN.Easing.Exponential.Out)
                .onStart(function() {
                    console.log(targetPosition);
                    console.log(camCurrentPosition);
                })
                .onUpdate( function () {
                    youtube.scale.set(0,0,0);
                    intersects[0].object.rotation.y = (camCurrentPosition.rot * Math.PI)/180
                    intersects[0].object.position.x = camCurrentPosition.x
                    intersects[0].object.position.y = camCurrentPosition.y
                    intersects[0].object.position.z = camCurrentPosition.z
                }).start();
        }

    } else if (intersects.length > 0 && ( intersects[0].object.name === "torusMesh" || intersects[0].object.name === "arrowMesh" )) {
        runClickTweens = true
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

function runTweens(){
    var theTarget = new THREE.Object3D();
    theTarget.name = "theTarget"
    theTarget.position.set(0,0,0)
    camera.target = theTarget
    camera.updateProjectionMatrix();

    var tween1 = new TWEEN.Tween(camera.position).to({
        y: -140}, 5000)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(function () {
            trackballControls.target.set(theTarget.position);
        }).start();

    var tween2 = new TWEEN.Tween(trackballControls.target).to({
        y: -140}, 5000)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(function () {
            trackballControls.target.set(theTarget.position);
        })
        .onComplete(function () {
            trackballControls.reset()
        //     runClickTweens = false
        }).start();
}
