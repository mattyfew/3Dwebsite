var camera, scene, renderer, container;
var datControls, controls;
var group, planeGroup, texture, youtube;
var textMesh, textMesh2, textPivot, textMesh3, contactButton, contactPivot;
var torusMesh, arrowMesh, buttonPivot, theTarget, runClickTweens;
var earthMesh;

var mouse = new THREE.Vector2();
var loader = new THREE.TextureLoader()
var clock = new THREE.Clock()
var fileLoader = new THREE.FileLoader()
var websiteData = {}
var currentPopUp = {}
var targetPosition, popUpCurrentPosition, firstPosition, camCurrentPosition, raycaster;
var tweenActive = false
var divActive = false
// var divActive = false

var YoutubePlane = function (id, x, y, z, ry) {
    let element = document.createElement('div')
    let width = '500px'
    let height = '400px'

    element.style.width = width;
    element.style.height = height;
    element.style.backgroundColor = '#ffffff'
    element.className = 'three-div'

    let iframe = document.createElement('iframe')
    iframe.style.pointerEvents = "none";
    iframe.style.width = width
    iframe.style.height = height
    iframe.style.border = '0px'
    iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('')
    element.appendChild(iframe)

    let div = new THREE.CSS3DObject(element)
    div.position.set(x, y, z)
    div.rotation.y = ry
    div.name = "youtube"

    return div;
}
var ContactButton = function (x,y,z) {
    let element = document.createElement('div')
    let width = '400px'
    let height = '100px'

    // element.style.padding = '0'
    // element.style.backgroundColor = '#131FAD'
    // element.style.borderRadius = 25 + "px"
    element.className = 'contact-button'
    element.innerHTML = '<a href="mailto:mattfewerbiz@gmail.com">👨‍💻 Email me! </a>';

    let div = new THREE.CSS3DObject(element)
    div.position.set(x,y,z)
    div.name = "contactButton"

    return div;
}
var Planet = function(path, name) {
    let geometry   = new THREE.SphereGeometry(20, 32, 32)
    let material  = new THREE.MeshPhongMaterial()
    material.map    = THREE.ImageUtils.loadTexture(path)
    planet = new THREE.Mesh(geometry, material)
    planet.name = name
    planet.position.set(220,-200, -180)

    return planet
}
var myTweens = {
    tweenBack() {
        let tweenBack = new TWEEN.Tween(popUpCurrentPosition).to(firstPosition, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart( function() {
                tweenActive = true
                raycaster.setFromCamera( mouse, camera );
                intersects = raycaster.intersectObjects(scene.children, true);
            })
            .onUpdate( function () {
                currentPopUp.rotation.y = (popUpCurrentPosition.rot * Math.PI)/180
                currentPopUp.position.x = popUpCurrentPosition.x
                currentPopUp.position.y = popUpCurrentPosition.y
                currentPopUp.position.z = popUpCurrentPosition.z
                camera.lookAt(currentPopUp.position)
            })
            .onComplete( function() {
                youtube.scale.set(0.1,0.1,0.1)
                tweenActive = false
                controls.enabled = true
            })
        tweenBack.start()
    },

    tweenTowardCamera() {
        let tween = new TWEEN.Tween(camCurrentPosition).to(targetPosition, 2000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart( function() {
                tweenActive = true
                controls.enabled = false
            })
            .onUpdate( function () {
                youtube.scale.set(0,0,0);
                currentPopUp.rotation.y = (camCurrentPosition.rot * Math.PI)/180
                currentPopUp.position.x = camCurrentPosition.x
                currentPopUp.position.y = camCurrentPosition.y
                currentPopUp.position.z = camCurrentPosition.z
                camera.lookAt(currentPopUp.position)
            })
            .onComplete( function () {
                popUpCurrentPosition = {
                    x: currentPopUp.position.x,
                    y: currentPopUp.position.y,
                    z: currentPopUp.position.z,
                    rot: 360
                }
                loadDivContent(currentPopUp.name)
                tweenActive = false
            })
            .start();
    }
}

function loadDivContent(fileName) {
    let element = document.createElement('div')
        HEIGHT = $(window).height(),
        WIDTH = $(window).width(),
        selectedSite = {};

    element.style.width = WIDTH + 'px'
    element.style.height = HEIGHT + 'px'
    element.className = 'content-div'

    element.prototype = {}
    Object.assign( element.prototype, EventDispatcher.prototype );

    element.addEventListener('click', function(e){
        if (tweenActive || divActive){
            console.log("blocked click in divContent")
            return
        }

        let opacity = {val:1.0},
            target = {val:0.0}

        let tween = new TWEEN.Tween(opacity).to(target, 1500)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart( function() {
                divActive = true
                if (fileName != "modal")
                    myTweens.tweenBack()
            })
            .onUpdate( function(){
                element.style.opacity = opacity.val
            })
            .onComplete( function() {
                divActive = false
                element.parentNode.removeChild(element)
            })
            .start()
    })

    if (fileName === "about_mf"){
        fileLoader.load('./3dwebsite/html/about_mf.html', function(html){
            $(element).append(html)
        })
    } else if (fileName === "modal"){
        fileLoader.load('./3dwebsite/html/modal.html', function(html){
            $(element).append(html)
        })
    } else {
        selectedSite = websiteData[fileName]
        let html = `<div class="website-container info-popup">
                        <h1>${selectedSite.name}</h1>
                        <div class="lower-half-popup">
                            <h2>${selectedSite.subheader}</h2>
                            <p>${selectedSite.text}</p>
                            <a href="${selectedSite.link}" target="_blank">Visit Site</a>
                        </div>
                        <footer>Click to anywhere to close</footer>
                    </div>`
        $(element).append(html)
    }

    $('body').prepend(element)

    setTimeout(function(){
        let opacity = {val:0.0},
            target = {val:1.0}

        let tween = new TWEEN.Tween(opacity).to(target, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart( function() {
                divActive = true
            })
            .onUpdate( function(){
                element.style.opacity = opacity.val
            })
            .onComplete( function() {
                divActive = false
                element.className += " active"
            })
            .start()
    }, 500)
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
    // renderer2.domElement.style.pointerEvents = 'none';
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    container.appendChild(renderer2.domElement);

    scene2 = new THREE.Scene();
    scene = new THREE.Scene();

    loadDivContent("modal")

    //YOUTUBE

    youtube = new YoutubePlane('kJvrgyHXrMo', 0, -330, 0, 0) // The Monster
    youtube.scale.set(0.1, 0.1, 0.1)
    scene2.add(youtube)

    // ContactButton

    contactButton = new ContactButton(0, -430, 0)
    contactButton.scale.set(0.1, 0.1, 0.1)
    scene2.add(contactButton)

    // EARTH

    earthMesh = new Planet('/3dwebsite/img/earthmap4k.jpg')
    scene.add(earthMesh)

    // CAMERA

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 0.5;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
    camera.target = scene.position.clone();
    camera.position.set(0,0,100)

    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    // SKYBOX

    let imagePrefix = "/3dwebsite/img/";
    let urls = [ `space.jpg`, `space.jpg`, `space.jpg`, `space.jpg`, `space.jpg`, `space.jpg` ]
    let skyBox = new THREE.CubeTextureLoader().setPath(imagePrefix).load(urls)
    scene.background = skyBox

    // FIRSTPERSONCONTROLS

    controls = new THREE.FirstPersonControls(camera)
    controls.lookSpeed = 0.1;
    controls.movementSpeed = 20;
    controls.noFly = true;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.0;
    controls.verticalMax = 2.0;
    controls.lon = -90;
    controls.lat = 20;

    // LOADING JSON DATA

    fileLoader.load('/3Dwebsite/public/data.json', function(jsonData) {
        websiteData = JSON.parse(jsonData)
    })
}

function createText(){

    textPivot = new THREE.Object3D();
    textPivot.name = "textPivot"
    textPivot.position.set(-65 ,5 ,0)

    contactPivot = new THREE.Object3D();
    contactPivot.name = "contactPivot"
    contactPivot.position.set(0 ,-400 ,0)

    let loader = new THREE.FontLoader();
    let textMaterial = new THREE.MeshPhongMaterial( {
        specular: 0x520AAA,
        color: 0x520AAA,
        shininess: 100
    } );

    let options = {
        // font: font,
        size: 10,
        height: 1,
        curveSegments: 15,
        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true,
        bevelSegments: 15
    }

    loader.load( '/3dwebsite/fonts/optimer_regular.typeface.json', function ( font ) {
        options.font = font;

        // FIRST LINE

        let textGeo = new THREE.TextGeometry( "Hello! I'm Matt Fewer.", options);
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

    loader.load( '/3dwebsite/fonts/optimer_regular.typeface.json', function ( font ) {
        options.font = font;

        // THIRD LINE

        textGeo = new THREE.TextGeometry( "Let's talk!", options);

        textMesh3 = new THREE.Mesh( textGeo, textMaterial );
        // textMesh3.position.set( -28,-320,0 );
        textMesh3.position.set( -28,0,0 );

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
    buttonPivot.position.set(0, -50, 0)

    // ARROW

    let baseHeight = -4, baseWidth = 3;

    let shape = new THREE.Shape();

    shape.moveTo( 0,0 );
    shape.lineTo( baseWidth, 0 );
    shape.lineTo( baseWidth, baseHeight );
    shape.lineTo( baseWidth + 3, baseHeight );
    shape.lineTo( baseWidth / 2, baseHeight * 2 );
    shape.lineTo( -3, baseHeight );
    shape.lineTo( 0, baseHeight );
    shape.lineTo( 0, 0 );

    let extrudeSettings = {
    	steps: 5,
    	amount: 3,
    	bevelEnabled: true,
    	bevelThickness: 1,
    	bevelSize: 1,
    	bevelSegments: 1
    };

    let arrowGeom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    let arrowMaterial = new THREE.MeshPhongMaterial( {
        specular: 0x8C52D3,
        color: 0x8C52D3,
        shininess: 10
    } );

    arrowMaterial.side = THREE.DoubleSide;
    arrowMesh = new THREE.Mesh( arrowGeom, arrowMaterial );
    arrowMesh.name = "arrowMesh"
    arrowMesh.position.set(-1.5, 3.5, -2)

    // TORUS

    let torusGeom = new THREE.TorusGeometry(10, 2, 4, 6, Math.PI * 2);
    torusMesh = new THREE.Mesh(torusGeom, arrowMaterial);
    torusMesh.name = "torusMesh"

    buttonPivot.add(arrowMesh)
    buttonPivot.add(torusMesh)
    scene.add(buttonPivot)
}
function createPlaneGroup(){
    planeGroup = new THREE.Group();

    let startPosY = -60

    createPlane(-25, startPosY - 20, "advanced_cosmetic_dentistry", "/websites/advanced_cosmetic_dentistry.jpg")
    createPlane(0, startPosY - 20, "retro_express", "/websites/retro_express.jpg")
    createPlane(25, startPosY - 20, "dr_maieve", "/websites/dr_maieve.jpg")

    createPlane(-25, startPosY - 40, "dr_alison_black", "/websites/dr_alison_black.jpg")
    createPlane(0, startPosY - 40, "atlas_vein", "/websites/atlas_vein.jpg")
    createPlane(25, startPosY - 40, "galleria", "/websites/galleria.jpg")

    createPlane(-25, startPosY - 60, "spiced", "/websites/spiced.jpg")
    createPlane(0, startPosY - 60, "dr_perron", "/websites/dr_perron.jpg")
    createPlane(25, startPosY - 60, "schlessinger", "/websites/schlessinger.jpg")

    createPlane(-25, startPosY - 80, "static_address", "/websites/static_address.jpg")
    createPlane(0, startPosY - 80, "tsrh_home", "/websites/tsrh_home.jpg")
    createPlane(25, startPosY - 80, "urogynecology_center", "/websites/urogynecology_center.jpg")


    createPlane(0, startPosY - 120, "about_mf", "../img/about_me/brandenburg_tor.jpg", true)


    createPlane(-25, startPosY - 160, "gentle_dental", "/websites/gentle_dental.jpg")
    createPlane(0, startPosY - 160, "mcdowell", "/websites/mcdowell.jpg")
    createPlane(25, startPosY - 160, "dental_phobia", "/websites/dental_phobia.jpg")

    createPlane(-25, startPosY - 180, "belcor_builders", "/websites/belcor_builders.jpg")
    createPlane(0, startPosY - 180, "dfw_spine", "/websites/dfw_spine.jpg")
    createPlane(25, startPosY - 180, "centerderm", "/websites/centerderm.jpg")

    createPlane(-25, startPosY - 200, "smiles_4_a_lifetime", "/websites/smiles_4_a_lifetime.jpg")
    createPlane(0, startPosY - 200, "tennessee_vein", "/websites/tennessee_vein.jpg")
    createPlane(25, startPosY - 200, "the_vein_clinic", "/websites/the_vein_clinic.jpg")

    createPlane(-25, startPosY - 220, "priest_dental", "/websites/priest_dental.jpg")
    createPlane(0, startPosY - 220, "retinal_san_antonio", "/websites/retinal_san_antonio.jpg")
    createPlane(25, startPosY - 220, "eye_surgery_center", "/websites/eye_surgery_center.jpg")

    scene.add(planeGroup);

    function createPlane(x,y,name,img_path, big = false) {
        let planeGeo, planeMaterial;

        big ? planeGeo = new THREE.PlaneGeometry(70, 50) : planeGeo = new THREE.PlaneGeometry(20, 10);

        let loader = new THREE.TextureLoader()
        loader.setPath( '../img' )

        planeMaterial = new THREE.MeshBasicMaterial({
            map: loader.load(img_path, function(){})
        });
        planeMaterial.side = THREE.DoubleSide

        let mesh = new THREE.Mesh(planeGeo, planeMaterial)
        mesh.name = name
        mesh.position.set(x,y,0)

        scene.add(mesh)
        planeGroup.add(mesh)
    }
}
function createLights() {

    // SPOTLIGHT #1 - textPivot

    let pointColor = "#ffffff";
    let spotLight = new THREE.SpotLight(pointColor);
    // spotLight.position.set(0,0,90);
    spotLight.castShadow = true;

    let target = new THREE.Object3D();
    // target.position = new THREE.Vector3(5, 0, 0);
    target.position = new THREE.Vector3(target.position.x, target.position.y, target.position.z);
    spotLight.target = target;
    spotLight.position.set(target.position.x, target.position.y, target.position.z + 100);

    scene.add(spotLight);

    // SPOTLIGHT #2 - contactPivot

    spotLight2 = new THREE.SpotLight(pointColor);
    spotLight2.position.set(contactPivot.position.x, contactPivot.position.y - 60, contactPivot.position.z + 90);
    spotLight2.castShadow = true;
    spotLight2.target = contactPivot
    scene.add(spotLight2);

    // SPOTLIGHT #3 - Earth

    spotLight3 = new THREE.SpotLight(pointColor);
    spotLight3.position.set(earthMesh.position.x ,earthMesh.position.y ,earthMesh.position.z - 100);
    spotLight3.castShadow = true;
    spotLight3.target = earthMesh;
    scene.add(spotLight3);
}

function onDocumentMouseDown(event) {
    if(tweenActive || divActive){
        console.log("blocked click in mouseDown");
        return;
    }

    let vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    let intersects = raycaster.intersectObjects(scene.children, true);


    // PLANE FLIP TWEEN
    // =============================================

    if (intersects.length > 0 && intersects[0].object.geometry.type === "PlaneGeometry") {
        currentPopUp = intersects[0].object

        // TWEENBACK

        if (currentPopUp.rotation.y > 0){


        // TWEEN

        } else {
            if (intersects[0].object.name === "about_mf"){
                targetPosition = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z - 40,
                    rot: camera.rotation._y + 360
                }
            } else {
                targetPosition = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z - 10,
                    rot: camera.rotation._y + 360
                }
            }

            firstPosition = {
                x: currentPopUp.position.x,
                y: currentPopUp.position.y,
                z: intersects[0].object.position.z,
                rot: 0
            }
            camCurrentPosition = {
                x: currentPopUp.position.x,
                y: currentPopUp.position.y,
                z: currentPopUp.position.z,
                rot: 0
            }

            myTweens.tweenTowardCamera();
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
// function onMouseMove( e ) {
//
//     e.preventDefault()
// 	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1
//
// }
// window.addEventListener('mousemove', onMouseMove, false)
function render(){
    requestAnimationFrame(render);

    buttonPivot.rotation.y += 0.1
    earthMesh.rotation.y += 0.01
    TWEEN.update()

    renderer.render(scene, camera);
    renderer2.render(scene2, camera);
    let delta = clock.getDelta()
    controls.update(delta)
}
function init(){
    createScene();
    createText();
    createPlaneGroup();
    createTorus();
    createLights();
    render();
}
init()
