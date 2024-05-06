import { Vector3, Matrix4 } from "../../lib/cuon-matrix-cse160";

export default class Plane {
  constructor(widthSegments = 1, heightSegments = 1) {
    // buffers
    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.uvBuffer = null;
    this.normalBuffer = null;

    // data arrays
    this.vertices = null;
    this.indices = null;
    this.uvs = null;
    this.normals = null;

    // transformations
    this.position = new Vector3([0, 0, 0]);
    this.rotation = new Vector3([0, 0, 0]);
    this.scale = new Vector3([1, 1, 1]);
    this.modelMatrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    this.generatePlane(widthSegments, heightSegments);
  }

  generatePlane(widthSegments, heightSegments) {
    const seg_width = 1.0 / widthSegments;
    const seg_height = 1.0 / widthSegments;

    const vertices = [];
    const indices = [];
    const uvs = [];
    const normals = [];

    /**
     * generate widthSegments by heightSegments grid of vertices centered on origin
     * generate uv's and normals along the way
     * */
    for (let i = 0; i < heightSegments + 1; i++) {
      const y = i * seg_height - 0.5;

      for (let j = 0; j < widthSegments + 1; j++) {
        let x = j * seg_width - 0.5;

        vertices.push(x, -y, 0);

        // facing towards camera at first
        normals.push(0, 0, 1);

        uvs.push(j / widthSegments);
        uvs.push(1 - i / heightSegments);
      }

      for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
          let a = j + (widthSegments + 1) * i;
          let b = j + (widthSegments + 1) * (i + 1);
          let c = j + 1 + (widthSegments + 1) * (i + 1);
          let d = j + 1 + (widthSegments + 1) * i;

          // this indices compose the two triangles that create the square
          // on the grid at [i,j]
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      this.vertices = new Float32Array(vertices);
      this.indices = new Uint16Array(indices);
      this.uvs = new Float32Array(uvs);
      this.normals = new Float32Array(normals);
    }
  }

  calculateMatrix() {
    let [x, y, z] = this.position.elements;
    let [rx, ry, rz] = this.rotation.elements;
    let [sx, sy, sz] = this.scale.elements;

    this.modelMatrix
      .setTranslate(x, y, z)
      .rotate(rx, 1, 0, 0)
      .rotate(ry, 0, 1, 0)
      .rotate(rz, 0, 0, 1)
      .scale(sx, sy, sz);

    this.normalMatrix.set(this.modelMatrix).invert().transpose();
  }

  render(gl, camera) {
    if (this.vertexBuffer === null) this.vertexBuffer = gl.createBuffer();
    if (this.indexBuffer === null) this.indexBuffer = gl.createBuffer();
    if (this.uvBuffer === null) this.uvBuffer = gl.createBuffer();
    if (this.normalBuffer === null) this.normalBuffer = gl.createBuffer();

    this.calculateMatrix();
    camera.calculateViewProjection();

    const position = gl.getAttribLocation(gl.program, "position");
    const uv = gl.getAttribLocation(gl.program, "uv");
    const normal = gl.getAttribLocation(gl.program, "normal");
    const modelMatrix = gl.getUniformLocation(gl.program, "modelMatrix");
    const normalMatrix = gl.getUniformLocation(gl.program, "normalMatrix");
    const viewMatrix = gl.getUniformLocation(gl.program, "viewMatrix");
    const projectionMatrix = gl.getUniformLocation(
      gl.program,
      "projectionMatrix"
    );

    gl.uniformMatrix4fv(modelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(normalMatrix, false, this.normalMatrix.elements);
    gl.uniformMatrix4fv(viewMatrix, false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(
      projectionMatrix,
      false,
      camera.projectionMatrix.elements
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uv);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
