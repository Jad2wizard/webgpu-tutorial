import vs from './vertex.glsl'
import fs from './fragment.glsl'

import {createProgram, createShader} from '../utils/utils'

function main(canvas: HTMLCanvasElement) {
	// Initialize the GL context
	const gl = canvas.getContext('webgl')

	// Only continue if WebGL is available and working
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.')
		return
	}

	const vertextShader = createShader(gl, gl.VERTEX_SHADER, vs)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)

	if (!vertextShader || !fragmentShader) return
	const program = createProgram(gl, vertextShader, fragmentShader)

	if (!program) return
	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')

	const positionBuffer = gl.createBuffer()

	//通过 ARRAY_BUFFER 操作webgl中的全局数据，绑定 positionBuffer 到 ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	const position = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]
	//通过 ARRAY_BUFFER 向 positionBuffer 中写入position数据，STATIC_DRAW 表示该数据不会经常变化
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)
	//init end

	//render

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT)

	//webgl 到裁剪空间 -1 -》 1 对应与屏幕的 0 -> canvas.width 和 0 -> canvas.height
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	gl.useProgram(program)

	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

	gl.enableVertexAttribArray(positionAttributeLocation)
	//a_position 属性通过 ARRAY_BUFFER 从 positionBuffer 中读取数据
	const numComponentOfOneData = 2 //每次着色器运行读取到属性数据个数
	const typeOfData = gl.FLOAT //属性的数据类型
	const normalize = false
	const strideToNextPieceOfData = 0 //每次着色器读取该属性后需要跳过多少位（数据个数乘以类型字节数）e.g.同一个buffer中存放了不同属性的数据
	const offsetIntoBuffer = 0 //读取时的起始偏移
	gl.vertexAttribPointer(
		positionAttributeLocation,
		numComponentOfOneData,
		typeOfData,
		normalize,
		strideToNextPieceOfData,
		offsetIntoBuffer
	)
	//通过 ARRAY_BUFFER 将 'a_position' 绑定到 positionBuffer 上, 后续 ARRAY_BUFFER 可以绑定到其它buffer后

	const primitiveType = gl.TRIANGLES
	const count = 6 //着色器运行次数
	gl.drawArrays(primitiveType, 0, count)
}

export default main
