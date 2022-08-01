#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float draw_circle(vec2 st, vec2 center, float radius){
    float blur = 2. / uResolution.y;
    vec2 dist = vec2(st - center);
    float pct = smoothstep(radius + blur, radius - blur, dot(dist, dist) * 4.);

    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy / uResolution;

    float radius = 0.5 * sin(uTime * 0.2) + 0.49;


    vec3 color = vec3(0.5, 0.5, 0.1);
    float pct = draw_circle(st, vec2(0.5, 0.5), radius);

    gl_FragColor = vec4(color * pct, 1.0);
}