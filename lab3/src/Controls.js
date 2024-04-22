import { Vector3 } from "../lib/cuon-matrix-cse160";

export default class RotateControls {
  constructor(gl, object) {
    this.canvas = gl.canvas;
    this.target = object;

    this.mouse = new Vector3(); // will use as a vector2
    this.lerpRotation = new Vector3().set(object.rotation);
    this.dragging = false;

    this.setHandlers();
  }

  setHandlers() {
    this.canvas.onmousedown = (e) => {
      let x = (e.clientX / e.target.clientWidth) * 2.0 - 1.0;
      let y = (-e.clientY / e.target.clientHeight) * 2.0 + 1.0;

      this.mouse.elements.set([x, y, 0]);
      this.dragging = true;
    };

    this.canvas.onmouseup = () => {
      this.dragging = false;
    };

    this.canvas.onmousemove = (e) => {
      let x = (e.clientX / e.target.clientWidth) * 2.0 - 1.0;
      let y = (-e.clientY / e.target.clientHeight) * 2.0 + 1.0;

      if (this.dragging) {
        let dx = x - this.mouse.elements[0];
        let dy = y - this.mouse.elements[1];

        this.lerpRotation.elements[0] -= dy * 100;
        this.lerpRotation.elements[1] += dx * 100;

        this.mouse.elements.set([x, y, 0]);
      }
    };
  }

  update() {
    // linearly interpolate rotation of object towards desired rotation
    // results in smooth rotation of object via mouse
    let x =
      0.9 * this.target.rotation.elements[0] +
      0.1 * this.lerpRotation.elements[0];

    let y =
      0.9 * this.target.rotation.elements[1] +
      0.1 * this.lerpRotation.elements[1];

    this.target.rotation.elements.set([x, y, 0]);
  }
}
