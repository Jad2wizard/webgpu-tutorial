export const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
	const shader = gl.createShader(type)
	if (shader instanceof WebGLShader) {
		gl.shaderSource(shader, source)
		gl.compileShader(shader)

		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

		console.error(gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
	}
}

export const createProgram = (
	gl: WebGLRenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
) => {
	const program = gl.createProgram()

	if (program instanceof WebGLProgram) {
		gl.attachShader(program, vertexShader)
		gl.attachShader(program, fragmentShader)

		gl.linkProgram(program)

		if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
			return program
		}

		console.error(gl.getProgramInfoLog(program))
		gl.deleteProgram(program)
	}
}

export const setRectangle = (
	gl: WebGLRenderingContext,
	x: number,
	y: number,
	width: number,
	height: number
) => {
	let x1 = x
	let x2 = x + width
	let y1 = y
	let y2 = y + height
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
		gl.STATIC_DRAW
	)
}

// 在缓冲存储构成 'F' 的值
export const setGeometryF = (gl: WebGLRenderingContext) => {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			// 左竖
			0,
			0,
			30,
			0,
			0,
			150,
			0,
			150,
			30,
			0,
			30,
			150,

			// 上横
			30,
			0,
			100,
			0,
			30,
			30,
			30,
			30,
			100,
			0,
			100,
			30,

			// 中横
			30,
			60,
			67,
			60,
			30,
			90,
			30,
			90,
			67,
			60,
			67,
			90
		]),
		gl.STATIC_DRAW
	)
}
