#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float box(vec2 st, vec2 center, vec2 size){
	vec2 rt = center + size / 2.;
	vec2 lb = center - size / 2.;
	vec2 uv = step(lb, st) * step(st, rt);
	return uv.x * uv.y;
}

float cross(vec2 st, vec2 center, vec2 size){
	float right_box = box(st + vec2(size.x, 0.), center, size);
	float left_box = box(st - vec2(size.x, 0.), center, size);
	float top_box = box(st + vec2(0., size.y), center, size);
	float bottom_box = box(st - vec2(0., size.y), center, size);
	float center_box = box(st, center, size);
	return right_box + bottom_box + left_box + top_box + center_box;
}

void main(){
	vec2 st = gl_FragCoord.xy / uResolution;
	float cross_weight = cross(st, vec2(0.3, 0.4), vec2(0.05, 0.05));
	vec3 color = vec3(cross_weight);

	gl_FragColor = vec4(color, 1.0);
}