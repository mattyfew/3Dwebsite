var container, info, camera, cubeCamera, scene, light, geometry, mesh, renderer, controls, loader, clock;
var logoCenter, logoBottom, logoTop, materialInside, materialOutisde, skyMaterial, extrusionSettings, logoOutside, logoInside, skyGeometry, logoInsideMesh, logoOutsideMesh, skyMesh;
var scale1, target1, tween1, scale2, target2, tween2;
var skyBoxTexture = THREE.ImageUtils.loadTexture('textures/rainbow-low-quality-min.png', THREE.UVMapping, function() {
    init();
    tweens();
    animate();
});

function init() {
    // dom
    container = document.createElement('div');
    container.setAttribute("id", "hero");
    document.body.appendChild(container);

    // info
    info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '20px';
    info.style.left = '20px';
    info.innerHTML = '<h1 style="margin:0"><a href="mailto:oxideous@oxideous.com">OXIDEOUS</a></h1>';
    container.appendChild(info);

    // clock
    clock = new THREE.Clock();

    // instantiate a loader
    loader = new THREE.TextureLoader();

    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(-45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 000, 900);
    scene.add(camera);

    // cube camera
    cubeCamera = new THREE.CubeCamera(200, 12000, 500);
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearFilter;
    scene.add(cubeCamera);

    // controls
    controls = new THREE.OrbitControls(camera);
    controls.minDistance = 900;
    controls.maxDistance = 1200;
    controls.enableKeys = false;

    // shapes
    logoCenter = new THREE.Shape();
    logoCenter.moveTo(396.3, 449);
    logoCenter.lineTo(539.9, 306.6);
    logoCenter.lineTo(396.3, 163);
    logoCenter.lineTo(253.9, 306.6);
    logoCenter.lineTo(396.3, 449);

    logoBottom = new THREE.Shape();
    logoBottom.moveTo(571.9, 176);
    logoBottom.lineTo(521.3, 226.5);
    logoBottom.lineTo(600.3, 305.4);
    logoBottom.lineTo(395.9, 509.7);
    logoBottom.lineTo(191.6, 305.4);
    logoBottom.lineTo(271.7, 225.3);
    logoBottom.lineTo(222.1, 176);
    logoBottom.lineTo(90.5, 307.6);
    logoBottom.lineTo(394.9, 612);
    logoBottom.lineTo(395.1, 611.8);
    logoBottom.lineTo(701.2, 305.2);
    logoBottom.lineTo(571.9, 176);

    logoTop = new THREE.Shape();
    logoTop.moveTo(395.9, 101.1);
    logoTop.lineTo(476, 181.2);
    logoTop.lineTo(526.5, 130.6);
    logoTop.lineTo(395.9, 0);
    logoTop.lineTo(264.3, 131.6);
    logoTop.lineTo(314.8, 182.2);
    logoTop.lineTo(395.9, 101.1);

    //		var skyBoxTexture = loader.load('textures/building.jpg', function(){
    //			//skyBoxTexture.mapping = THREE.UVMapping;
    //			animate();
    //		});

    //		var skyBoxTexture = loader.load('textures/tri.svg');
    //skyBoxTextureDark = loader.load('textures/tri.svg');

    materialOutside = new THREE.MeshBasicMaterial({
        envMap: cubeCamera.renderTarget
    });

    materialInside = new THREE.MeshBasicMaterial({
        envMap: cubeCamera.renderTarget
    });

    skyMaterial = new THREE.MeshBasicMaterial({
        map: skyBoxTexture
    });

    extrusionSettings = {
        amount: 100,
        bevelEnabled: false
    };

    // geometry
    logoOutside = new THREE.ExtrudeGeometry([logoTop, logoBottom], extrusionSettings);
    logoInside = new THREE.ExtrudeGeometry(logoCenter, extrusionSettings);
    skyGeometry = new THREE.SphereGeometry(2000, 60, 40);

    logoInsideMesh = new THREE.Mesh(logoInside, materialInside);
    logoInsideMesh.geometry.center(logoInside);
    logoInsideMesh.scale.set(0, 0, 0)

    logoOutisdeMesh = new THREE.Mesh(logoOutside, materialOutside);
    logoOutisdeMesh.geometry.center(logoOutside);
    logoOutisdeMesh.scale.set(0, 0, 0)

    skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    skyMesh.scale.x = -1;
    skyMesh.material.transparent = true;
    skyMesh.material.opacity = 0;

    scene.add(skyMesh);
    scene.add(logoInsideMesh);
    scene.add(logoOutisdeMesh);




    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

}


//TWEENS
function tweens() {
    scale1 = {
        x: 1,
        y: 1,
        z: 1
    };
    target1 = {
        x: 0.05,
        y: 0.05,
        z: 0.05
    };
    tween1 = new TWEEN.Tween(scale1)
        .to(target1, 1000)
        .delay(100)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function() {
            skyMesh.material.opacity += target1.x;
            if (logoInsideMesh.scale.x < 1) {
                logoInsideMesh.scale.x += target1.x;
                logoInsideMesh.scale.y += target1.y;
                logoInsideMesh.scale.z += target1.z;
            }
        }).start();

    scale2 = {
        x: 1,
        y: 1,
        z: 1
    };
    target2 = {
        x: 0.05,
        y: 0.05,
        z: 0.05
    };
    tween2 = new TWEEN.Tween(scale2)
        .to(target2, 1000)
        .delay(100)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function() {
            if (logoOutisdeMesh.scale.x < 1) {
                logoOutisdeMesh.scale.x += target2.x;
                logoOutisdeMesh.scale.y += target2.y;
                logoOutisdeMesh.scale.z += target2.z;
            }
        });

    tween1.chain(tween2);
    //	tween2.chain(tween1);
}


function animate() {
    requestAnimationFrame(animate);
    logoInsideMesh.rotation.y += 0.015;
    logoOutisdeMesh.rotation.y += 0.01;
    skyMesh.rotation.y -= .01;
    controls.update()
    TWEEN.update();
    camera.lookAt(scene.position);
    cubeCamera.updateCubeMap(renderer, scene);
    renderer.render(scene, camera);
};
