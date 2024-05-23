class Camera {
  constructor() {
    this.eye = new Vector3([0.0, 0.0, 3.0]);
    this.at = new Vector3([0.0, 0.0, 0.0]);
    this.up = new Vector3([0.0, 1.0, 0.0]);
  }

  forward() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    this.eye.add(f);
    this.at.add(f);
    return f;
  }

  back() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    this.eye.sub(f);
    this.at.sub(f);
    return f;
  }

  left() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    const s = Vector3.cross(f, this.up);
    s.normalize();
    this.eye.sub(s);
    this.at.sub(s);
    return s;
  }

  right() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    const s = Vector3.cross(f, this.up);
    s.normalize();
    this.eye.add(s);
    this.at.add(s);
    return s;
  }

  turnLeft() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    const r = Math.sqrt(f.elements[0] * f.elements[0] + f.elements[2] * f.elements[2]);
    let theta = Math.atan2(f.elements[0], f.elements[2]);
    theta += 0.2;
    f.elements[0] = r * Math.sin(theta);
    f.elements[2] = r * Math.cos(theta);
    f.add(this.eye);
    this.at = f;
  }

  turnRight() {
    const f = new Vector3(this.at.elements);
    f.sub(this.eye);
    const r = Math.sqrt(f.elements[0] * f.elements[0] + f.elements[2] * f.elements[2]);
    let theta = Math.atan2(f.elements[0], f.elements[2]);
    theta -= 0.2;
    f.elements[0] = r * Math.sin(theta);
    f.elements[2] = r * Math.cos(theta);
    f.add(this.eye);
    this.at = f;
  }
}
