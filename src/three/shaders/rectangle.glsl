// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

void main(){
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec3 color = vec3(0.0);

    // float blur = 0.02;
    // // bottom-left
    // vec2 bl = smoothstep(vec2(0.1), vec2(0.1+blur),st);
    // float pct = bl.x * bl.y;

    // // top-right
    // vec2 tr = smoothstep(vec2(0.1), vec2(0.1+blur),1.0-st);
    // pct *= tr.x * tr.y;

    float padding = 0.1;
    float  floorRB = floor((1.0/(1.0 - padding))*(st.x))+padding;
    float floorLT = 1.0 - (floor((1.0/(1.0 - padding))*(1.0-st.x))+padding);
    float rb = step(floorRB, st.y);
    float lt = 1.0 - step(floorLT, st.y);
    float pct = rb * lt;

    color = mix(vec3(0.8,0.9,0.2),vec3(0.0,0.8,0.6) , pct);

    gl_FragColor = vec4(color,1.0);
    // gl_FragColor = vec4(step(vec2(0.1), st), 0.0, 1.0);
    // gl_FragColor = vec4(step(vec2(250., 250.), gl_FragCoord.xy) * vec2(1., 0.), 0.0, 1.0);
}
