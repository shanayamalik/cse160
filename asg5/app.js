import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

// Setup for renderer and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup for cube
const geometryCube = new THREE.BoxGeometry();
const materialCube = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometryCube, materialCube);
cube.position.x = -2;
scene.add(cube);

// Setup for sphere
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
const materialSphere = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.position.x = 0;
scene.add(sphere);

// Setup for cylinder
const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
cylinder.position.x = 2;
scene.add(cylinder);

// Setup for directional light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

// Setup for water
const waterGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('./waternormals.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);
water.rotation.x = -Math.PI / 2;
scene.add(water);

// Animation function
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    cylinder.rotation.x += 0.02;
    cylinder.rotation.y += 0.03;

    water.material.uniforms['time'].value += 1.0 / 60.0;

    renderer.render(scene, camera);
}

animate();
