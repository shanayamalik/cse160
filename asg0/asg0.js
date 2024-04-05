// asg0.js
var ctx;

function main() {
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var drawButton = document.getElementById('drawButton');
  drawButton.addEventListener('click', handleDrawEvent);

  var operationButton = document.getElementById('operationButton');
  operationButton.addEventListener('click', handleDrawOperationEvent);
}

function drawVector(v, color) {
  ctx.beginPath();
  ctx.moveTo(200, 200); // Assuming the center is (200, 200)
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
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var x1 = parseFloat(document.getElementById('v1xInput').value);
  var y1 = parseFloat(document.getElementById('v1yInput').value);
  var v1 = new Vector3([x1, y1, 0]);

  var x2 = parseFloat(document.getElementById('v2xInput').value);
  var y2 = parseFloat(document.getElementById('v2yInput').value);
  var v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, 'red');
  drawVector(v2, 'blue');

  var operation = document.getElementById('operation').value;
  var scalar = parseFloat(document.getElementById('scalar').value);

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
    if (scalar !== 0) {
      var v3 = new Vector3(v1.elements).div(scalar);
      var v4 = new Vector3(v2.elements).div(scalar);
      drawVector(v3, 'green');
      drawVector(v4, 'green');
    }
  } else if (operation === 'magnitude') {
    console.log('Magnitude of v1:', v1.magnitude());
    console.log('Magnitude of v2:', v2.magnitude());
  } else if (operation === 'normalize') {
    v1.normalize();
    v2.normalize();
    drawVector(v1, 'green');
    drawVector(v2, 'green');
  } else if (operation === 'angleBetween') {
    angleBetween(v1, v2);
  }
}

function angleBetween(v1, v2) {
  if (v1.magnitude() === 0 || v2.magnitude() === 0) {
    console.log("One of the vectors is a zero vector. Angle is undefined.");
    return;
  }

  let dotProduct = Vector3.dot(v1, v2);
  let magnitudeProduct = v1.magnitude() * v2.magnitude();
  let angle = Math.acos(dotProduct / magnitudeProduct);

  let angleDegrees = angle * (180 / Math.PI);

  console.log(`Angle: ${angleDegrees.toFixed(2)}`);
  return angleDegrees;
}

main();
