import * as React from 'react'

interface HelloProps {
	compiler: string
	framework: string
}

export const Hello = (props: HelloProps) => {
	return (
		<h1 style={{width: '100%'}} onClick={() => {}}>
			Hello from {props.compiler} and {props.framework}!
		</h1>
	)
}
