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

  // Instantiate vector v1 with z coordinate set to 0
  var v1 = new Vector3([2.25, 2.25, 0]);

  // Call drawVector(v1, "red")
  drawVector(v1, 'red', ctx);

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
    ctx.lineWidth = 100;

    // Draw the vector
    ctx.stroke();
}

/*
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
  ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
*/

main();
