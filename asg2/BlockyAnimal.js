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
  //identityM.translate(0, 0, 10);
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global Variables Related to UI Elements
let g_globalAngle=45; 
let g_vertAngle=-10;
let g_neckAngle=0;
let g_headAngle=0;
let g_legsAngle=0;
let g_earsAngle=0;
let g_seconds=0;
let g_neckAnimation=false;
let g_headAnimation=false;
let g_legsAnimation=false;
let g_earsAnimation=false;
let dragging = false;
let currentAngleX=0;
let currentAngleY=0;
let g_modelY=0;
let g_pokeAnimation = false;
let g_pokeTime = 0;  

function addActionsForHtmlUI() {
document.getElementById('neckSlide').addEventListener('mousemove', function() {g_neckAngle = this.value; renderAllShapes(); });
  
document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes(); });
  
document.getElementById('legsSlide').addEventListener('mousemove', function() {g_legsAngle = this.value; renderAllShapes(); });
  
document.getElementById('earsSlide').addEventListener('mousemove', function() {g_earsAngle = this.value; renderAllShapes(); });
  
document.getElementById('animationneckOnButton').onclick = function() {g_neckAnimation=true;};
  
document.getElementById('animationneckOffButton').onclick = function() {g_neckAnimation=false;};
  
document.getElementById('animationheadOnButton').onclick = function() {g_headAnimation=true;};
  
document.getElementById('animationheadOffButton').onclick = function() {g_headAnimation=false;};
  
document.getElementById('animationlegsOnButton').onclick = function() {g_legsAnimation=true;};
  
document.getElementById('animationlegsOffButton').onclick = function() {g_legsAnimation=false;};

document.getElementById('animationearsOnButton').onclick = function() {g_earsAnimation=true;};

document.getElementById('animationearsOffButton').onclick = function() {g_earsAnimation=false;};
  document.getElementById('angleSlide').addEventListener('input', function() {
      g_globalAngle = this.value;
      renderAllShapes();
  });

  document.getElementById('vertSlide').addEventListener('input', function() {
      g_vertAngle = this.value;
      renderAllShapes();
  });

document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
  
document.getElementById('vertSlide').addEventListener('mousemove', function() {g_vertAngle = this.value; renderAllShapes(); });

  canvas.onmousedown = function(ev) {
    ev.preventDefault();  // Prevent any default action
    ev.stopPropagation(); 
    let x = ev.clientX;
    let y = ev.clientY;
    // Check if the cursor is inside the canvas bounds
    let rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;

      if (ev.shiftKey) {
          g_pokeAnimation = true;
          g_pokeTime = 0; // Reset animation time
          renderAllShapes();
      }
    }
  };

  canvas.onmouseup = function(ev) {
    dragging = false;
  };

  canvas.onmousemove = function(ev) {
    let x = ev.clientX;
    let y = ev.clientY;
    if (dragging) {
      let factor = 500 / canvas.height; // Adjust rotation speed
      let dx = factor * (x - lastX);
      let dy = factor * (y - lastY);
      // Passing the angles to rotate the scene
      rotateScene(dx, dy);
    }
    lastX = x;
    lastY = y;
  };
}

function rotateScene(dx, dy) {
  currentAngleX += dx;
  currentAngleY += dy;
  renderAllShapes(); // Update the scene rendering
}

function updatePokeAnimation() {
    if (g_pokeAnimation) {
        g_pokeTime += 0.02; // Increment time
        g_modelY = Math.abs(Math.sin(g_pokeTime * Math.PI * 2) * 0.5); // Sin wave for jump
        if (g_pokeTime > 1) { // Animation lasts 1 second
            g_pokeAnimation = false;
            g_modelY = 0; // Reset position
        }
        renderAllShapes();
    }
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
    
    updatePokeAnimation();
    // Draw everything
    renderAllShapes();

    // Tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_neckAnimation) {
        g_neckAngle = (20 * Math.sin(g_seconds));
    }
    if (g_headAnimation) {
        g_headAngle = (25 * Math.sin(3 * g_seconds));
    }
    if (g_legsAnimation) {
          g_legsAngle = (25 * Math.sin(3 * g_seconds));
    }
    if (g_earsAnimation) {
        g_earsAngle = (5 * Math.sin(4 * g_seconds));
    }
}

function renderAllShapes() {
  var StartTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat=new Matrix4()
  globalRotMat.setRotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_vertAngle, 1, 0, 0);
  globalRotMat.translate(0, 0, -0.5);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  var globalRotMat = new Matrix4();
  globalRotMat.setRotate(currentAngleY, 1, 0, 0); // Rotation about X-axis
  globalRotMat.rotate(currentAngleX, 0, 1, 0); // Rotation about Y-axis
  globalRotMat.translate(0, 0, -0.5); // Existing translation
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the body cube
  var body = new Cube();
  body.color = [0.65, 0.75, 0.75, 1.0];
  body.matrix.setTranslate(-0.25, -0.25, 0.0);
  var bodyCoordinatesMat=new Matrix4(body.matrix);
  body.matrix.scale(0.5, .5, .75);
  body.render();

  // Draw the tail
  var tail = new Cube();
  tail.color = [1, 0.65, 0.65, 1.0];
  tail.matrix = bodyCoordinatesMat;
  tail.matrix.translate(0.075, 0.10, 0.75);
  tail.matrix.scale(0.35, 0.5, 0.5);
  tail.render();

  // Draw a neck
  var neck = new Cube();
  neck.color = [0.7, 0.7, 0.7, 1.0];
  neck.matrix = bodyCoordinatesMat;
  neck.matrix.setTranslate(0.0, 0.10, 0.05); 
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
  var headCoordinatesMat=new Matrix4(head.matrix);
  head.matrix.scale(0.35, 0.3, 0.45);
  head.matrix.translate(-0.5, 0, -0.0001);
  head.render();

  // Draw a nose
  var nose = new Cube();
  nose.color = [0.35, 0.35, 0.35, 1.0];
  nose.matrix = headCoordinatesMat;
  nose.matrix.translate(0, 0.45, -0.10);
  nose.matrix.scale(0.15, 0.10, 0.25);
  nose.matrix.translate(-0.5, -4.25, -0.0001);
  nose.render();

  // Draw ears
  var ear = new Tetrahedron(); // Left ear
  ear.color = [1, 0, 0, 1.0];
  ear.matrix = neckCoordinatesMat;
  ear.matrix = headCoordinatesMat;
  ear.matrix.translate(0.85, 2.65, -0.20);
  ear.matrix.scale(0.85, 0.75, 0.85);
  ear.matrix.rotate(-g_earsAngle,1,0,0);
  //var earsCoordinatesMat=new Matrix4(ears.matrix);
  ear.render();
  
  var ear2 = new Tetrahedron(); // Right ear
  ear2.color = [0, 1, 0, 1.0];
  ear2.matrix = headCoordinatesMat;
  ear2.matrix.translate(-1.25, -0.1, -0.10);
  ear2.matrix.scale(0.85, 0.75, 0.85);
  ear2.matrix.rotate(-g_earsAngle,1,0,0);  
  //var earsCoordinatesMat=new Matrix4(ears.matrix);
  ear2.render();
  
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
