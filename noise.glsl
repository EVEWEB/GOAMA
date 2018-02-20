precision mediump float;
uniform vec4 color;
varying vec3 pos;
uniform float time;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)


void main() {

  gl_FragColor = vec4(snoise3(pos),1.0);
}
