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
	pass.end()

	//commandBuffer 提交后就无法再次使用
	const commandBuffer = encoder.finish()
	device.queue.submit([commandBuffer])
}

export default main
