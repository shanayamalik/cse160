import * as THREE from 'three';
// Ensure that the OrbitControls are correctly imported if needed
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a water texture for the cube
const loader = new THREE.TextureLoader();
const waterTexture = loader.load('textures/waternormals.jpg');
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(2, 2);  // Adjust texture repetition

// Create the cube with water texture
const geometryCube = new THREE.BoxGeometry();
const materialCube = new THREE.MeshPhongMaterial({
    color: 0x44aa88,  // Base color
    map: waterTexture,  // Apply the water texture
    normalMap: waterTexture  // Use the same texture as a normal map
});
const cube = new THREE.Mesh(geometryCube, materialCube);
cube.position.x = -2; // position it to the left
scene.add(cube);

// Set up additional shapes: sphere and cylinder
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
const materialSphere = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.position.x = 0; // center
scene.add(sphere);

const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
cylinder.position.x = 2; // position it to the right
scene.add(cylinder);

// Add directional light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

// Animation function for rendering the scene
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Add OrbitControls for better interactivity
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
