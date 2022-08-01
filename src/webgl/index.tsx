import * as React from 'react'
import test1 from './test1'
import styles from './index.less'

const {useCallback} = React

export default function WebglDemo() {
	const canvasRef = useCallback((dom: HTMLCanvasElement) => {
		if (dom) {
			dom.width = dom.offsetWidth
			dom.height = dom.offsetHeight
			test1(dom)
		}
	}, [])

	return (
		<div className={styles.container}>
			<canvas className={styles.canvas} ref={canvasRef}></canvas>
			<div id="uiContainer">
				<div id="ui" className={styles.ui}>
					<div id="x"></div>
					<div id="y"></div>
					<div id="angle"></div>
				</div>
			</div>
		</div>
	)
}
