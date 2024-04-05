// asg0.js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // Set the canvas background to black instead of a blue rectangle
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set up the event listener for the draw button here
  var drawButton = document.getElementById('drawButton');
  drawButton.addEventListener('click', function() {
      handleDrawEvent(ctx);
  });

  // Instantiate vector v1 with z coordinate set to 0
  //var v1 = new Vector3([2.25, 2.25, 0]);

  // Call drawVector(v1, "red")
  //drawVector(v1, 'red', ctx);

}

function drawVector(v, color, ctx) {
    // Begin a new path for the vector
    ctx.beginPath();

    // Move to the center of the canvas
    ctx.moveTo(200, 200); // Canvas is 400x400, so the center is at (200, 200)

    // Scale the vector's coordinates by 20 and draw the line
    ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);

    // Set the stroke color
    ctx.strokeStyle = color;

    // Set the line width
    ctx.lineWidth = 1;

    // Draw the vector
    ctx.stroke();
}

function handleDrawEvent(ctx) {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Get the values from the input fields for v1
  var x1 = parseFloat(document.getElementById('xInputV1').value);
  var y1 = parseFloat(document.getElementById('yInputV1').value);
  var v1 = new Vector3([x1, y1, 0]);

  // Get the values from the input fields for v2
  var x2 = parseFloat(document.getElementById('xInputV2').value);
  var y2 = parseFloat(document.getElementById('yInputV2').value);
  var v2 = new Vector3([x2, y2, 0]);

  // Draw v1 in red
  drawVector(v1, 'red', ctx);

  // Draw v2 in blue
  drawVector(v2, 'blue', ctx);
}

/*
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
  ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
*/

main();
