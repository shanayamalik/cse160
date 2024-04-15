// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

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
let a_position;
let u_FragColor;
let u_Size;
let g_selectedSegments=10;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }  
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables Related to UI Elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
//let g_selectedType=TRIANGLE;

function addActionsForHtmlUI() {
  // Button Events
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];
    document.getElementById('greenSlide').value=100;
    document.getElementById('redSlide').value=0;
    document.getElementById('blueSlide').value=0;
 };
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];
    document.getElementById('greenSlide').value=0;
    document.getElementById('redSlide').value=100;
    document.getElementById('blueSlide').value=0;
  };
  document.getElementById('blue').onclick = function() {g_selectedColor = [0.0,0.0,1.0,1.0];
    document.getElementById('greenSlide').value=0;
    document.getElementById('redSlide').value=0;
    document.getElementById('blueSlide').value=100;
  };  

  document.getElementById('clearButton').onclick = function() {gl.clear(gl.COLOR_BUFFER_BIT); g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });  
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });
  
  document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value; });
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });

/*
  document.getElementById('copyButton').onclick = function() {
    g_shapesList = [];
    renderAllShapes(); 
    var destCtx = document.getElementById('backing').getContext('2d');
    //Copy the content from the source canvas to the destination canvas
    destCtx.drawImage(document.getElementById('photo'), 0, 0);
  };
*/

