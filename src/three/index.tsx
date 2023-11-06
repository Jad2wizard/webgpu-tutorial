import * as React from 'react'
import * as THREE from 'three'
import vert from './shaders/vert.glsl'
import frag from './shaders/frag.glsl'
import styles from './index.less'

const {useRef, useCallback, useState, useEffect} = React

export default function ThreeDemo() {
	const camera = useRef<null | THREE.Camera>(null)
	const scene = useRef<null | THREE.Scene>(null)
	const clock = useRef<null | THREE.Clock>(null)
	const renderer = useRef<null | THREE.WebGLRenderer>(null)
	const uniforms = useRef<null | Record<string, THREE.IUniform<any>>>(null)

	const [canvas, setCanvas] = useState<null | HTMLCanvasElement>(null)

	//@ts-ignore
	window.canvas = canvas

	const canvasRef = useCallback(node => {
		if (node) {
			node.width = node.offsetWidth
			node.height = node.offsetHeight
			setCanvas(node)
		}
	}, [])

	const onResize = useCallback(() => {
		if (renderer.current && uniforms.current) {
			const {width, height} = renderer.current.domElement
			renderer.current.setSize(width, height)
			uniforms.current.uResolution.value.x = width
			uniforms.current.uResolution.value.y = height
		}
	}, [])

	const animate = useCallback(() => {
		requestAnimationFrame(animate)
		if (
			renderer.current &&
			scene.current &&
			camera.current &&
			clock.current &&
			uniforms.current
		) {
			uniforms.current.uTime.value += clock.current.getDelta()
			renderer.current.render(scene.current, camera.current)
		}
	}, [])

	useEffect(() => {
		if (canvas) {
			const center = new THREE.Vector2(0, 0)
			camera.current = new THREE.Camera() //投影矩阵喂单位矩阵, 相当于left,right 都为1的正交矩阵
			camera.current.position.z = 1

			scene.current = new THREE.Scene()

			clock.current = new THREE.Clock()

			uniforms.current = {
				uTime: {value: 1.0},
				uResolution: {value: new THREE.Vector2()},
				uMouse: {value: new THREE.Vector2()}
			}
			const material = new THREE.ShaderMaterial({
				fragmentShader: frag,
				vertexShader: vert,
				uniforms: uniforms.current
			})

			const mesh = new THREE.Mesh(
				new THREE.PlaneBufferGeometry(2, 2),
				material
			)
			scene.current.add(mesh)

			//@ts-ignore
			window.c = camera.current
			//@ts-ignore
			window.s = scene.current
			//@ts-ignore
			window.T = THREE

			renderer.current = new THREE.WebGLRenderer({
				antialias: true,
				canvas
			})
			renderer.current.autoClear = true
			renderer.current.setClearColor(0x000000)

			onResize()
			window.addEventListener('resize', onResize, false)

			animate()
		}
	}, [canvas, animate, onResize])

	return (
		<div className={styles.threeDemo}>
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}
