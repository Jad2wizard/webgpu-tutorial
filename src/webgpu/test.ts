const genPositionAndIndex = (
	outerRadius: number,
	innerRadius: number,
	numSubDivisions: number
) => {
	const position: number[] = []
	const index: number[] = []
	const angleStride = (Math.PI * 2) / numSubDivisions
	let angle = 0
	for (let i = 0; i < numSubDivisions; ++i) {
		position.push(
			Math.sin(angle) * outerRadius,
			Math.cos(angle) * outerRadius,
			angle / (2 * Math.PI),
			Math.sin(angle) * innerRadius,
			Math.cos(angle) * innerRadius,
			angle / (2 * Math.PI)
		)
		const ni = i === numSubDivisions - 1 ? 0 : i + 1
		index.push(i * 2, i * 2 + 1, ni * 2, i * 2 + 1, ni * 2, ni * 2 + 1)
		angle += angleStride
	}
	return {
		vertexData: new Float32Array(position),
		indexData: new Uint32Array(index),
		numVertices: index.length
	}
}

async function main(canvas: any) {
	const adapter = await navigator.gpu?.requestAdapter()
	const device = await adapter?.requestDevice()
	if (!device) {
		fail('need a browser that supports WebGPU')
		return
	}

	// Get a WebGPU context from the canvas and configure it
	const context = canvas.getContext('webgpu')
	const presentationFormat = navigator.gpu.getPreferredCanvasFormat()
	context.configure({
		device,
		format: presentationFormat,
		alphaMode: 'premultiplied'
	})

	const module = device.createShaderModule({
		label: 'triangle shaders with uniforms',
		code: `
		struct VSOutput { //定义顶点着色器输出，color 作为 inter stage 变量，将顶点颜色通过 location(0) 传给片元着色器
			@builtin(position) position: vec4f,
			@location(0) opacity: f32
		}
		struct OurStruct {
			scale: f32,
			color: vec3f
		}

		//顶点 attribute 变量结构体，此处用于定义顶点着色器的输入参数
		struct Vertex {
			@location(0) position: vec2f, //position attribute，此处的 location(0)和 VSOutput.color 的 location(0) 是不一样的。一个是顶点着色器 attribute 的通道，一个是顶点着色器到片元着色器的 inter-stage 变量通道
			@location(1) angle: f32, //position attribute，此处的 location(0)和 VSOutput.color 的 location(0) 是不一样的。一个是顶点着色器 attribute 的通道，一个是顶点着色器到片元着色器的 inter-stage 变量通道
		}

		@group(0) @binding(0) var<uniform> ourStruct: OurStruct;

		@vertex fn vs(vert: Vertex) -> VSOutput {
			var output: VSOutput;
			output.position = vec4f(vert.position * vec2f(ourStruct.scale), 0, 1);
			output.opacity = vert.angle;
			return output;
		}
  
		@fragment fn fs(@location(0) opacity: f32) -> @location(0) vec4f {
			return vec4f(ourStruct.color, opacity);
		}
	  `
	})

	const {vertexData, indexData, numVertices} = genPositionAndIndex(
		0.45,
		0.3,
		16 * 1024
	)

	//定义 vertext buffer，该 buffer 存放了position 和 color 两个 attribute
	const vertexBuffer = device.createBuffer({
		label: 'vertex buffer vertices',
		size: vertexData.byteLength,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
	})
	device.queue.writeBuffer(vertexBuffer, 0, vertexData)

	const indexBuffer = device.createBuffer({
		label: 'index buffer',
		size: indexData.byteLength,
		usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
	})
	device.queue.writeBuffer(indexBuffer, 0, indexData)

	const pipeline = device.createRenderPipeline({
		label: 'our hardcoded red triangle pipeline',
		layout: 'auto',
		vertex: {
			module,
			entryPoint: 'vs',
			buffers: [
				{
					//描述第一个 buffer layout，此处并不创建实际的 buffer
					arrayStride: (2 + 1) * 4, //  等于一个顶点放在 vertexBuff 中的所有 attribute 的数据长度。position attribute 为 vec2f 类型，每个 position 在 buffer 中的长度位2 * 4字节，color 为 3 * 4字节
					attributes: [
						{
							//position attribute
							shaderLocation: 0, //每个 attribute 点一个唯一索引值，0-15。shaderLocation 与该 attribute 在顶点着色器中定义的该 attribute 变量的@location 必须保持一致
							offset: 0, //表示该 attribute 在 buffer 中的偏移字节数
							format: 'float32x2' //attribute 的数据类型
						},
						{
							//angle attribute
							shaderLocation: 1, //每个 attribute 点一个唯一索引值，0-15。shaderLocation 与该 attribute 在顶点着色器中定义的该 attribute 变量的@location 必须保持一致
							offset: 2 * 4, //表示该 attribute 在 buffer 中的偏移字节数
							format: 'float32' //attribute 的数据类型
						}
					]
				}
			]
		},
		fragment: {
			module,
			entryPoint: 'fs',
			targets: [{format: presentationFormat}]
		}
	})

	//color 16字节 + scale 8字节 + offset 8字节，一共需要一个32字节长度的 buffer 来存放 uniform
	const uniformBufferSize = 4 + 12 + 12 + 4
	//uniformBuffer 是一个 GPUBuffer，用于存放color,scale,offset的值
	const uniformBuffer = device.createBuffer({
		label: 'uniforms for triangle',
		size: uniformBufferSize,
		// eslint-disable-next-line no-undef
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
	})
	//uniformValue 是一个 typedArray，用于写入uniform
	const uniformValue = new Float32Array(uniformBufferSize / 4)
	//根据 color,scale,offset 在 OurStruct 中的顺序， 将三个值通过uniformValue 写入 buffer
	uniformValue.set([0.5], 0) //写入scale， 在 typedArray 中的偏移量为color 的长度，即4
	uniformValue.set([1, 0, 0], 4) //写入color， 在 typedArray 中的偏移量为0

	//创建 bindGroup 对象，将 buffer 绑定到@binding(0)位置
	const bindGroup = device.createBindGroup({
		label: 'triangle bind group',
		layout: pipeline.getBindGroupLayout(0),
		entries: [{binding: 0, resource: {buffer: uniformBuffer}}]
	})

	const renderPassDescriptor = {
		label: 'our basic canvas renderPass',
		colorAttachments: [
			{
				// view: <- to be filled out when we render
				clearValue: [0.8, 0.8, 0.8, 1],
				loadOp: 'clear',
				storeOp: 'store'
			}
		]
	}

	function render() {
		if (!device) return

		//将 uniform 的值从  js 的 typedArray 读入到 GPUBuffer 中
		device.queue.writeBuffer(uniformBuffer, 0, uniformValue)
		// Get the current texture from the canvas context and
		// set it as the texture to render to.
		renderPassDescriptor.colorAttachments[0].view = context
			.getCurrentTexture()
			.createView()

		// make a command encoder to start encoding commands
		const encoder = device.createCommandEncoder({label: 'our encoder'})

		// make a render pass encoder to encode render specific commands
		const pass = encoder.beginRenderPass(renderPassDescriptor)
		pass.setPipeline(pipeline)
		pass.setVertexBuffer(0, vertexBuffer)
		pass.setIndexBuffer(indexBuffer, 'uint32')
		pass.setBindGroup(0, bindGroup)
		pass.drawIndexed(numVertices) // call our vertex shader 3 times.
		pass.end()

		const commandBuffer = encoder.finish()
		device.queue.submit([commandBuffer])
	}

	render()
}

export default main
