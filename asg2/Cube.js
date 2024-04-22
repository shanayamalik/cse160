class Cube {
    constructor(segments) {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = segments;
        this.matrix = new Matrix4();
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        console.log(this.matrix.elements);
      
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);
        // Include other five sides of triangle
    } 
}
