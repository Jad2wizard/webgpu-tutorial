import * as React from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import vert from './shaders/light/vert.glsl'
import frag from './shaders/light/frag.glsl'
import styles from './index.less'

const {useRef, useCallback, useState, useEffect} = React

export default function ThreeDemo() {
	const camera = useRef<null | THREE.Camera>(null)
	const controls = useRef<undefined | OrbitControls>()
	const scene = useRef<null | THREE.Scene>(null)
	const renderer = useRef<null | THREE.WebGLRenderer>(null)

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

	const animate = useCallback(() => {
		requestAnimationFrame(animate)
		if (renderer.current && scene.current && camera.current) {
			renderer.current.render(scene.current, camera.current)
			controls.current && controls.current.update()
			//@ts-ignore
			// window.b.rotation.y += 0.002
		}
	}, [])

	useEffect(() => {
		if (canvas) {
			const center = new THREE.Vector2(0, 0)
			camera.current = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 1, 10000)
			camera.current.position.set(center.x, center.y, 1000)

			scene.current = new THREE.Scene()
			const axesHelper = new THREE.AxesHelper(1000)
			scene.current.add(axesHelper)
			const geometry = new THREE.BoxGeometry(400, 400, 400)
			//@ts-ignore
			window.g = geometry
			//@ts-ignore
			const material = new THREE.ShaderMaterial({
				fragmentShader: frag,
				vertexShader: vert,
				uniforms: {
					lightIntensity: {value: 0.8},
					lightColor: {value: new THREE.Color('#ffffff')},
					lightDirection: {value: new THREE.Vector3(0, 0, 1).normalize()},
					ambientColor: {value: new THREE.Color('#666666')},
					uColor: {value: [1, 1, 1]}
				}
				// wireframe: true
				// transparent: true
			})
			//@ts-ignore
			window.m = material
			const mesh = new THREE.Mesh(geometry, material)
			//@ts-ignore
			window.b = mesh
			//@ts-ignore
			window.c = camera.current
			//@ts-ignore
			window.T = THREE
			scene.current.add(mesh)

			renderer.current = new THREE.WebGLRenderer({
				antialias: true,
				canvas
			})
			renderer.current.autoClear = true
			renderer.current.setClearColor(0x000000)

			controls.current = new OrbitControls(camera.current, canvas)

			animate()
		}
	}, [canvas, animate])

	return (
		<div className={styles.threeDemo}>
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}
