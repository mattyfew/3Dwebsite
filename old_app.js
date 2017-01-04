// test
var camera, scene, renderer;
var sceneCube, cameraCube;

var Element = function(id, x, y, z, ry) {

    var div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    var iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = ['http://www.youtube.com/embed/', id, '?rel=0'].join('');
    div.appendChild(iframe);

    var object = new THREE.CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;

    return object;

};

init();
animate();

function init() {

    var container = document.getElementById('container');

    // CREATE SCENE
    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();

    // CAMERAS
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(500, 350, 750);
    cameraCube = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);

    // LIGHTS
    scene.add(new THREE.AmbientLight(0x444444, 0.0, 0));
    var light = new THREE.PointLight( 0xffffff, 2, 10000 );
    scene.add( light );

    // SKYBOX ************

    // var sphere = new THREE.SphereGeometry(200, 200, 200);

    var loader = new THREE.CubeTextureLoader();
    //loader.setCrossOrigin('anonymous');
    textureArray = ['galaxy_starfield.png', 'galaxy_starfield1.png', 'galaxy_starfield2.png', 'galaxy_starfield3.png', 'galaxy_starfield4.png', 'galaxy_starfield5.png'];
    loader.setPath('./img/');
    var textureCube = loader.load([
        'galaxy_starfield.png', 'galaxy_starfield1.png', 'galaxy_starfield2.png', 'galaxy_starfield3.png', 'galaxy_starfield4.png', 'galaxy_starfield5.png'
    ]);

    var skyMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube,
        side: THREE.BackSide
    });

    var skyGeometry = new THREE.BoxGeometry(100, 100, 100);

    var skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    skyMesh.scale.set(50,50,50);
    scene.add(skyMesh);

    skyMesh.position.copy(camera.position)









    // CSS3RENDERER
    // renderer = new THREE.CSS3DRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.domElement.style.position = 'absolute';
    // renderer.domElement.style.top = 0;
    // container.appendChild(renderer.domElement);

    // ****** YOUTUBE VIDEOS *****
    var group = new THREE.Group();
    group.add(new Element('sWqsgEYNii4', 0, 0, 240, 0)); // Crush
    group.add(new Element('gi1U5ytuwPA', 240, 0, 0, Math.PI / 2)); // MIM Toshis
    group.add(new Element('VCDS2k8Dd9I', 0, 0, -240, Math.PI)); // Less good Toshis
    group.add(new Element('kJvrgyHXrMo', -240, 0, 0, -Math.PI / 2)); // THe Monster
    scene.add(group);

    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 2;

    window.addEventListener('resize', onWindowResize, false);

    // Block iframe events when dragging camera
    var blocker = document.getElementById('blocker');
    blocker.style.display = 'none';
    document.addEventListener('mousedown', function() {
        blocker.style.display = '';
    });
    document.addEventListener('mouseup', function() {
        blocker.style.display = 'none';
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(sceneCube, cameraCube);
    renderer.render(scene, camera);
}
