const VertexShader = `
  precision mediump float;
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 normal;

  uniform mat4 modelMatrix;
  uniform mat4 normalMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const FragmentShader = `
  precision mediump float;
  #define SUN_POS vec3(0.0, 25.0, 43.301)
  
  void main() {
    vec3 color = vec3(0.1, 0.12, 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export { VertexShader, FragmentShader };
