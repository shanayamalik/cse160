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

  // Instantiate vector v1 with z coordinate set to 0
    var v1 = new Vector3([2.25, 2.25, 0]);

    // Call drawVector(v1, "red")
    drawVector(v1, 'red', ctx);

}

/*
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
  ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
*/
