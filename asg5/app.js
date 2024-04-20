import * as THREE from 'three';
import { Water } from 'Water';  // Import Water module
import { OrbitControls } from 'OrbitControls';  // Import OrbitControls module

// Existing setup for renderer and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Existing Cube
const geometryCube = new THREE.BoxGeometry();
const materialCube = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometryCube, materialCube);
cube.position.x = -2; // position it to the left
scene.add(cube);

// New Sphere
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
const materialSphere = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.position.x = 0; // center
scene.add(sphere);

// New Cylinder
const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
cylinder.position.x = 2; // position it to the right
scene.add(cylinder);

// Directional Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

// Animation function
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01; // also animate the sphere
    sphere.rotation.y += 0.01;

    // Cylinder is static in this example
    renderer.render(scene, camera);
}

animate();
