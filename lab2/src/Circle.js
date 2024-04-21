export default class Circle {
  constructor() {
    this.type = "circle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 10;
    this.buffer = null;
    this.vertices = null;
  }

  generateVertices() {
    let [x, y] = this.position;
    var d = this.size / 200.0; // Scale factor
    let v = [];
    let angleStep = 360 / this.segments;

    for (var angle = 0; angle < 360; angle += angleStep) {
      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [
        Math.cos((angle1 * Math.PI) / 180) * d,
        Math.sin((angle1 * Math.PI) / 180) * d,
      ];
      let vec2 = [
        Math.cos((angle2 * Math.PI) / 180) * d,
        Math.sin((angle2 * Math.PI) / 180) * d,
      ];
      let pt1 = [x + vec1[0], y + vec1[1]];
      let pt2 = [x + vec2[0], y + vec2[1]];
      v.push(x, y, pt1[0], pt1[1], pt2[0], pt2[1]);
    }
    this.vertices = new Float32Array(v);
  }

  render(gl) {
    // Grab the color of the circle
    let [r, g, b, a] = this.color;

    // Grab the uniform and attribute positions
    let uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
    let aPosition = gl.getAttribLocation(gl.program, "aPosition");

    // Set the uniform uFragColor
    gl.uniform4f(uFragColor, r, g, b, a);

    // Check if vertices are generated
    if (this.vertices === null) {
      this.generateVertices();
    }

    // Check for buffer
    if (this.buffer === null) {
      // Create buffer
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    // Bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    // Write data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    // Assign buffer to attribute
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute array
    gl.enableVertexAttribArray(aPosition);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2);
  }
}
