class Cube {
  constructor(scale = 1) {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum=0;
    this.setScale(scale);
  }

  setScale(scale) {
    this.matrix.setScale(scale, scale, scale);
  }

  render() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of cube
    drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

    // Change color for the top
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

    // Top of cube
    drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] );
    drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );
    // Back of cube
    drawTriangle3D([1,0,1, 0,1,1, 0,0,1]);
    drawTriangle3D([1,0,1, 1,1,1, 0,1,1]);
    // Bottom of cube
    drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);
    drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
    // Left side of cube
    drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
    drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
    // Right side of cube
    drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);
    drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);

    /*
    // Top of cube
    drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    drawTriangle3D([0, 1, 0, 1, 1, 1, 1, 1, 0]);

    // Back of cube
    drawTriangle3DUV([1, 0, 1, 0, 1, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([1, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1]);

    // Bottom of cube
    drawTriangle3DUV([0, 0, 0, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1]);

    // Left side of cube
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 0, 1, 1, 1]);

    // Right side of cube
    drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
    */
  }
}