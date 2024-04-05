// asg0.js
function main() {
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }
  
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var drawButton = document.getElementById('drawButton');
  drawButton.addEventListener('click', function() {
    handleDrawEvent(ctx);
  });
}

function drawVector(v, color, ctx) {
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function handleDrawEvent(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  var x1 = parseFloat(document.getElementById('v1xInput').value);
  var y1 = parseFloat(document.getElementById('v1yInput').value);
  var v1 = new Vector3([x1, y1, 0]);
  
  var x2 = parseFloat(document.getElementById('v2xInput').value);
  var y2 = parseFloat(document.getElementById('v2yInput').value);
  var v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, 'red', ctx);
  drawVector(v2, 'blue', ctx);
}

function handleDrawOperationEvent(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  var x1 = parseFloat(document.getElementById('v1xInput').value);
  var y1 = parseFloat(document.getElementById('v1yInput').value);
  var v1 = new Vector3([x1, y1, 0]);
  
  var x2 = parseFloat(document.getElementById('v2xInput').value);
  var y2 = parseFloat(document.getElementById('v2yInput').value);
  var v2 = new Vector3([x2, y2, 0]);
  
  var operation = document.getElementById('operation').value;
  var scalar = parseFloat(document.getElementById('scalar').value);

  drawVector(v1, 'red', ctx);
  drawVector(v2, 'blue', ctx);

  switch(operation) {
    case 'add':
      var v3 = v1.add(v2);
      drawVector(v3, 'green', ctx);
      break;
    case 'subtract':
      var v3 = v1.sub(v2);
      drawVector(v3, 'green', ctx);
      break;
    case 'multiply':
      var v3 = v1.mul(scalar);
      var v4 = v2.mul(scalar);
      drawVector(v3, 'green', ctx);
      drawVector(v4, 'green', ctx);
      break;
    case 'divide':
      var v3 = v1.div(scalar);
      var v4 = v2.div(scalar);
      drawVector(v3, 'green', ctx);
      drawVector(v4, 'green', ctx);
      break;
  }
}

document.getElementById('operationButton').addEventListener('click', function() {
  handleDrawOperationEvent(ctx);
});

// Invoke the main function to set everything up
main();
