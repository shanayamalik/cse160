import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

export default class Camera {
  constructor(position = [0, 1, 2], rotation = [0, 0, 0]) {
    this.position = new Vector3(position);
    this.rotation = new Vector3(rotation);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.up = new Vector3([0, 1, 0]);

    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.01;
    this.far = 100;
    this.fov = 50;

    window.addEventListener("resize", (e) => {
      this.aspect = window.innerWidth / window.innerHeight;

      this.calculateViewProjection();
    });

    this.calculateViewProjection();
  }

  calculateViewProjection() {
    let [rx, ry, rz] = this.rotation.elements;

    this.viewMatrix.setTranslate(...this.position.elements);

    this.viewMatrix.rotate(ry, 0, 1, 0).rotate(rx, 1, 0, 0).rotate(rz, 0, 0, 1);

    this.viewMatrix.invert();

    this.projectionMatrix.setPerspective(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }
}
