// Disclaimer: I have approximately zero experience in shader programming, I
// just cobbled this together by looking up a really simple continuous noise
// function and manipulating it until it looked sort of like what I expected.

AFRAME.registerShader('pyro-sparks', {
  schema: {
    time: { type: 'time', is: 'uniform' },
  },

  vertexShader: `
    varying vec3 vPos;
    varying vec3 vWorldPos;
    void main() {
      vPos = position;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    precision mediump float;
    uniform float time;
    varying vec3 vPos;
    varying vec3 vWorldPos;

    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      // Corners
      float c000 = hash(i + vec3(0, 0, 0));
      float c001 = hash(i + vec3(0, 0, 1));
      float c010 = hash(i + vec3(0, 1, 0));
      float c011 = hash(i + vec3(0, 1, 1));
      float c100 = hash(i + vec3(1, 0, 0));
      float c101 = hash(i + vec3(1, 0, 1));
      float c110 = hash(i + vec3(1, 1, 0));
      float c111 = hash(i + vec3(1, 1, 1));

      // Edges
      float e00z = mix(c000, c001, f.z);
      float e01z = mix(c010, c011, f.z);
      float e10z = mix(c100, c101, f.z);
      float e11z = mix(c110, c111, f.z);

      // Faces
      float f0yz = mix(e00z, e01z, f.y);
      float f1yz = mix(e10z, e11z, f.y);

      // Cube
      return mix(f0yz, f1yz, f.x);
    }

    void main() {
      vec3 p = vWorldPos + vPos;
      p.y += time * 0.005;
      float n = noise(p * 5.0);
      float s = pow(smoothstep(0.25, 1.0, n) * 2.5, 5.0);
      vec3 color = vec3(0.75, 0.75, 0.25);
      gl_FragColor = vec4(mix(0.1 * color, color, s), s * s);
    }
  `,
});
