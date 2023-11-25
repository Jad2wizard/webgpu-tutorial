async function main(canvas: HTMLCanvasElement) {
	const adapter = await navigator.gpu?.requestAdapter()
	const device = await adapter?.requestDevice()
	if (!device) {
		fail('need a browser that supports WebGPU')
		return
	}

	// Get a WebGPU context from the canvas and configure it
	const context = canvas.getContext('webgpu')
	if (!context) return
	const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
	//配置 canvas 作为device 的输出纹理。device 并不与某个 canvas 绑定。
	//一个 device 可以输出渲染到多个画布上
	context.configure({
		device,
		format: canvasFormat //纹理格式
	})

	/**准备顶点数据 */
	const vertices = new Float32Array([
		-0.8,
		-0.8,
		0.8,
		-0.8,
		0.8,
		0.8,
		-0.8,
		-0.8,
		0.8,
		0.8,
		-0.8,
		0.8
	])

	//GPU 无法直接访问 vertices 数组，先在显存中穿件一个 buffer 用于存放顶点数据，
	//所以 vertexBuffer 的大小需要和 vertices 的一致
	const vertexBuffer = device.createBuffer({
		label: 'Cell vertices',
		size: vertices.byteLength,
		//buffer 用于存放顶点数据以及能将数据拷贝到该 buffer 中
		// eslint-disable-next-line no-undef
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
	})

	//将顶点数据从 typedarray 中复制到显存 buffer
	device.queue.writeBuffer(vertexBuffer, 0, vertices)

	//将数据写入 buffer 之后，虽然 GPU 可以获取到数据，但数据只是一个字节 blob
	//我们需要定义数据的结构，以方便GPU能够正确地读取到每个顶点的数据
	const vertexBufferLayout = {
		arrayStride: 8, //GPU在读取下一个顶点到数据时需要调过到字节数，本例中每个顶点包含两个浮点数组成的坐标，所以时8字节
		attributes: [
			//顶点属性列表，本例中只有一个 position 属性
			{
				format: 'float32x2', //属性的数据格式
				offset: 0, //buffer 中有多个属性数据时，当前属性在 buffer 中的偏移字节数
				shaderLocation: 0 //属性的通道编号，对应于 shader 中的@location(0)，作为属性在 shader 中的唯一标识
			}
		]
	}

	/**定义着色器 */
	const cellShaderModule = device.createShaderModule({
		label: 'Cell shader',
		code: `
		@vertex //顶点着色器入口函数，返回 顶点在裁剪空间中的坐标[-1, 1]
		fn vertexMain(@location(0) pos: vec2f)  -> @builtin(position) vec4f { //location(0) 对应layout 中的 shaderLocation
			return vec4f(pos, 0, 1);
		}

		@fragment
		fn fragmentMain() -> @location(0) vec4f { //location(0)表示将颜色写入 beginRenderPass 中的第0个 colorAttachment
			return vec4f(1, 0, 0, 1);
		}
		`
	})

	/**创建渲染流水线，渲染流水线控制几何图形的绘制方式 */
	const cellPipeline = device.createRenderPipeline({
		label: 'Cell pipeline',
		layout: 'auto',
		vertex: {
			module: cellShaderModule,
			entryPoint: 'vertexMain',
			//@ts-ignore
			buffers: [vertexBufferLayout] //描述数据如何打包到 pipeline 的顶点缓冲区中
		},
		fragment: {
			module: cellShaderModule,
			entryPoint: 'fragmentMain',
			targets: [
				{
					format: canvasFormat
				}
			]
		}
	})

	//GPUCommandEncoder，开始或结束渲染通道。通过 finish 接口创建命令缓冲区 command buffer
	const encoder = device.createCommandEncoder()
	//GPURenderPassEncoder，定义一个渲染通道
	const pass = encoder.beginRenderPass({
		colorAttachments: [
			{
				view: context.getCurrentTexture().createView(), //渲染通道到输出纹理
				loadOp: 'clear', //渲染通道开启前用clearValue 清空输出纹理，即 canvas
				storeOp: 'store', //渲染通道完成以后，将绘制结果保存到输出纹理
				clearValue: {r: 0, g: 0.235, b: 0.3804, a: 0.1} //透明度设置无效
			}
		]
	})
	pass.setPipeline(cellPipeline)
	pass.setVertexBuffer(0, vertexBuffer) //将 vertexBuffer 与 pipeline.vertex.buffers[0] 对应起来
	pass.draw(vertices.length / 2) //传入顶点着色器执行次数,即顶点个数
	pass.end()

	//commandBuffer 提交后就无法再次使用
	const commandBuffer = encoder.finish()
	device.queue.submit([commandBuffer])
}

export default main
