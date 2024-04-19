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
import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

// HelloCube.js (c) 2012 matsuda
// Vertex shader program
// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec2 aPosition;
  uniform mat4 uModelMatrix;
  void main() {
    gl_Position = uModelMatrix * vec4(aPosition, 0.0, 1.0);
  }
`;

// Fragment shader program
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
  `;

// Retrieve <canvas> element
var canvas = document.getElementById("webgl");

// Get the rendering context for WebGL
var gl = canvas.getContext("webgl");
if (!gl) {
  console.log("Failed to get the rendering context for WebGL");
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log("Failed to intialize shaders.");
}

//Defined triangle's vertices
const vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5]);

//Create a buffer to store the vertex data
const vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
  console.log("Failed to create the buffer object");
}

// Bind the buffer object to the gl.ARRAY_BUFFER target
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

// Write the vertices data into the buffer object
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the storage location of the aPosition attribute variable
const aPosPtr = gl.getAttribLocation(gl.program, "aPosition");

// Check if the attribute location was retrieved successfully
if (aPosPtr < 0) {
  console.error("Could not find aPosition ptr");
}

gl.vertexAttribPointer(aPosPtr, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosPtr);

const M = new Matrix4();
M.setTranslate(0.5, -0.25, 0);
M.scale(0.46, 0.46, 0.46);
M.rotate(45, 0, 0, 1);
drawSpaceship(gl, M);

M.setTranslate(-0.15, 0.25, 0);
M.scale(0.75, 0.75, 0.75);
M.rotate(39, 0, 0, 1);
drawSpaceship(gl, M);

function drawSpaceship(gl, matrix) {
  const uModelMatrixPtr = gl.getUniformLocation(gl.program, "uModelMatrix");

  // Create a new Matrix4 object that can be safely modified
  const M1 = new Matrix4();
  // Reset to the original matrix
  M1.set(matrix);

  M1.translate(0, 0, 0);
  M1.rotate(45, 0, 0, 1);
  M1.scale(0.5, 0.5, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M1.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M2 = new Matrix4();
  M2.set(matrix);
  M2.translate(0.0, 0, 0);
  M2.rotate(225, 0, 0, 1);
  M2.scale(0.5, 0.5, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M2.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M3 = new Matrix4();
  M3.set(matrix);
  M3.translate(-0.25, -0.25, 0);
  M3.rotate(-45, 0, 0, 1);
  M3.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M3.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M4 = new Matrix4();
  M4.set(matrix);
  M4.translate(-0.25, -0.25, 0);
  M4.rotate(135, 0, 0, 1);
  M4.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M4.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M5 = new Matrix4();
  M5.set(matrix);
  M5.translate(-0.2, -0.35, 0);
  M5.rotate(90, 0, 0, 1);
  M5.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M5.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M6 = new Matrix4();
  M6.set(matrix);
  M6.translate(-0.35, -0.2, 0);
  M6.rotate(-90, 0, 0, 1);
  M6.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M6.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M7 = new Matrix4();
  M7.set(matrix);
  M7.translate(0.18, 0.18, 0);
  M7.rotate(-180, 0, 0, 1);
  M7.scale(0.35, 0.35, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M7.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M8 = new Matrix4();
  M8.set(matrix);
  M8.translate(-0.56, -0.2, 0);
  M8.rotate(-270, 0, 0, 1);
  M8.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M8.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  const M9 = new Matrix4();
  M9.set(matrix);
  M9.translate(-0.2, -0.56, 0);
  M9.rotate(270, 0, 0, 1);
  M9.scale(0.2, 0.2, 1);
  gl.uniformMatrix4fv(uModelMatrixPtr, false, M9.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Set clear color
//gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clearColor(0.2, 0.2, 0.2, 1.0); //Set gray color
gl.clear(gl.COLOR_BUFFER_BIT);

drawSpaceship(gl, M);
