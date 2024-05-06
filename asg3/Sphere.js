class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.vertices = null;
        this.buffer = null;
        this.colors = null;
    }

    generateSphereVertices() {
        let vertices = [];
        let segments = 10;
        for (let i = 0; i < segments; i++) {
            let lat1 = Math.PI / segments * i;
            let lat2 = Math.PI / segments * (i + 1);
            let sinLat1 = Math.sin(lat1);
            let cosLat1 = Math.cos(lat1);
            let sinLat2 = Math.sin(lat2);
            let cosLat2 = Math.cos(lat2);
            for (let j = 0; j < segments; j++) {
                let lon1 = 2 * Math.PI / segments * j;
                let lon2 = 2 * Math.PI / segments * (j + 1);
                let sinLon1 = Math.sin(lon1);
                let cosLon1 = Math.cos(lon1);
                let sinLon2 = Math.sin(lon2);
                let cosLon2 = Math.cos(lon2);

                vertices.push(cosLon1 * sinLat1, cosLat1, sinLon1 * sinLat1); // v1
                vertices.push(cosLon1 * sinLat2, cosLat2, sinLon1 * sinLat2); // v2
                vertices.push(cosLon2 * sinLat1, cosLat1, sinLon2 * sinLat1); // v3

                vertices.push(cosLon1 * sinLat2, cosLat2, sinLon1 * sinLat2); // v2
                vertices.push(cosLon2 * sinLat1, cosLat1, sinLon2 * sinLat1); // v3
                vertices.push(cosLon2 * sinLat2, cosLat2, sinLon2 * sinLat2); // v4
            }
        }
        this.vertices = new Float32Array(vertices);
    }

    drawSphere(buffer, vertices, rgba) {
        let n = vertices.length / 3;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    generateColors(rgba) {
        // Define the colors for the sphere
        // const colors = new Array(this.vertices.length / 3).fill(rgba);
        // console.log(colors);
        // this.colors = colors;
        this.colors = rgba;
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
            this.generateSphereVertices();
        }
        if (!this.colors) {
            this.generateColors(rgba);
        }

        this.drawSphere(this.buffer, this.vertices, this.colors);
    }
}
