uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define dir vec2(1.0, 0.5)
#define PI 3.141592653589793

float move(float v, float s){
    return abs(mod(u_time * 0.1 * s + v, 2.0) - 1.0);
}

// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     gl_FragColor = vec4(vec2(move(st.x, dir.x), move(st.y, dir.y)), 0.0, 1.0);
// }

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float y) {    
    // float halfWidth = 0.016;
    float halfWidth = 1. / u_resolution.y;
    float f = smoothstep(0.0, halfWidth, (st.y - y));
    float ff = smoothstep(-1.0 * halfWidth, 0.0, (st.y - y));
    return ff - f;
}

float calc_y(float x){
    // float y = smoothstep(0.3, 0.7, st.x);
    // float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);
    float y = sin(x * PI * 4.0 + u_time*0.) * 0.08 + 0.5;

    return y;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

    float y = calc_y(st.x);

    vec3 color = vec3(y);

    // Plot a line
    float pct = plot(st, y);
    color = mix(color, vec3(0.0,1.0,0.0), pct);

	gl_FragColor = vec4(vec3(pct),1.0);
}