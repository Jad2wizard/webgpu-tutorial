
attribute vec2 position;

void main(){
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.0, 1.);
}