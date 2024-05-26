class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -3;
    }

    render() {
        let rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Front
        drawTriangle3DUVNormal(
            [0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0],
            [0, 0, -1, 0, 0, -1, 0, 0, -1]
        );
        drawTriangle3DUVNormal(
            [0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1],
            [0, 0, -1, 0, 0, -1, 0, 0, -1]
        );

        // Top
        drawTriangle3DUVNormal(
            [0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1],
            [0, 1, 0, 0, 1, 0, 0, 1, 0]
        );
        drawTriangle3DUVNormal(
            [0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 0]
        );

        // Back
        drawTriangle3DUVNormal(
            [0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 1]
        );
        drawTriangle3DUVNormal(
            [0, 0, 1, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1],
            [0, 0, 1, 0, 0, 1, 0, 0, 1]
        );

        // Bottom
        drawTriangle3DUVNormal(
            [0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1],
            [0, -1, 0, 0, -1, 0, 0, -1, 0]
        );
        drawTriangle3DUVNormal(
            [0, 0, 0, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0],
            [0, -1, 0, 0, -1, 0, 0, -1, 0]
        );

        // Left
        drawTriangle3DUVNormal(
            [0, 1, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1],
            [-1, 0, 0, -1, 0, 0, -1, 0, 0]
        );
        drawTriangle3DUVNormal(
            [0, 0, 0, 0, 1, 1, 0, 0, 1], [0, 0, 0, 1, 1, 1],
            [-1, 0, 0, -1, 0, 0, -1, 0, 0]
        );

        // Right
        drawTriangle3DUVNormal(
            [1, 1, 0, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0],
            [1, 0, 0, 1, 0, 0, 1, 0, 0]
        );
        drawTriangle3DUVNormal(
            [1, 1, 0, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0],
            [1, 0, 0, 1, 0, 0, 1, 0, 0]
        );
    }
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    // Assign the buffer object to a_UV variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    // Assign the buffer object to a_Normal variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Normal variable
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}