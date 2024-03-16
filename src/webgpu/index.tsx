import * as React from 'react'
import gameOfLife from './GameOfLife'
import styles from './index.less'

const {useCallback} = React

export default function WebglDemo() {
	const [count, setCount] = React.useState(1)
	const canvasRef = useCallback((dom: HTMLCanvasElement) => {
		if (dom) {
			dom.width = dom.offsetWidth
			dom.height = dom.offsetHeight
			gameOfLife(dom)
		}
	}, [])

	return (
		<div className={styles.container}>
			<canvas className={styles.canvas} ref={canvasRef}></canvas>
		</div>
	)
}
