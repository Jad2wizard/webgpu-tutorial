import * as React from 'react'
import {Button} from 'antd'
import {getExclamationMarks, testAsync} from 'utils'
//import * as THREE from 'three'
// import {OrbitControls} from 'three-examples/jsm/controls/OrbitControls'
import styles from './Hello.less'

const {useEffect, useState, useCallback} = React

// console.log(OrbitControls)
// const control = new OrbitControls(new THREE.Camera())

/* eslint-disable */
interface Props {
	name: string
	enthusiasmLevel?: number
}
/* eslint-enable */

const Hello: React.FC<Props> = ({name, enthusiasmLevel = 1}) => {
	const [count, setCount] = useState(enthusiasmLevel)

	if (enthusiasmLevel <= 0) {
		throw new Error('You could be a little more enthusiastic. :D')
	}

	useEffect(() => {
		testAsync()
	}, [])

	const handleClick = useCallback(() => {
		setCount(count + 1)
	}, [])

	return (
		<div className={styles.hello}>
			<div className={styles.greeting}>
				Hello {name + getExclamationMarks(count)}
			</div>
			<Button onClick={handleClick}>点击</Button>
		</div>
	)
}

export default Hello
