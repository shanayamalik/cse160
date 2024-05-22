class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.rotation = 0.0;
        this.matrix = new Matrix4();
        this.vertices = null;
        this.buffer = null;
        this.uvBuffer = null;
        this.colors = null;
        
        this.textureNum = -3;
    }

    generateCubeVertices() {
        // Define the vertices for the faces
        const faces = [
            [[0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [1.0, 0.0, 0.0], [1.0, 1.0, 0.0]],
            [[1.0, 0.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 1.0], [0.0, 1.0, 1.0]],
            [[0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [0.0, 1.0, 1.0]],
            [[1.0, 0.0, 0.0], [1.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 1.0, 1.0]],
            [[0.0, 1.0, 0.0], [1.0, 1.0, 0.0], [0.0, 1.0, 1.0], [1.0, 1.0, 1.0]],
            [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0], [1.0, 0.0, 1.0]]
        ];

        this.vertices = {
            front: new Float32Array(faces[0].flat()),
            top: new Float32Array(faces[1].flat()),
            back: new Float32Array(faces[2].flat()),
            bottom: new Float32Array(faces[3].flat()),
            left: new Float32Array(faces[4].flat()),
            right: new Float32Array(faces[5].flat()),
        }
    }

    generateCubeUV() {
        const uv = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
        this.uv = {
            front: new Float32Array(uv),
            top: new Float32Array(uv),
            back: new Float32Array(uv),
            bottom: new Float32Array(uv),
            left: new Float32Array(uv),
            right: new Float32Array(uv),
        }
    }

    generateColors(rgba) {
        // Define the colors for the faces
        const colors = [
            [rgba[0], rgba[1], rgba[2], rgba[3]], // Front face
            [rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]], // Top face
            [rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]], // Back face
            [rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]], // Bottom face
            [rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]], // Left face
            [rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]], // Right face 
        ];
        this.colors = colors;
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
        if (!this.uvBuffer) {
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer) {
                console.log('Failed to create the uvbuffer object');
                return -1;
            }
        }
        if (!this.vertices) {
            this.generateCubeVertices();
        }
        if (!this.uv) {
            this.generateCubeUV();
        }
        if (!this.colors) {
            this.generateColors(rgba);
        }

        gl.uniform1i(u_whichTexture, this.textureNum);
        // drawCube(this.buffer, this.vertices, this.colors);
        drawCubeUV(this.buffer, this.uvBuffer, this.vertices, this.uv, this.colors);
    }

    /*
      render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] );
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] );

        // Change the color to white for the top of the cube
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top of cube
        drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] );
        drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );
        // Back of cube
        drawTriangle3D([1,0,1, 0,1,1, 0,0,1]);
        drawTriangle3D([1,0,1, 1,1,1, 0,1,1]);
        // Bottom of cube
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);
        drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
        // Left side of cube
        drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
        drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
        // Right side of cube
        drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);
        drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
      }
    */
    
    renderFast() {
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

        const allVertices = new Float32Array([
            // Front face
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
            // Top face
            1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            // Back face
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            // Bottom face
            1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
            // Left face
            0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
            // Right face
            0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0
        ]);


        const allUV = new Float32Array([
            // Front face
            0, 0, 0, 1, 1, 0, 1, 1,
            // Top face
            0, 0, 0, 1, 1, 0, 1, 1,
            // Back face
            0, 0, 0, 1, 1, 0, 1, 1,
            // Bottom face
            0, 0, 0, 1, 1, 0, 1, 1,
            // Left face
            0, 0, 0, 1, 1, 0, 1, 1,
            // Right face
            0, 0, 0, 1, 1, 0, 1, 1
        ]);

        this.vertices = allVertices;

        gl.uniform1i(u_whichTexture, this.textureNum);
        drawVertices(this.buffer, this.vertices);
    }
}

const drawCube = (buffer, vertices, rgba) => {
    for (let i = 0; i < 6; i++) {
        gl.uniform4f(u_FragColor, rgba[i][0], rgba[i][1], rgba[i][2], rgba[i][3]);
        drawQuadrilateral3D(buffer, vertices[Object.keys(vertices)[i]]);
    }
}

const drawCubeUV = (buffer, uvBuffer, vertices, uv, rgba) => { 
    for (let i = 0; i < 6; i++) {
        gl.uniform4f(u_FragColor, rgba[i][0], rgba[i][1], rgba[i][2], rgba[i][3]);
        drawQuadrilateral3DUV(buffer, uvBuffer, vertices[Object.keys(vertices)[i]], uv[Object.keys(uv)[i]]);
    }
}

const drawVertices = (buffer, vertices) => {
    let n = vertices.length;
    // console.log(n)
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

const drawQuadrilateral3D = (buffer, vertices) => {
    let n = 4;
    // console.log(vertices, buffer);
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

const drawQuadrilateral3DUV = (buffer, uvBuffer, vertices, uv) => {
    let n = 4;
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
