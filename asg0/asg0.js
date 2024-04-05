// asg0.js
var ctx;

function main() {
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }
  
  ctx = canvas.getContext('2d'); // Assign to global variable
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var drawButton = document.getElementById('drawButton');
  drawButton.addEventListener('click', function() {
    handleDrawEvent();
  });

  var operationButton = document.getElementById('operationButton');
  operationButton.addEventListener('click', function() {
    handleDrawOperationEvent();
  });
}

function drawVector(v, color) {
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function handleDrawEvent() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  var x1 = parseFloat(document.getElementById('v1xInput').value);
  var y1 = parseFloat(document.getElementById('v1yInput').value);
  var v1 = new Vector3([x1, y1, 0]);
  
  var x2 = parseFloat(document.getElementById('v2xInput').value);
  var y2 = parseFloat(document.getElementById('v2yInput').value);
  var v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, 'red');
  drawVector(v2, 'blue');
}

function handleDrawOperationEvent() {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Get the values from the input fields for v1 and v2
  var x1 = parseFloat(document.getElementById('v1xInput').value);
  var y1 = parseFloat(document.getElementById('v1yInput').value);
  var x2 = parseFloat(document.getElementById('v2xInput').value);
  var y2 = parseFloat(document.getElementById('v2yInput').value);
  var v1 = new Vector3([x1, y1, 0]);
  var v2 = new Vector3([x2, y2, 0]);
  
  // Draw v1 in red and v2 in blue
  drawVector(v1, 'red');
  drawVector(v2, 'blue');
  
  // Read the selected operation and the scalar value
  var operation = document.getElementById('operation').value;
  var scalar = parseFloat(document.getElementById('scalar').value);
  
  // Perform the operation and draw the resulting vector(s)
  if (operation === 'add') {
    var v3 = new Vector3(v1.elements).add(v2);
    drawVector(v3, 'green');
  } else if (operation === 'subtract') {
    var v3 = new Vector3(v1.elements).sub(v2);
    drawVector(v3, 'green');
  } else if (operation === 'multiply') {
    var v3 = new Vector3(v1.elements).mul(scalar);
    var v4 = new Vector3(v2.elements).mul(scalar);
    drawVector(v3, 'green');
    drawVector(v4, 'green');
  } else if (operation === 'divide') {
    // Avoid division by zero
    if (scalar !== 0) {
      var v3 = new Vector3(v1.elements).div(scalar);
      var v4 = new Vector3(v2.elements).div(scalar);
      drawVector(v3, 'green');
      drawVector(v4, 'green');
    }
  }
}

main();
