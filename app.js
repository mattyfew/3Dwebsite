var camera, scene, renderer;

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

    // CAMERA
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(500, 350, 750);

    scene = new THREE.Scene();

    // CSS3RENDERER
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    container.appendChild(renderer.domElement);

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
    renderer.render(scene, camera);

}
