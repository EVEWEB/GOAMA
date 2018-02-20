#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float value (vec2 st) {
  vec2 m=u_mouse.xy;///u_resolution.xy;
  return dot(st.xy, vec2((m.x*2.0)-1.0,(m.y*2.0)-1.0)*100.0); //vec2(0.1,0.99,0.1,0.99));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st *= 20.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    vec3 color = vec3(value( u_mouse.xy ));
//    vec3 color = vec3(fpos,1.0);

    gl_FragColor = vec4(color,1.0);
}
