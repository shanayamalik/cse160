import {
    Color,
    Mesh,
    PlaneGeometry,
    ShaderMaterial,
    UniformsUtils,
    Vector2,
    Vector3,
    Vector4,
    RepeatWrapping,
    TextureLoader
} from './three.module.js';

const WaterRefractionShader = {

    name: 'WaterRefractionShader',

    uniforms: {

        'color': { value: new Color(0x001e0f) },
        'time': { value: 0 },
        'tDiffuse': { value: null },
        'tDudv': { value: null },
        'textureMatrix': { value: null }

    },

    vertexShader: /* glsl */`
        uniform mat4 textureMatrix;
        varying vec2 vUv;
        varying vec4 vUvRefraction;

        void main() {

            vUv = uv;
            vUvRefraction = textureMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }`,

    fragmentShader: /* glsl */`
        uniform vec3 color;
        uniform float time;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDudv;

        varying vec2 vUv;
        varying vec4 vUvRefraction;

        float blendOverlay( float base, float blend ) {
            return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
        }

        vec3 blendOverlay( vec3 base, vec3 blend ) {
            return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
        }

        void main() {

            float waveStrength = 0.5;
            float waveSpeed = 0.03;

            vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveStrength;
            distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );
            vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;

            vec4 uv = vec4( vUvRefraction );
            uv.xy += distortion;

            vec4 base = texture2DProj( tDiffuse, uv );

            gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

            #include <tonemapping_fragment>
            #include <colorspace_fragment>

        }`

};

export { WaterRefractionShader };

const Water = function (geometry, options) {
    Mesh.call(this, geometry);

    var scope = this;
    options = options || {};

    var color = options.color !== undefined ? new Color(options.color) : new Color(0xFFFFFF);
    var textureWidth = options.textureWidth || 512;
    var textureHeight = options.textureHeight || 512;
    var clipBias = options.clipBias || 0.0;
    var flowDirection = options.flowDirection || new Vector2(1, 0);
    var flowSpeed = options.flowSpeed || 0.03;
    var reflectivity = options.reflectivity || 0.02;
    var scale = options.scale || 1;
    var shader = options.shader || WaterRefractionShader;

    var textureLoader = new TextureLoader();
    var dudvMap = textureLoader.load(options.dudvMap || 'textures/water/waterdudv.jpg');
    var normalMap0 = textureLoader.load(options.texture || 'textures/water/waternormals.jpg');
    var normalMap1 = textureLoader.load(options.texture || 'textures/water/waternormals.jpg');

    dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping;
    normalMap0.wrapS = normalMap0.wrapT = RepeatWrapping;
    normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping;

    var uniforms = UniformsUtils.merge([
        UniformsLib['fog'],
        UniformsLib['lights'],
        shader.uniforms
    ]);

    uniforms['color'].value = color;
    uniforms['reflectivity'].value = reflectivity;
    uniforms['tDudv'].value = dudvMap;
    uniforms['tNormalMap0'].value = normalMap0;
    uniforms['tNormalMap1'].value = normalMap1;
    uniforms['textureMatrix'].value = new Matrix4();
    uniforms['config'].value = new Vector4(scale, flowSpeed, clipBias, 0);
    uniforms['flowDirection'].value = flowDirection;

    var material = new ShaderMaterial({
        defines: shader.defines,
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        lights: true,
        fog: true
    });

    this.material = material;

    this.onBeforeRender = function (renderer, scene, camera) {
        scope.material.uniforms.time.value = performance.now() / 1000;
        scope.material.uniforms.textureMatrix.value = camera.projectionMatrixInverse;
    };

    this.dispose = function () {
        material.dispose();
    };
};

Water.prototype = Object.create(Mesh.prototype);
Water.prototype.constructor = Water;

export { Water };
