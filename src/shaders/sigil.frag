uniform float time;
uniform float audioBass;
uniform vec2 mouse;
uniform sampler2D displacementMap;
uniform sampler2D tattooPattern;
uniform sampler2D gigerTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

// ASCII noise function
float asciiNoise(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

// Giger biomech glow
vec3 gigerGlow(vec2 uv, float displacement) {
  vec3 color = vec3(0.0);
  
  // Biomech veins
  float veins = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time * 0.7);
  veins = pow(veins * 0.5 + 0.5, 3.0);
  
  // Glossy black with green glow
  vec3 baseColor = vec3(0.0, 0.0, 0.0);
  vec3 glowColor = vec3(0.0, 1.0, 0.25); // Matrix green
  
  // Audio-reactive pulse
  float pulse = sin(time * 2.0 + audioBass * 5.0) * 0.5 + 0.5;
  
  color = mix(baseColor, glowColor * veins, displacement * 0.5 + pulse * 0.3);
  
  return color;
}

void main() {
  vec2 uv = vUv;
  
  // Base color (glossy black)
  vec3 color = vec3(0.0, 0.0, 0.0);
  
  // Giger biomech layer
  vec3 giger = gigerGlow(uv, vDisplacement);
  color = mix(color, giger, 0.6);
  
  // Tattoo pattern overlay
  vec4 tattoo = texture2D(tattooPattern, uv * 2.0 + time * 0.1);
  vec3 tattooColor = vec3(1.0, 0.08, 0.58); // Tribal pink
  color += tattoo.rgb * tattooColor * 0.2 * vDisplacement;
  
  // ASCII noise overlay
  float ascii = asciiNoise(uv * 50.0 + time);
  color += vec3(ascii * 0.1) * vec3(0.0, 1.0, 0.25);
  
  // Edge glow (matrix green)
  float edge = smoothstep(0.0, 0.1, vDisplacement) * smoothstep(1.0, 0.9, vDisplacement);
  color += vec3(0.0, 1.0, 0.25) * edge * 0.5;
  
  // Mouse interaction glow
  float mouseDist = length(mouse - uv);
  float mouseGlow = 1.0 / (mouseDist * 5.0 + 1.0);
  color += vec3(0.0, 1.0, 0.25) * mouseGlow * 0.3;
  
  // Final output with alpha
  gl_FragColor = vec4(color, 0.9);
}
