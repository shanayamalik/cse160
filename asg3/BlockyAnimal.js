

// Global Variables Related to UI Elements
let g_globalAngle=0; 
let g_vertAngle=0;
let g_neckAngle=0;
let g_headAngle=0;
let g_legsAngle=0;
let g_earsAngle=0;
let g_tailAngle=0;
let g_neckAnimation=false;
let g_headAnimation=false;
let g_legsAnimation=false;
let g_earsAnimation=false;
let g_tailAnimation=false;
let dragging = false;
let currentAngleX=-10;
let currentAngleY=0;
let g_modelY=0;
let g_pokeAnimation = false;
let g_pokeTime = 0;  
let g_nose_size = 2;

let g_color_1 = [0.851, 0.475, 0.043, 1.0];
let g_color_2 = [0, 1, 0, 1.0];
//let g_color_3 = [0.65, 0.75, 0.75, 1.0];


/*
function rotateScene(dx, dy) {
  currentAngleX += dx;
  currentAngleY += dy;
  renderAllShapes(); // Update the scene rendering
}
*/

function resetRotation() {
  currentAngleX = 0;
  currentAngleY = 0;
  console.log('Rotation Reset');
  applyRotation();
}

function rotateScene(dx, dy) {
  // Update angles based on mouse movement
  currentAngleX += dx;
  currentAngleY += dy;

  let smoothingFactor = 0.1;  
  let targetAngleX = currentAngleX + dx;  
  let targetAngleY = currentAngleY + dy;

  currentAngleX = smoothingFactor * targetAngleX + (1 - smoothingFactor) * currentAngleX;
  currentAngleY = smoothingFactor * targetAngleY + (1 - smoothingFactor) * currentAngleY;

  // Consolidate and apply rotation
  applyRotation();
}

function applyRotation() {
  var globalRotMat = new Matrix4();
  globalRotMat.setRotate(currentAngleY, 1, 0, 0);
  globalRotMat.rotate(currentAngleX, 0, 1, 0);
  globalRotMat.translate(0, 0, -0.5);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  renderAllShapes();  // Update the scene rendering
}

function updatePokeAnimation() {
    if (g_pokeAnimation) {
        console.log("poke", g_pokeTime)
        g_pokeTime += 1
        g_legsAnimation = 1
        g_pokeTime++; // Increment the tick counter

      // Switch colors every 10 ticks
      if (g_pokeTime % 20 < 10) {
          g_color_1 = [0.761, 0.424, 0.035, 1.0];

      } else {
          g_color_1 = [0.851, 0.475, 0.043, 1.0];
      }
      // Switch colors every 10 ticks
      if (g_pokeTime % 60 < 10) {
          g_nose_size = 1
      } else {
          g_nose_size = 2
      }


        if (g_pokeTime > 1000) { // Animation lasts 1 second
            console.log("poke stop")
          g_legsAnimation = 0
          g_pokeAnimation = false;
            g_color_1 = [1,0,0,1.0]
        }
        renderAllShapes();
    }
}





function cloneMatrix4(matrix) {
    var newMatrix = new Matrix4();
    newMatrix.elements = new Float32Array(matrix.elements);   
    return newMatrix;
}


