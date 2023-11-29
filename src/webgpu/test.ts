/* eslint-disable no-undef */
const GRID_SIZE = 32
const WORKGROUP_SIZE = 8

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
		struct VI {
			@location(0) pos: vec2f, //location(0) 对应layout 中的 shaderLocation
			@builtin(instance_index) instance: u32
		}

		struct VO {
			@builtin(position) pos: vec4f,
			@location(0) cell: vec2f
		}

		@group(0) @binding(0) var<uniform> grid: vec2f;
		@group(0) @binding(1) var<storage> cellState: array<u32>;

		@vertex //顶点着色器入口函数，返回 顶点在裁剪空间中的坐标[-1, 1]
		fn vertexMain(input: VI)  -> VO { 
			let i  = f32(input.instance); //instance_index 为内置的实例索引
			let cell = vec2f(i % grid.x, floor(i / grid.x));
			let  state = f32(cellState[input.instance]);
			let gridPos = (input.pos * state + cell * 2 + 1) / grid - 1; //由外到内转换裁剪空间坐标系，从[-1, 1] 先转换成 [0, 2], 再转换成 [0, 2 * grid]。一共 grid * grid 个 cell，每个 cell 长宽都为2

			var output: VO;
			output.pos = vec4f(gridPos, 0, 1);
			output.cell = cell;
			return output;
		}

		@fragment
		fn fragmentMain(input: VO) -> @location(0) vec4f { //location(0)表示将颜色写入 beginRenderPass 中的第0个 colorAttachment
			let c = input.cell / grid;
			return vec4f(c, 1 - c.x, 1);
		}
		`
	})

	//计算着色器
	const simulationShaderModule = device.createShaderModule({
		label: 'Game of Life simulation shader',
		code: `
		@group(0) @binding(0) var<uniform> grid: vec2f;
		@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
		@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

		fn cellIndex(cell: vec2u) -> u32 {
			return (cell.y % u32(grid.y)) * u32(grid.x) + (cell.x % u32(grid.x));
		}

		fn cellActive(x: u32, y: u32) -> u32 {
			return cellStateIn[cellIndex(vec2u(x, y))];
		}

		@compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE}, 1)
		fn computeMain(@builtin(global_invocation_id) cell: vec3u){
			let index = cellIndex(cell.xy);
			let activeNeighbors = cellActive(cell.x+1, cell.y+1) +
                        cellActive(cell.x+1, cell.y) +
                        cellActive(cell.x+1, cell.y-1) +
                        cellActive(cell.x, cell.y-1) +
                        cellActive(cell.x-1, cell.y-1) +
                        cellActive(cell.x-1, cell.y) +
                        cellActive(cell.x-1, cell.y+1) +
						cellActive(cell.x, cell.y+1);
			
			switch activeNeighbors {
				case 2: {
					cellStateOut[index] = cellStateIn[index];
				}
				case 3: {
					cellStateOut[index] = 1;
				}
				default:{
					cellStateOut[index] = 0;
				}
			}
		}
		`
	})

	const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE])
	const uniformBuffer = device.createBuffer({
		label: 'Grid Uniforms',
		size: uniformArray.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
	})
	device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

	// 记录 cell  开启状态的数组
	const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE)
	//创建一个 storage buffer，具有空间大，计算着色器中可读写的特点，但访问速度没有 uniform buffer 快
	const cellStateStorage = [
		device.createBuffer({
			label: 'Cell State',
			size: cellStateArray.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		}),
		device.createBuffer({
			label: 'Cell State',
			size: cellStateArray.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		})
	]
	for (let i = 0; i < cellStateArray.length; i++) {
		if (Math.random() > 0.6) cellStateArray[i] = 1
		else cellStateArray[i] = 0
	}
	device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)

	/**创建渲染管线，渲染流水线控制几何图形的绘制方式 */
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

	/**创建计算管线 */
	const simulationPipeline = device.createComputePipeline({
		label: 'Simulation pipeline',
		layout: 'auto', //与渲染管线共用 pipelineLayout
		compute: {
			module: simulationShaderModule,
			entryPoint: 'computeMain'
		}
	})

	//bindGroup是着色器可以同时访问的资源集合
	const cellBindGroups = [
		device.createBindGroup({
			label: 'Cell render bind group A',
			layout: cellPipeline.getBindGroupLayout(0), //此处的0对应着色器代码中的@group(0)
			entries: [
				{
					binding: 0, //此处的0对应着色器代码中的@binding(0)
					resource: {buffer: uniformBuffer}
				},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[0]}
				}
			]
		}),
		device.createBindGroup({
			label: 'Cell render bind group B',
			layout: cellPipeline.getBindGroupLayout(0), // 使用了渲染管线 pipeline 对象中的自动布局
			entries: [
				{
					binding: 0, //此处的0对应着色器代码中的@binding(0)
					resource: {buffer: uniformBuffer}
				},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[1]}
				}
			]
		})
	]

	const simulationBindGroups = [
		device.createBindGroup({
			label: 'simulation bind group A',
			layout: simulationPipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0, //此处的0对应着色器代码中的@binding(0)
					resource: {buffer: uniformBuffer}
				},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[0]}
				},
				{
					binding: 2,
					resource: {buffer: cellStateStorage[1]}
				}
			]
		}),
		device.createBindGroup({
			label: 'simulation bind group B',
			layout: simulationPipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0, //此处的0对应着色器代码中的@binding(0)
					resource: {buffer: uniformBuffer}
				},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[1]}
				},
				{
					binding: 2,
					resource: {buffer: cellStateStorage[0]}
				}
			]
		})
	]

	const UPDATE_INTERVAL = 200
	let step = 0
	function updateGrid() {
		if (!device || !context) return
		//GPUCommandEncoder，开始或结束渲染通道。通过 finish 接口创建命令缓冲区 command buffer
		const encoder = device.createCommandEncoder()
		//定义一个计算通道
		const computePass = encoder.beginComputePass()
		computePass.setPipeline(simulationPipeline)
		computePass.setBindGroup(0, simulationBindGroups[step % 2])
		const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE)
		computePass.dispatchWorkgroups(workgroupCount, workgroupCount)
		computePass.end()
		//GPURenderPassEncoder，定义一个渲染通道

		step++

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
		pass.setBindGroup(0, cellBindGroups[step % 2]) //此处的0对应着色器代码中的@group(0)
		pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE) //传入顶点着色器执行次数,即顶点个数，第二个参数是实例个数
		pass.end()

		//commandBuffer 提交后就无法再次使用
		const commandBuffer = encoder.finish()
		device.queue.submit([commandBuffer])
	}

	// updateGrid()
	setInterval(updateGrid, UPDATE_INTERVAL)
}

export default main
