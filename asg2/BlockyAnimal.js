// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global Variables Related to UI Elements
let g_globalAngle=0; 
let g_vertAngle=0;
let g_neckAngle=0;
let g_headAngle=0;
let g_legsAngle=0;
let g_neckAnimation=false;
let g_headAnimation=false;
let g_legsAnimation=false;
let g_seconds=0;

function addActionsForHtmlUI() {
document.getElementById('neckSlide').addEventListener('mousemove', function() {g_neckAngle = this.value; renderAllShapes(); });
  document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes(); });

document.getElementById('legsSlide').addEventListener('mousemove', function() {g_legsAngle = this.value; renderAllShapes(); });
  
document.getElementById('animationneckOnButton').onclick = function() {g_neckAnimation=true;};
document.getElementById('animationneckOffButton').onclick = function() {g_neckAnimation=false;};

document.getElementById('animationheadOnButton').onclick = function() {g_headAnimation=true;};
document.getElementById('animationheadOffButton').onclick = function() {g_headAnimation=false;};
  
document.getElementById('animationlegsOnButton').onclick = function() {g_legsAnimation=true;};
document.getElementById('animationlegsOffButton').onclick = function() {g_legsAnimation=false;};

document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('vertSlide').addEventListener('mousemove', function() {g_vertAngle = this.value; renderAllShapes(); });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // Set up actions for HTML UI 
  addActionsForHtmlUI();
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  g_startTime=performance.now()/1000.0;
  //renderAllShapes();
  requestAnimationFrame(tick);
}

// Called by browser repeatedly whenever its time
function tick() {
    g_seconds=performance.now()/1000.0-g_startTime;
    //console.log(performance.now());

    updateAnimationAngles();
  
    // Draw everything
    renderAllShapes();

    // Tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_neckAnimation) {
        g_neckAngle = (45 * Math.sin(g_seconds));
    }
    if (g_headAnimation) {
        g_headAngle = (45 * Math.sin(3 * g_seconds));
    }
    if (g_legsAnimation) {
          g_legsAngle = (25 * Math.sin(3 * g_seconds));
    }
}

function renderAllShapes() {
  var StartTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat=new Matrix4()
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_vertAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the body cube
  var body = new Cube();
  body.color = [0.8, 0.8, 0.8, 1.0];
  body.matrix.translate(-0.25, -0.25, 0.0);
  var bodyCoordinatesMat=new Matrix4(body.matrix);
  //body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, .5, .75);
  body.render();

  // Draw a neck
  var neck = new Cube();
  neck.color = [0.7, 0.7, 0.7, 1.0];
  neck.matrix = bodyCoordinatesMat;
  neck.matrix.setTranslate(0.0, 0.10, 0.05); 
  //neck.matrix.rotate(-5,1,0,0);
  neck.matrix.rotate(-g_neckAngle,1,0,0);
  var neckCoordinatesMat=new Matrix4(neck.matrix);
  neck.matrix.scale(0.25, 0.45, 0.25);
  neck.matrix.translate(-0.5,0,0);
  neck.render();

  // Draw a head
  var head = new Cube();
  head.color = [0.65, 0.65, 0.65, 1.0];
  head.matrix = neckCoordinatesMat;
  head.matrix.translate(0, 0.45, -0.15);
  head.matrix.rotate(g_headAngle*0.5, 0, 1, 0);
  head.matrix.scale(0.35, 0.3, 0.45);
  head.matrix.translate(-0.5, 0, -0.0001);
  //head.matrix.rotate(-30, 1, 0, 0);
  //head.matrix.scale(.5, .5, .5);
  head.render();

  // Draw four legs
  var leg = new Cube(); // Front left
  leg.color = [0.6, 0.6, 0.7, 1.0];
  leg.matrix = bodyCoordinatesMat;
  leg.matrix.setTranslate(0.05, -0.2, 0.05); 
  leg.matrix.rotate(g_legsAngle,1,0,0);
  leg.matrix.scale(0.10, -0.45, 0.20);
  leg.render();

  var leg2 = new Cube(); // Front right
  leg2.color = [0.6, 0.6, 0.7, 1.0];
  leg2.matrix = bodyCoordinatesMat;
  leg2.matrix.setTranslate(-0.15, -0.2, 0.05); 
  leg2.matrix.rotate(-g_legsAngle,1,0,0);
  leg2.matrix.scale(0.10, -0.45, 0.20);
  leg2.render();

  var leg3 = new Cube(); // Back left
  leg3.color = [0.6, 0.6, 0.7, 1.0];
  leg3.matrix = bodyCoordinatesMat;
  leg3.matrix.setTranslate(0.05, -0.2, 0.5); 
  leg3.matrix.rotate(-g_legsAngle,1,0,0);
  leg3.matrix.scale(0.10, -0.45, 0.20);
  leg3.render();

  var leg4 = new Cube(); // Back right
  leg4.color = [0.6, 0.6, 0.7, 1.0];
  leg4.matrix = bodyCoordinatesMat;
  leg4.matrix.setTranslate(-0.15, -0.2, 0.5); 
  leg4.matrix.rotate(g_legsAngle,1,0,0);
  leg4.matrix.scale(0.10, -0.45, 0.20);
  leg4.render();
  
  var duration = performance.now() - StartTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
      console.log("Failed to get " + htmlID + " from HTML");
      return;
  }
htmlElm.innerHTML = text;
}
