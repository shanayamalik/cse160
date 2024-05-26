// Global Variables Related to UI Elements
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


function renderLlama(scale, textureNumBody, textureNumTail) {
    const scalePercent = scale / 100; // Convert percentage scale to decimal

    // Initialize the base matrix for the entire llama
    var baseMatrix = new Matrix4();
    baseMatrix.setScale(scalePercent, scalePercent, scalePercent);

    // Draw the body
    var body = new Cube();
    body.color = [0.776, 0.525, 0.259, 1.0];
    body.textureNum = textureNumBody;
    body.matrix = new Matrix4(baseMatrix).translate(-0.25, -0.25, 0);
    body.matrix.scale(0.5, 0.5, 0.75);
    body.render();

    // Draw the tail
    var tail = new Cube();
    tail.color = [1, 0.65, 0.65, 1.0];
    tail.textureNum = textureNumTail;
    tail.matrix = new Matrix4(baseMatrix).translate(-0.15, -0.15, 0.575);
    tail.matrix.scale(0.35, 0.5, 0.5);
    tail.render();

    var tail2 = new Cube();
    tail2.color = [0.945, 0.761, 0.490, 1.0];
    tail2.textureNum = textureNumTail;
    tail2.matrix = new Matrix4(baseMatrix).translate(-0.15, -0.1, 0.575);
    tail2.matrix.rotate(-g_tailAngle, 1, 0, 0);
    tail2.matrix.scale(0.15, 0.55, 0.15);
    tail2.render();

    // Draw the neck
    var neck = new Cube();
    neck.color = [0.992, 0.961, 0.886, 1.0];
    neck.textureNum = textureNumBody;
    neck.matrix = new Matrix4(baseMatrix).translate(-0.25, 0.2, 0.075);
    neck.matrix.rotate(-g_neckAngle, 1, 0, 0);
    neck.matrix.scale(0.25, 0.45, 0.25);
    neck.render();

    // Draw the head
    var head = new Cube();
    head.color = [0.945, 0.761, 0.490, 1.0];
    head.textureNum = textureNumBody;
    head.matrix = new Matrix4(baseMatrix).translate(-0.25, 0.65, 0.075);
    head.matrix.rotate(g_headAngle, 0, 1, 0);
    head.matrix.scale(0.35, 0.3, 0.45);
    head.render();

    // Draw the nose
    var nose = new Cube();
    nose.color = [0.35, 0.35, 0.35, 1.0];
    nose.textureNum = textureNumBody;
    nose.matrix = new Matrix4(baseMatrix).translate(-0.25, 0.95, 0.05);
    nose.matrix.scale(0.1, 0.1, 0.2);
    nose.render();

    // Draw ears (left and right)
    var ear = new Tetrahedron();
    ear.color = g_color_1;
    ear.textureNum = textureNumBody;
    ear.matrix = new Matrix4(baseMatrix).translate(0, 1.0, 0.075);
    ear.matrix.scale(0.1, 0.3, 0.1);
    ear.matrix.rotate(-g_earsAngle, 1, 0, 0);
    ear.render();

    var ear2 = new Tetrahedron();
    ear2.color = g_color_1;
    ear2.textureNum = textureNumBody;
    ear2.matrix = new Matrix4(baseMatrix).translate(-0.5, 1.0, 0.075);
    ear2.matrix.scale(0.1, 0.3, 0.1);
    ear2.matrix.rotate(-g_earsAngle, 1, 0, 0);
    ear2.render();

    // Draw four legs
    function drawLeg(x, y, z) {
        var leg = new Cube();
        leg.color = [0.992, 0.961, 0.886, 1.0];
        leg.textureNum = textureNumBody;
        leg.matrix = new Matrix4(baseMatrix).translate(x, y, z);
        leg.matrix.scale(0.05, -0.45, 0.05);
        leg.matrix.rotate(g_legsAngle, 1, 0, 0);
        leg.render();
    }

    drawLeg(-0.2, -0.75, 0.05); // Front left
    drawLeg(-0.3, -0.75, 0.05); // Front right
    drawLeg(-0.2, -0.75, 0.5);  // Back left
    drawLeg(-0.3, -0.75, 0.5);  // Back right
}

function renderLlama() 
{
    renderLlama3(0, -0.5,50, 2, 3, 0);
}

function renderLlama3(x, y, scale, textureNumBody, textureNumTail, z = 0) {
    const scalePercent = scale / 100; 

    // Initialize the base matrix to scale and position the entire llama
    var baseMatrix = new Matrix4();
    baseMatrix.setScale(scalePercent, scalePercent, scalePercent);
    baseMatrix.translate(x, y, z);
    //baseMatrix.translate(x, y, 0); 

    // Draw the body
    var body = new Cube();
    body.color = [0.776, 0.525, 0.259, 1.0];
    body.textureNum = textureNumBody;
    body.matrix = new Matrix4(baseMatrix);
    body.matrix.translate(-0.25, -0.25, 0);
    body.matrix.scale(0.5, 0.5, 0.75);
    body.render();

    // Draw the tail
    var tail = new Cube();
    tail.color = [1, 0.65, 0.65, 1.0];
    tail.textureNum = textureNumTail;
    tail.matrix = new Matrix4(baseMatrix);
    tail.matrix.translate(-0.05, 0.2, 0.75);
    tail.matrix.scale(0.15, 0.2, 0.15);
    tail.render();

    // Draw the neck
    var neck = new Cube();
    neck.color = [0.992, 0.961, 0.886, 1.0];
    neck.textureNum = -2;
    neck.matrix = new Matrix4(baseMatrix);
    neck.matrix.translate(-0.2, 0.2, 0);
    neck.matrix.scale(0.25, 0.45, 0.25);
    neck.render();

    // Draw the head
    var head = new Cube();
    head.color = [0.945, 0.761, 0.490, 1.0];
    head.textureNum = -2;
    head.matrix = new Matrix4(baseMatrix);
    head.matrix.translate(-0.25, 0.45, -0.05);
    head.matrix.scale(0.35, 0.3, 0.45);
    head.render();

    // Draw the ears
    var ear = new Cube(); // Left ear
    ear.color = [0.851, 0.475, 0.043, 1.0];
    ear.textureNum = -2;
    ear.matrix = new Matrix4(baseMatrix);
    ear.matrix.translate(0.05, 0.7, -0.05);
    ear.matrix.scale(0.1, 0.2, 0.1);
    ear.render();

    var ear2 = new Cube(); // Right ear
    ear2.color = [0.851, 0.475, 0.043, 1.0];
    ear2.textureNum = -2;
    ear2.matrix = new Matrix4(baseMatrix);
    ear2.matrix.translate(-0.3, 0.7, -0.05);
    ear2.matrix.scale(0.1, 0.2, 0.1);
    ear2.render();

    // Draw four legs
    var legPositions = [
        [0.15, -0.5, 0.1], 
        [-0.25, -0.5, 0.1],  // Front legs
        [0.15, -0.5, 0.55], 
        [-0.25, -0.5, 0.55]  // Back legs
    ];
    legPositions.forEach(pos => {
        var leg = new Cube();
        leg.color = [0.992, 0.961, 0.886, 1.0];
        leg.textureNum = -2;
        leg.matrix = new Matrix4(baseMatrix);
        leg.matrix.translate(pos[0], pos[1], pos[2]);
        leg.matrix.scale(0.1, 0.5, 0.1);
        leg.render();
    });
}
