import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export default class Camera {
  constructor(position = [0, 1, 2], target = [0, 0, 0]) {
    this.position = new Vector3(position);
    this.target = new Vector3(target);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.up = new Vector3([0, 1, 0]);

    this.aspect = window.innerWidth / window.innerHeight;

    window.addEventListener("resize", (e) => {
      this.aspect = window.innerWidth / window.innerHeight;

      this.calculateViewProjection();
    });

    this.calculateViewProjection();
  }

  calculateViewProjection() {
    this.viewMatrix.setLookAt(
      ...this.position.elements,
      ...this.target.elements,
      ...this.up.elements
    );

    this.projectionMatrix.setPerspective(50, this.aspect, 0.01, 10);
  }
}
