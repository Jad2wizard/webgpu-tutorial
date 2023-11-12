#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float r = 0.05;

void main(){
    vec2 st = gl_FragCoord.xy / uResolution;
    vec2 nMouse = uMouse / uResolution;
    float d = length(nMouse - st);
    float v = 1. - smoothstep(0., r, d);
    gl_FragColor = vec4(v * 0.5, 0.0, 0.0, 1.0);

}