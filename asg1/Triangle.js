class Triangle {

   constructor() {
    this.type='triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
   }

    render() {
    var xy = this.position;
    var rgba = this.color; 
    var size = this.size;
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    // Calculate the vertices of the triangle based on size and position
    var d = this.size / 200.0; // delta
    var vertices = [
      xy[0], xy[1],
      xy[0] + d, xy[1],
      xy[0], xy[1] + d
    ];
    // Call drawTriangle to render the triangle
    drawTriangle(vertices);
  }
}

// The drawTriangle function should look like this
function drawTriangle(vertices) {
  var n = 3; // The number of vertices
  
  // Create a buffer object, bind, and set data
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Set the vertex attribute pointer and enable it
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