function renderLlama() {

  // Draw the body cube
  var body = new Cube();
  body.color = [0.776, 0.525, 0.259, 1.0];
  body.textureNum = 2;
  //body.color = g_color_3;
  //ear.color = g_color_1;
  body.matrix.setTranslate(-0.25, -0.25, 0.0);
  var bodyCoordinatesMat=new Matrix4(body.matrix);
  body.matrix.scale(0.5, .5, .75);
  body.render();

  // Draw the tail
  var tail = new Cube();
  tail.textureNum = 3;
  tail.color = [1, 0.65, 0.65, 1.0];
  tail.matrix = cloneMatrix4(bodyCoordinatesMat);
  tail.matrix.translate(0.075, 0.10, 0.75);
  tail.matrix.scale(0.35, 0.5, 0.5);

  // Draw the tail
  var tail2 = new Cube();
  tail2.color =[0.945, 0.761, 0.490, 1.0];
  tail2.textureNum = 3;
  tail2.matrix = bodyCoordinatesMat;
  tail2.matrix.translate(0.075, 0.10, 0.75);
  tail2.matrix.rotate(-g_tailAngle,1,0,0);
  tail2.matrix.scale(0.15, 0.55, 0.15);
  tail2.render();

  // Draw a neck
  var neck = new Cube();
  neck.color = [0.992, 0.961, 0.886, 1.0];
  neck.textureNum = -2;
  neck.matrix = bodyCoordinatesMat;
  neck.matrix.setTranslate(0.0, 0.10, 0.05); 
  neck.matrix.rotate(-g_neckAngle,1,0,0);
  var neckCoordinatesMat=new Matrix4(neck.matrix);
  neck.matrix.scale(0.25, 0.45, 0.25);
  neck.matrix.translate(-0.5,0,0);
  neck.render();

  // Draw a head
  var head = new Cube();
  head.textureNum = -2;
  head.color = [0.945, 0.761, 0.490, 1.0];
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
  nose.textureNum = -2;
  nose.matrix = cloneMatrix4(headCoordinatesMat);
  nose.matrix.translate(0, 0.45, -0.10);
  if (g_nose_size === 1)
    nose.matrix.scale(0.15, 0.10, 0.25);
  else
   nose.matrix.scale(0.10, 0.10, 0.10);
  nose.matrix.translate(-0.5, -4.25, -0.0001);
  nose.render();

  // Draw a nose
  var nose2 = new Cube();
  nose.color = [0.35, 0.35, 0.35, 1.0];
  nose2.matrix = headCoordinatesMat;
  nose2.textureNum = -2;
  nose2.matrix.translate(0, 0.45, -0.10);
  nose2.matrix.scale(0.15, 0.10, 0.25);
  nose2.matrix.translate(-0.5, -4.25, -0.0001);

  // Draw ears
  var ear = new Tetrahedron(); // Left ear
  ear.color = g_color_1;
  ear.textureNum = -2;
  ear.matrix = neckCoordinatesMat;
  ear.matrix = headCoordinatesMat;
  ear.matrix.translate(1.0, 2.65, -0.20);
  ear.matrix.scale(0.4, 1.5, 0.85);
  ear.matrix.rotate(-g_earsAngle,1,0,0);
  //var earsCoordinatesMat=new Matrix4(ears.matrix);
  ear.render();

  var ear2 = new Tetrahedron(); // Right ear
  ear2.color = g_color_1;
  ear2.textureNum = -2;
  ear2.matrix = headCoordinatesMat;
  ear2.matrix.translate(-2.5, 0, -0.10);
  ear2.matrix.scale(0.8, 1.0, 0.85);
  ear2.matrix.rotate(-g_earsAngle,1,0,0);  
  //var earsCoordinatesMat=new Matrix4(ears.matrix);
  ear2.render();

  // Draw four legs
  var leg = new Cube(); // Front left
  leg.color = [0.992, 0.961, 0.886, 1.0];
  leg.textureNum = -2;
  leg.matrix = bodyCoordinatesMat;
  leg.matrix.setTranslate(0.05, -0.2, 0.05); 
  leg.matrix.rotate(g_legsAngle,1,0,0);
  leg.matrix.scale(0.05, -0.45, 0.05);
  leg.render();

  var leg2 = new Cube(); // Front right
  leg2.color = [0.992, 0.961, 0.886, 1.0];
  leg2.textureNum = -2;
  leg2.matrix = bodyCoordinatesMat;
  leg2.matrix.setTranslate(-0.15, -0.2, 0.05); 
  leg2.matrix.rotate(-g_legsAngle,1,0,0);
  leg2.matrix.scale(0.05, -0.45, 0.05);
  leg2.render();

  var leg3 = new Cube(); // Back left
  leg3.color = [0.992, 0.961, 0.886, 1.0];
  leg3.textureNum = -2;
  leg3.matrix = bodyCoordinatesMat;
  leg3.matrix.setTranslate(0.05, -0.2, 0.5); 
  leg3.matrix.rotate(-g_legsAngle,1,0,0);
  leg3.matrix.scale(0.05, -0.45, 0.05);
  leg3.render();

  var leg4 = new Cube(); // Back right
  leg4.color = [0.992, 0.961, 0.886, 1.0];
  leg4.textureNum = -2;
  leg4.matrix = bodyCoordinatesMat;
  leg4.matrix.setTranslate(-0.15, -0.2, 0.5); 
  leg4.matrix.rotate(g_legsAngle,1,0,0);
  leg4.matrix.scale(0.05, -0.45, 0.05);
  leg4.render();
}
