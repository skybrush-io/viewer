import AFrame from '@skybrush/aframe-components';

const vertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}`;

const fragmentShader = `
uniform vec3 color;
uniform float falloffAmount;
uniform float glowSharpness;
uniform float glowInternalRadius;
uniform float opacity;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  // Normal
  vec3 normal = normalize(vNormal);
  if(!gl_FrontFacing)
      normal *= - 1.0;
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = dot(viewDirection, normal);
  fresnel = pow(fresnel, glowInternalRadius + 0.1);
  float falloff = smoothstep(0., falloffAmount, fresnel);
  float fakeGlow = fresnel;
  fakeGlow += fresnel * glowSharpness;
  fakeGlow *= falloff;
  gl_FragColor = vec4(clamp(color * fresnel, 0., 1.0), clamp(fakeGlow, 0., opacity));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

AFrame.registerShader('glow', {
  schema: {
    color: { type: 'color', is: 'uniform', default: '#0080ff' },
    falloffAmount: { type: 'number', is: 'uniform', default: 0.1 },
    glowInternalRadius: { type: 'number', is: 'uniform', default: 6 },
    glowSharpness: { type: 'number', is: 'uniform', default: 1 },
    opacity: { type: 'number', is: 'uniform', default: 1 },
  },
  vertexShader,
  fragmentShader,
});
