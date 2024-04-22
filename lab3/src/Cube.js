import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export default class Cube {
  constructor() {
    this.vertices = null;
    this.uvs = null;
    this.vertexBuffer = null;
    this.uvBuffer = null;
    this.texture0 = null;
    this.texture1 = null;

    this.position = new Vector3([0, 0, 0]);
    this.rotation = new Vector3([0, 0, 0]);
    this.scale = new Vector3([1, 1, 1]);
    this.modelMatrix = new Matrix4();

    this.setVertices();
    this.setUvs();
  }

  setImage(gl, imagePath, index) {
    // Handle texture slot 0
    if (index === 0) {
      if (this.texture0 === null) {
        this.texture0 = gl.createTexture();
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const uTexture0 = gl.getUniformLocation(gl.program, "uTexture0");
      if (uTexture0 < 0) {
        console.warn("could not get uniform location for texture 0");
      }

      const img0 = new Image();
      img0.onload = () => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img0
        );
        gl.uniform1i(uTexture0, 0);
      };

      img0.crossOrigin = "anonymous";
      img0.src = imagePath;
    }
    // Handle texture slot 1
    else if (index === 1) {
      if (this.texture1 === null) {
        this.texture1 = gl.createTexture();
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const uTexture1 = gl.getUniformLocation(gl.program, "uTexture1");
      if (!uTexture1)
        console.error("Could not get uniform location for texture 1");

      const img1 = new Image();
      img1.onload = () => {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img1
        );
        gl.uniform1i(uTexture1, 1);
      };

      img1.crossOrigin = "anonymous";
      img1.src = imagePath;
    }
  }

  setVertices() {
    // prettier-ignore
    this.vertices = new Float32Array([
      //FRONT
      -0.5,0.5,0.5, -0.5,-0.5,0.5, 0.5,-0.5,0.5,
      -0.5,0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5,
      //LEFT
      -0.5,0.5,-0.5, -0.5,-0.5,-0.5, -0.5,-0.5,0.5,
      -0.5,0.5,-0.5, -0.5,-0.5,0.5, -0.5,0.5,0.5,
      //RIGHT
      0.5,0.5,0.5, 0.5,-0.5,0.5, 0.5,-0.5,-0.5,
      0.5,0.5,0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,
      //TOP
      -0.5,0.5,-0.5, -0.5,0.5,0.5, 0.5,0.5,0.5,
      -0.5,0.5,-0.5, 0.5,0.5,0.5, 0.5,0.5,-0.5,
      //BACK
      0.5,0.5,-0.5, 0.5,-0.5,-0.5, -0.5,0.5,-0.5,
      -0.5,0.5,-0.5, 0.5,-0.5,-0.5, -0.5,-0.5,-0.5,
      //BOTTOM
      -0.5,-0.5,0.5, -0.5,-0.5,-0.5, 0.5,-0.5,-0.5,
      -0.5,-0.5,0.5, 0.5,-0.5,-0.5, 0.5,-0.5,0.5
    ]);
  }

  setUvs() {
    // prettier-ignore
    this.uvs = new Float32Array([
      // FRONT
      0,1, 0,0, 1,0, 0,1, 1,0, 1,1,
      // LEFT
      0,1, 0,0, 1,0, 0,1, 1,0, 1,1,
      // RIGHT
      0.5,0.75, 0.5,0.5, 0.75,0.5, 0.5,0.75, 0.75,0.5, 0.75,0.75,
      // TOP
      0.25,0.25, 0.25,0.5, 0,0.5, 0.25,0.25, 0,0.5, 0,0.25, 
      // BACK
      0,1, 0,0, 1,1, 1,1, 0,0, 1,0,
      // BOTTOM
      0,1, 0,0, 1,0, 0,1, 1,0, 1,1,
    ]);
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
  }

  render(gl, camera) {
    this.calculateMatrix();

    const aPosition = gl.getAttribLocation(gl.program, "aPosition");
    const uv = gl.getAttribLocation(gl.program, "uv");
    const modelMatrix = gl.getUniformLocation(gl.program, "modelMatrix");
    const viewMatrix = gl.getUniformLocation(gl.program, "viewMatrix");
    const projectionMatrix = gl.getUniformLocation(
      gl.program,
      "projectionMatrix"
    );

    gl.uniformMatrix4fv(modelMatrix, false, this.modelMatrix.elements);
    gl.uniformMatrix4fv(viewMatrix, false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(
      projectionMatrix,
      false,
      camera.projectionMatrix.elements
    );

    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    if (this.uvBuffer === null) {
      this.uvBuffer = gl.createBuffer();
      if (!this.uvBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uv);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
