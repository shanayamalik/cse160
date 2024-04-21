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
import Circle from "./Circle";
import Stats from "stats.js";

// FPS Monitor, check out https://github.com/mrdoob/stats.js/ for more info
var stats = new Stats();

// move panel to right side instead of left
// cuz our canvas will be covered
stats.dom.style.left = "auto";
stats.dom.style.right = "0";
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 aPosition;
  void main() {
    gl_Position = aPosition;
    gl_PointSize = 30.0;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 uFragColor;
  void main() {
    gl_FragColor = uFragColor;
  }`;

/**
 * SETUP WEBGL STUFF
 */
const canvas = document.getElementById("webgl");

// Get the rendering context for WebGL
const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
if (!gl) {
  console.log("Failed to get the rendering context for WebGL");
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log("Failed to intialize shaders.");
}

// Specify the color for clearing <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT);

/**
 * GLOBAL SHAPES LIST
 */
var COUNT = 5;
const g_shapesList = [];

/**
 * ADD HTML EVENTS AND GET REFERENCES
 */
const slider = document.getElementById("slider");
const addBtn = document.getElementById("add");
const clearBtn = document.getElementById("clear");
const count = document.getElementById("sliderVal");
const total = document.getElementById("total");

slider.onchange = function (e) {
  COUNT = e.target.value;
  count.innerText = e.target.value;
};

addBtn.onclick = function () {
  for (let i = 0; i < COUNT; i++) {
    addCircle();
  }
  total.innerText = g_shapesList.length;
};

clearBtn.onclick = function () {
  g_shapesList.length = 0;
  total.innerText = 0;

  renderAllShapes();
};

// start render loop
// tick();

/**
 * RENDER LOOP
 */
function tick() {
  stats.begin();

  renderAllShapes();
  stats.end();

  requestAnimationFrame(tick);
}

/**
 * FUNCTIONS
 */
function addCircle() {
  // Create and store the new circle
  let c = new Circle();

  // position on canvas between [-1,1] on x AND y axes
  let x = Math.random() * 2.0 - 1.0;
  let y = Math.random() * 2.0 - 1.0;

  // random color
  let r = Math.random();
  let g = Math.random();
  let b = Math.random();

  c.position = [x, y];
  c.color = [r, g, b, 1];
  c.size = 10 + Math.random() * 10;

  g_shapesList.push(c);

  renderAllShapes();
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw each shape in the list
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render(gl);
  }
}