/*
  document.getElementById('recreateButton').onclick = function() {
    //g_shapesList = []; 
    //renderAllShapes(); 
    //var destCtx = document.getElementById('backing').getContext('2d');
    const vertexBuffer = gl.createBuffer(); // Create a buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // Bind the buffer object to target

    for (let i = 0; i < verticesList.length; i += 6) {
      // Get the six vertices for the current triangle
      const triangleVertices = verticesList.slice(i, i + 6);
      // Pass the vertices of a triangle to the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
      // Assign the buffer object to the position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
      // Draw the triangle
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // Clean up

for (let i = 0; i < verticesList.length; i += 6) {
    // Extract the vertices of the current triangle
    const x1 = verticesList[i], y1 = verticesList[i+1],
          x2 = verticesList[i+2], y2 = verticesList[i+3],
          x3 = verticesList[i+4], y3 = verticesList[i+5];

    // Calculate the lengths of the sides of the triangle
    const a = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const b = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
    const c = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));

    // Find the longest side
    const longestSide = Math.max(a, b, c);

    // Use Heron's formula to calculate the area of the triangle
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    // Output the results
    console.log(`Triangle vertices: [(${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})] Area: ${area.toFixed(4)} Longest side: ${longestSide.toFixed(4)}`);
}

  }
*/

  document.getElementById('recreateButton').onclick = function() {
      const vertexBuffer = gl.createBuffer(); // Create a buffer object for vertices
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
      for (let i = 0; i < verticesList.length; i += 6) {
          // Get the six vertices for the current triangle
          const triangleVertices = verticesList.slice(i, i + 6);
  
          // Create a random color for the current triangle
          const color = new Float32Array([
              Math.random(), // R
              Math.random(), // G
              Math.random(), // B
              1.0            // A
          ]);
  
          // Pass the vertices of a triangle to the buffer object
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
          // Assign the buffer object to the position variable
          gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(a_Position);
  
          // Set the color for the current triangle
          gl.uniform4fv(u_FragColor, color);
  
          // Draw the triangle 
          gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      // Clean up
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };

  document.getElementById('sparkleButton').onclick = async function() {
    for (let i = 0; i < 500000; i++) {
      document.getElementById('recreateButton').click();
      gl.finish();
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  };
}

const verticesList = [
-0.315, -0.83,
-0.345, -0.875,
-0.41, -0.83,

-0.22, -0.74,
-0.415, -0.665,
-0.31, -0.825,

-0.42, -0.81,
-0.42, -0.665,
-0.32, -0.81,

-0.42, -0.655,
-0.345, -0.545,
-0.335, -0.68,

-0.22, -0.735,
-0.33, -0.68,
-0.33, -0.585,

-0.135, -0.815,
-0.325, -0.585,
-0.13, -0.58,

-0.125, -0.815,
-0.125, -0.705,
-0.04, -0.72,

0.025, -0.82,
-0.115, -0.815,
-0.03, -0.73,

0.025, -0.82,
-0.12, -0.575,
0.02, -0.635,

0.02, -0.635,
0.165, -0.565,
0.025, -0.81,

-0.325, -0.565,
-0.23, -0.485,
-0.12, -0.56,

-0.32, -0.56,
-0.41, -0.38,
-0.23, -0.475,

-0.225, -0.465,
-0.125, -0.33,
-0.07, -0.405,

-0.21, -0.48,
-0.08, -0.405,
-0.115, -0.53,

-0.115, -0.545,
-0.065, -0.41,
0.015, -0.485,

0.015, -0.635,
-0.105, -0.57,
0.02, -0.495,

0.025, -0.5,
0.025, -0.625,
0.155, -0.57,

0.16, -0.575,
0.035, -0.815,
0.025, -0.625,

0.095, -0.715,
0.165, -0.81,
0.17, -0.7,

0.17, -0.8,
0.185, -0.58,
0.36, -0.575,

-0.105, -0.81,
-0.035, -0.735,
0.02, -0.82,

0.03, -0.815,
0.085, -0.745,
0.17, -0.81,

0.28, -0.725,
0.475, -0.64,
0.38, -0.795,

0.38, -0.8,
0.405, -0.855,
0.475, -0.81,

0.475, -0.815,
0.385, -0.795,
0.475, -0.65,

0.38, -0.66,
0.275, -0.71,
0.38, -0.575,

0.38, -0.655,
0.475, -0.64,
0.4, -0.535,

0.38, -0.55,
0.325, -0.335,
0.265, -0.475,

0.34, -0.335,
0.45, -0.345,
0.375, -0.54,

0.45, -0.335,
0.34, -0.33,
0.405, -0.045,

0.41, -0.03,
0.19, -0.1,
0.275, 0.025,

0.39, 0,
0.39, 0.135,
0.015, 0.225,

0.395, 0.14,
0.395, 0.085,
0.44, 0.12,

0.4, 0.065,
0.45, 0.125,
0.555, -0.035,

0.62, 0.16,
0.57, -0.04,
0.72, -0.045,

0.565, -0.05,
0.715, -0.06,
0.645, -0.145,

0.715, -0.06,
0.645, -0.16,
0.74, -0.17,

0.415, 0.215,
0.45, 0.325,
0.295, 0.325,

0.29, 0.315,
0.255, 0.185,
0.195, 0.195,

0.295, 0.32,
0.255, 0.19,
0.445, 0.14,

0.41, 0.205,
0.61, 0.175,
0.565, -0.045,

0.4, 0.225,
0.45, 0.335,
0.3, 0.335,

0.01, 0.145,
0.01, 0.215,
0.36, 0,

0.02, 0.13,
0.15, 0.075,
0.115, 0,

0.155, 0.08,
0.13, 0.015,
0.265, 0.03,

0.27, 0.035,
0.125, -0.005,
0.19, -0.1,

0.1, 0.005,
0.035, -0.105,
0.155, -0.105,

0.17, -0.12,
0.135, -0.19,
0.24, -0.21,

0.24, -0.22,
0.165, -0.31,
0.32, -0.315,

0.17, -0.325,
0.13, -0.4,
0.255, -0.465,

//0.17, -0.54,
//0.09, 0.01,
//0.03, -0.1,

-0.065, 0.015,
-0.005, -0.1,
0.01, 0.015,

-0.095, 0.005,
0.01, 0.13,
-0.13, 0.08,

-0.135, 0.065,
-0.24, 0.03,
-0.115, -0.01,

-0.375, -0.025,
0, 0.22,
0, 0.14,

-0.385, -0.015,
-0.38, 0.125,
-0.02, 0.22,

-0.245, 0.015,
-0.165, -0.09,
-0.11, -0.01,

-0.255, 0.01,
-0.375, -0.04,
-0.165, -0.1,

-0.37, -0.065,
-0.29, -0.325,
-0.415, -0.36,

-0.275, -0.335,
-0.21, -0.245,
-0.13, -0.315,

-0.195, -0.21,
-0.145, -0.125,
-0.1, -0.215,

-0.14, -0.125,
-0.005, -0.125,
-0.11, -0.21,

-0.09, -0.215,
-0.12, -0.305,
-0.01, -0.315,

0.13, -0.205,
0.03, -0.31,
0.15, -0.31,

0.005, -0.135,
-0.095, -0.2,
0, -0.295,

0.02, -0.15,
0.015, -0.29,
0.125, -0.205,

-0.165, -0.13,
-0.36, -0.065,
-0.28, -0.305,

-0.535, -0.085,
-0.615, -0.185,
-0.685, -0.095,

-0.685, -0.095,
-0.71, -0.215,
-0.625, -0.19,

-0.44, 0.3,
-0.58, 0.175,
-0.395, 0.19,

-0.45, 0.31,
-0.3, 0.305,
-0.39, 0.2,

-0.3, 0.305,
-0.27, 0.285,
-0.38, 0.2,

-0.27, 0.28,
-0.385, 0.195,
-0.245, 0.18,

-0.27, 0.275,
-0.25, 0.18,
-0.185, 0.195,

-0.395, 0.175,
-0.57, 0.155,
-0.4, 0.035,

-0.57, 0.155,
-0.535, -0.055,
-0.41, 0.02,

-0.595, 0.155,
-0.69, -0.07,
-0.54, -0.07,

-0.135, 0.4,
-0.085, 0.34,
-0.12, 0.285,

-0.11, 0.295,
-0.03, 0.35,
-0.05, 0.275,

-0.115, 0.265,
-0.11, 0.21,
-0.005, 0.23,

//-0.05, 0.275,
//0, 0.345,
//0, 0.255,

0.02, 0.335,
0.05, 0.275,
0.01, 0.25,

0.07, 0.27,
0.13, 0.285,
0.03, 0.34,

0.06, 0.345,
0.155, 0.41,
0.14, 0.295,

0.005, 0.52,
0.01, 0.355,
0.155, 0.42,

0.145, 0.45,
0.1, 0.51,
0.015, 0.51,

0, 0.565,
0, 0.53,
0.09, 0.52,

-0.01, 0.53,
-0.095, 0.505,
-0.165, 0.42,

-0.095, 0.52,
0, 0.58,
0, 0.54,

-0.14, 0.395,
-0.125, 0.31,
-0.06, 0.335,

-0.405, -0.36,
-0.23, -0.46,
-0.14, -0.32,

-0.11, -0.33,
0.14, -0.53,
0.09, -0.33,

0.19, -0.13,
0.385, -0.065,
0.325, -0.29,

-0.005, 0.515,
-0.14, 0.415,
-0.025, 0.345,

0.17, -0.555,
0.16, -0.43,
0.365, -0.565,

-0.545, 0.155,
-0.4, 0.06,
-0.4, 0.17,

-0.36, 0.175,
-0.13, 0.2,
-0.21, 0.315,

0.075, 0.02,
-0.07, 0.025,
0.015, 0.11,

-0.12, -0.69,
-0.05, -0.71,
-0.12, -0.605,

-0.01, 0.33,
-0.115, 0.29,
-0.015, 0.255,

0.175, 0.405,
0.29, 0.335,
0.18, 0.285,

0.065, 0.24,
0.18, 0.21,
0.165, 0.27,

-0.005, -0.75,
-0.11, -0.6,
0.005, -0.64,

0.195, -0.34,
0.255, -0.44,
0.31, -0.33,

-0.145, -0.11,
-0.08, -0.01,
-0.015, -0.105,

-0.19, -0.235,
-0.14, -0.28,
-0.115, -0.225,

];

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // Set up actions for HTML UI 
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  var img = new Image();
  img.src = "Turtle.png"; 
  var ctx = document.getElementById('photo').getContext('2d');
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  };
}

var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];

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

  // Store the coordinates to g_points array
  //g_points.push([x, y]);
  //g_colors.push(g_selectedColor.slice());
  //g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  //if (x >= 0.0 && y >= 0.0) {      // First quadrant
    //g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  //} else if (x < 0.0 && y < 0.0) { // Third quadrant
    //g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //} else {                         // Others
    //g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  //}

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  var StartTime = performance.now();
  
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length;
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - StartTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
      console.log("Failed to get " + htmlID + " from HTML");
      return;
  }
htmlElm. innerHTML = text;
}
