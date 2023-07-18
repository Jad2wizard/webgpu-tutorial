import * as React from 'react'
import test from './test'
import styles from './index.less'

const {useCallback} = React

export default function WebglDemo() {
	const [count, setCount] = React.useState(1)
	const canvasRef = useCallback((dom: HTMLCanvasElement) => {
		if (dom) {
			dom.width = dom.offsetWidth
			dom.height = dom.offsetHeight
			test(dom)
		}
	}, [])

	return (
		<div className={styles.container}>
			<h1 onClick={() => setCount(count + 1)}>{count}</h1>
			<canvas className={styles.canvas} ref={canvasRef}></canvas>
		</div>
	)
}
