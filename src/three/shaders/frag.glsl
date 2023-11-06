#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

void main(){
    vec2 st = gl_FragCoord.xy / uResolution;
    gl_FragColor = vec4(st, 0.0, 1.0);
}