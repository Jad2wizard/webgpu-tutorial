import * as React from 'react'
import {useState} from 'react'

interface HelloProps {
	compiler: string
	framework: string
}

export const Hello = (props: HelloProps) => {
	const [count, setCount] = useState(0)
	return (
		<h1
			style={{width: '100%'}}
			onClick={() => setCount(count => count + 1)}
		>
			Hello from {props.compiler} and {props.framework}!{count}
		</h1>
	)
}
