class Tetrahedron {
    constructor() {
        this.type = 'tetrahedron';
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default white color
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        // Set the color uniform
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the transformation matrix to the shader
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Define vertices for the tetrahedron
        const v0 = [0.0, 1.0, 0.0]; // Top vertex
        const v1 = [1.0, 0.0, 1.0]; // Base vertex 1
        const v2 = [-1.0, 0.0, 1.0]; // Base vertex 2
        const v3 = [0.0, 0.0, -1.0]; // Base vertex 3

        // Draw the four triangular faces
        // Face 1 (v0, v1, v2)
        drawTriangle3D([...v0, ...v1, ...v2]);
        // Face 2 (v0, v2, v3)
        drawTriangle3D([...v0, ...v2, ...v3]);
        // Face 3 (v0, v3, v1)
        drawTriangle3D([...v0, ...v3, ...v1]);
        // Base face (v1, v3, v2)
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]); // Darker color for the base
        drawTriangle3D([...v1, ...v3, ...v2]);
    }
}