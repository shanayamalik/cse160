// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position =  u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  ' v_UV = a_UV;\n' +
  '}';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  //'  gl_FragColor = vec4(v_UV,1.0,1.0);\n' +
'}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

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

// Constants
//const POINT = 0;
//const TRIANGLE = 1;
//const CIRCLE = 2;

// Global Variables Related to UI Elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
//let g_selectedType=POINT;
let g_globalAngle=0; 
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_seconds=0;
//let g_startTime=0;

function addActionsForHtmlUI() {
document.getElementById('yellowSlide').addEventListener('mousemove', function() {g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() {g_magentaAngle = this.value; renderAllShapes(); });

document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};
document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};

document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation=true;};
document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation=false;};
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
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

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  console.log ([x,y]);
  // Create and store the new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle(g_selectedSegments); 
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}

// Called by browser repeatedly whenever its time
function tick() {
    g_seconds=performance.now()/1000.0-g_startTime;
    // Print some debug information so we know we are running
    //console.log(performance.now());

    updateAnimationAngles();

    // Draw everything
    renderAllShapes();

    // Tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45 * Math.sin(g_seconds));
    }
    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
    }
}

function renderAllShapes() {
  var StartTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, .3, .5);
  body.render();

  // Draw a left arm
  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.matrix.setTranslate(0, -0.5, 0.0); 
  yellow.matrix.rotate(-5,1,0,0);
  yellow.matrix.rotate(-g_yellowAngle,0,0,1);



  var yellowCoordinatesMat=new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5);
  yellow.matrix.translate(-0.5,0,0);
  yellow.render();


  // Test box
  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.rotate(g_magentaAngle, 0, 0, 1);
  box.matrix.scale(0.3, 0.3, 0.3);
  box.matrix.translate(-0.5, 0, -0.001);
  //box.matrix.rotate(-30, 1, 0, 0);
  //box.matrix.scale(.5, .5, .5);
  box.render();

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