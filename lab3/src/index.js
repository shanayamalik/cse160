/**
 * With codesandbox we import our functions from the files they live in
 * rather than import that file in the HTML file like we usually do
 *
 * ALSO NOTE that there is NO main function being called.
 * index.js IS your main function and the code written in it is run
 * on page load.
 */
import "./styles.css";
import { initShaders } from "../lib/cuon-utils";
import getContext from "./Context";
import Stats from "stats.js";
import Cube from "./Cube";
import Camera from "./Camera";
import RotateControls from "./Controls";
import uvImg from "./img/uvCoords.png";
import diceImg from "./img/dice.png";

const stats = new Stats();
document.body.append(stats.dom);

// HelloCube.js (c) 2012 matsuda
// Vertex shader program
// Vertex shader program
const VSHADER_SOURCE = `
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  attribute vec3 aPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);

    vUv = uv;
  }
  `;

// Fragment shader program
const FSHADER_SOURCE = `
#ifdef GL_ES
   precision mediump float;
#endif

uniform sampler2D uTexture0;
uniform sampler2D uTexture1;

varying vec2 vUv;

void main() {
   vec4 image0 = texture2D(uTexture0, vUv);
   vec4 image1 = texture2D(uTexture1, vUv);
   vec4 color = mix(image0, image1, 0.5);
   gl_FragColor = color;
}
`;

const gl = getContext();

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log("Failed to intialize shaders.");
}

// Set clear color
gl.clearColor(0.1, 0.1, 0.125, 1.0);

const camera = new Camera();

const cube = new Cube();
cube.setImage(gl, uvImg, 0);
cube.setImage(gl, diceImg, 1);

const controls = new RotateControls(gl, cube);

var curTime = Date.now();

tick();

function tick() {
  stats.begin();

  let time = Date.now();
  let delta = time - curTime;
  curTime = time;

  delta *= 0.01;

  if (!controls.dragging) {
    controls.lerpRotation.elements[1] += delta;
  }

  gl.clear(gl.COLOR_BUFFER_BIT);
  controls.update();
  cube.render(gl, camera);

  stats.end();

  requestAnimationFrame(tick);
}
