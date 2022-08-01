#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

void main(){
	vec2 st = gl_FragCoord.xy / uResolution;
	st = st * 2.0 - vec2(1.0);

	gl_FragColor = vec4(vec3(0.2), 1.0);
}