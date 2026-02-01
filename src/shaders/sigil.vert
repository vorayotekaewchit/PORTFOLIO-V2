uniform float time;
uniform float audioBass;
uniform vec2 mouse;
uniform float displacementStrength;
uniform sampler2D displacementMap;
uniform sampler2D tattooPattern;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  // Displacement from tattoo pattern
  vec4 tattoo = texture2D(tattooPattern, uv);
  float displacement = tattoo.r * displacementStrength;
  
  // Audio-reactive displacement
  displacement += audioBass * 0.1;
  
  // Giger biomech distortion
  vec3 newPosition = position + normal * displacement;
  
  // Mouse interaction distortion
  vec2 mouseInfluence = (mouse - uv) * 0.5;
  float mouseDist = length(mouseInfluence);
  newPosition += normal * (1.0 / (mouseDist + 1.0)) * 0.05;
  
  vDisplacement = displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
