//TODO: Add simple story or game to world.
//TODO: Beautiful world or OBJ Loader or Terrain or anything else that excites you to work on. 
//TODO: World is implemented. There is some interesting world to walk around.

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  attribute vec4 a_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;  // color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // texture coordinates
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // texture 0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // texture 1
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // texture 2
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV); // texture 3
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0); // error
    }
  }`

// Global Variables (UI or data passed to GLSL)
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Samplers = [];
let u_whichTexture;
let g_horizontalAngle = 0.0;
let g_verticalAngle = 0.0;

// Global Variables for Game Logic
let score = 0;
let gameDuration = 120; // Time in seconds, adjust as necessary
let gameStartTime = 0;
let gameActive = false;

const setupWebGL = () => {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Enable blending and set blend function
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.enable(gl.DEPTH_TEST);
}

const connectVariablesToGLSL = () => {
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

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  u_Samplers.push(u_Sampler0);

  let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  u_Samplers.push(u_Sampler1);

  let u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }
  u_Samplers.push(u_Sampler2);

  let u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }
  u_Samplers.push(u_Sampler3);

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
}

const addActionsForHtmlUI = () => {
  document.getElementById('cameraAngle').addEventListener('input', (event) => {
      g_horizontalAngle = parseFloat(event.target.value);
      renderAllShapes();
  });

  canvas.addEventListener('mousedown', (ev) => {
      ev.preventDefault();
      let rect = ev.target.getBoundingClientRect();
      if (rect.left <= ev.clientX && ev.clientX < rect.right && rect.top <= ev.clientY && ev.clientY < rect.bottom) {
          lastX = ev.clientX;
          lastY = ev.clientY;
          dragging = true;
      }
  });

  canvas.addEventListener('mousemove', (ev) => {
      if (dragging) {
          let dx = (ev.clientX - lastX) * 10.0 * Math.PI / canvas.width;
          let dy = (ev.clientY - lastY) * 10.0 * Math.PI / canvas.height;
          currentAngleX += dx;
          currentAngleY += dy;
          renderAllShapes();
          lastX = ev.clientX;
          lastY = ev.clientY;
      }
  });

  canvas.addEventListener('mouseup', () => {
      dragging = false;
  });
  
}

let images = {
  0: 'ground.jpg',
  1: 'cloud-sky.jpg',
  2: 'llama-skin.jpg',
  3: 'llama-tail.jpg',
}

function initTextures() {
  for (let i = 0; i < Object.keys(images).length; i++) {
    const image = new Image();
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }

    image.onload = function(){ sendImageToTexture(image, i); };
    // Tell the browser to load an Image
    image.src = images[i];
    //console.log(image.src);
  }

  return true;
}

function startGame() {
    gameActive = true;
    score = 0;
    gameStartTime = performance.now();
    requestAnimationFrame(tick); // Start the game loop if not already running
}

function endGame() {
    gameActive = false;
    console.log(`Game Over! Your score: ${score}`); // Use console.log or another method to show the score
}

function updateGame() {
    if (!gameActive) return;

    const currentTime = performance.now();
    if ((currentTime - gameStartTime) / 1000 > gameDuration) {
        endGame();
    }
}

function sendImageToTexture(image, textureNum) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Activate texture unit0
  gl.activeTexture(gl.TEXTURE0 + textureNum);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit to the sampler
  gl.uniform1i(u_Samplers[textureNum], textureNum);

}

const g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0 - g_startTime;

function eatShrub(x, y) {
    if (g_map[x][y] > 0) {
        g_map[x][y] = 0; // Assume the shrub is removed once eaten
        score += 10; // Increment score by 10, adjust scoring as needed
        renderAllShapes(); // Redraw the scene to reflect changes
    }
}

function checkCollisionWithShrub() {
    let x = Math.floor(g_eye[0] + 16); // Adjusting for the shrub positions
    let y = Math.floor(g_eye[2] + 16); // Adjusting for the shrub positions
    eatShrub(x, y);
}

const tick = () => {
  g_seconds = performance.now()/1000.0 - g_startTime;
  // console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  renderLlama();
  if (Math.random() > 0.950) {
    x = Math.floor(Math.random()*32);
    y = Math.floor(Math.random()*32);
    if (g_map[x][y] > 0) {
      g_map[x][y] += Math.round(Math.random()*2) - 1;
    } else {
      g_map[x][y] = 1;
    }   
  }
  drawMap();
  requestAnimationFrame(tick);
}


const convertCoordinateEventToGL = (ev) => {
  let x = ev.clientX; // x coordinate of a mouse pointer
  let y = ev.clientY; // y coordinate of a mouse pointer
  let rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];
}

function updateAnimationAngles() {
    g_neckAngle = (20 * Math.sin(g_seconds));  
    g_headAngle = (25 * Math.sin(3 * g_seconds));
    g_legsAngle = (25 * Math.sin(3 * g_seconds));
    g_earsAngle = (5 * Math.sin(4 * g_seconds));
    g_tailAngle = (5 * Math.sin(4 * g_seconds));
}

function keydown(ev) {
    switch (ev.keyCode) {
        case 39: // Right arrow
            g_eye[0] += 0.2;
            break;
        case 37: // Left arrow
            g_eye[0] -= 0.2;
            break;
        case 81: // Q - rotate left
            g_horizontalAngle += 5; 
            break;
        case 69: // E - rotate right
            g_horizontalAngle -= 5; 
            break;
        case 87: // W - move forward
            g_eye[2] -= 0.2; // Moves the camera forward along the Z-axis
            break;
        case 65: // A - move left
            g_eye[0] -= 0.2; // Moves the camera left along the X-axis
            break;
        case 83: // S - move backward
            g_eye[2] += 0.2; // Moves the camera backward along the Z-axis
            break;
        case 68: // D - move right
            g_eye[0] += 0.2; // Moves the camera right along the X-axis
            break;
    }
    renderAllShapes();
    // console.log(ev.keyCode);
}

let g_camera = new Camera();

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

g_map = new Array(32).fill(null).map(() => new Array(32).fill(0));

function drawMap() {
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            //console.log(x, y);
            if (x % 4 == 0 && y % 4 == 0) {
              if (g_map[x][y] > 0) {
                var shrub = new Cube();
                shrub.color = [0, 1, 0, 1];
                shrub.textureNum = 0;
                //shrub.matrix.translate(0, -0.75, 0);
                shrub.matrix.translate(x - 14, -0.5, y - 14);
                shrub.matrix.scale(3.75, g_map[x][y], 3.75);
                shrub.render();
              }
            }
        }
    }
}


const renderAllShapes = () => {
  let startTime = performance.now();
  gl.clearColor(0, 0, 0, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const globalRotateMatrix = new Matrix4().rotate(g_horizontalAngle + currentAngleX, 0, 1, 0);
  globalRotateMatrix.rotate(g_verticalAngle + currentAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateMatrix.elements);
  
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1 * canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  const ground = new Cube();
  ground.color = [1,0,0,1];
  ground.textureNum = 0;
  ground.matrix.translate(0, -0.5, 0);
  ground.matrix.scale(128, 0, 128);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  const sky = new Cube();
  sky.color = [1,1,1,1];
  sky.textureNum = 1;
  sky.matrix.scale(128, 128, 128);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();
  
  let duration = performance.now() - startTime;
  sendTextToHTML(`ms: ${Math.floor(duration)} fps: ${Math.floor(10000/duration)/10}`, 'info');
}

const sendTextToHTML = (text, htmlTag) => {
  let htmlObj = document.getElementById(htmlTag);
  if (!htmlObj) {
    console.log(`Failed to get ${htmlTag} from HTML`);
    return;
  }
  htmlObj.innerHTML = text;
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  requestAnimationFrame(tick);
}
