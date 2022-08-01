
uniform vec3 uColor;
uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform vec3 ambientColor;
uniform float lightIntensity;
varying vec3 vColor;

void main(){
	// vec4 norm = modelViewMatrix * vec4(normalize(normal), 1);
	vec3 norm = normalMatrix * normalize(normal);
	vec3 dr = vec3(lightIntensity) * uColor * lightColor * dot(norm.xyz, lightDirection); //diffuse reflect
	dr = clamp(dr, vec3(0), vec3(1));
	vColor = dr + ambientColor * uColor;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}