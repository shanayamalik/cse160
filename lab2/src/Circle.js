export default class Circle {
  constructor() {
    this.type = "circle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 10;

    this.buffer = null;
  }

  render(gl) {
    let [x, y] = this.position;
    let [r, g, b, a] = this.color;

    const uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
    const aPosition = gl.getAttribLocation(gl.program, "aPosition");

    // Pass the color of a point to uFragColor variable
    gl.uniform4f(uFragColor, r, g, b, a);

    // Draw
    var d = this.size / 200.0; // delta

    let angleStep = 360 / this.segments;
    for (var angle = 0; angle < 360; angle = angle + angleStep) {
      let centerPt = [x, y];
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
      let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
      let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

      let vertices = [x, y, pt1[0], pt1[1], pt2[0], pt2[1]];

      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }

      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      // Write date into the buffer object
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.DYNAMIC_DRAW
      );

      // Assign the buffer object to aPosition variable
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      // Enable the assignment to aPosition variable
      gl.enableVertexAttribArray(aPosition);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}
