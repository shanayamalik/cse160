import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export default class Controls {
  constructor(gl, camera, rotation = [0, 0, 0]) {
    this.canvas = gl.canvas;
    this.camera = camera;

    this.mouse = new Vector3(); // will use as vector2
    this.rotation = new Vector3(rotation);
    this.matrix = new Matrix4();
    this.dragging = false;

    this.setHandlers();
  }

  setHandlers() {
    this.canvas.onmousedown = (e) => {
      this.dragging = true;

      let x = (e.clientX / e.target.clientWidth) * 2.0 - 1.0;
      let y = (-e.clientY / e.target.clientHeight) * 2.0 + 1.0;

      this.mouse.elements.set([x, y, 0]);
    };

    this.canvas.onmouseup = this.canvas.onmouseleave = (e) => {
      this.dragging = false;
    };

    this.canvas.onmousemove = (e) => {
      let x = (e.clientX / e.target.clientWidth) * 2.0 - 1.0;
      let y = (-e.clientY / e.target.clientHeight) * 2.0 + 1.0;

      if (this.dragging) {
        let dx = x - this.mouse.elements[0];
        let dy = y - this.mouse.elements[1];

        this.rotation.elements[0] -= dy * 50;
        this.rotation.elements[1] += dx * 50;

        this.mouse.elements.set([x, y, 0]);
      }
    };
  }
  update() {
    // linearly interpolate rotation of object towards desired rotation
    // results in smooth rotation of camera via mouse by lerping 20% each tick
    let x =
      0.8 * this.camera.rotation.elements[0] + 0.2 * this.rotation.elements[0];

    let y =
      0.8 * this.camera.rotation.elements[1] + 0.2 * this.rotation.elements[1];

    this.camera.rotation.elements.set([x, y, 0]);
  }
}
