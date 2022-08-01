#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec3 vColor;

float draw_circle(vec2 st, vec2 center, float radius){
    float pct = smoothstep(radius + 0.05 * radius, radius - 0.05 * radius, distance(st, center));

    return pct;

    // return vec3(mix(vec3(1.0, 1.0, 1.0), color, 1.0 - pct));
}

void main(){
    gl_FragColor = vec4(vColor, 1.0);
}