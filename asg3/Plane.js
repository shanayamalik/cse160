class Plane {
    constructor() {
        this.type = 'plane';
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default color is white
        this.matrix = new Matrix4();
        this.vertices = null;
        this.buffer = null;
    }

    generatePlaneVertices() {
        // Define the vertices for the plane
        this.vertices = new Float32Array([
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
        ]);
    }

    render() {
        let rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (!this.buffer) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
        }
        if (!this.vertices) {
            this.generatePlaneVertices();
        }

        drawPlane(this.buffer, this.vertices);
    }
}

const drawPlane = (buffer, vertices) => {
    let n = vertices.length / 3;

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}