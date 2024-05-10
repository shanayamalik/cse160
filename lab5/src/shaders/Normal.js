const VertexShader = `
  precision mediump float;
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 normal;

  uniform mat4 modelMatrix;
  uniform mat4 normalMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vNormal;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vNormal = (normalMatrix * vec4(normal, 1.0)).xyz;
  }
  `;

const FragmentShader = `
  precision mediump float;
  varying vec3 vNormal;

  void main() {
    vec3 norm = normalize(vNormal);
    
    gl_FragColor = vec4(norm, 1.0);
  }
  `;

export { VertexShader, FragmentShader };
