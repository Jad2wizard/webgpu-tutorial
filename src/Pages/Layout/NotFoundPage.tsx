import * as React from 'react'

const NotFound: React.FC<null> = () => {
	return (
		<div
			style={{
				width: '100%',
				height: '100%'
			}}
		>
			<h1
				style={{
					width: '100%',
					margin: 'auto'
				}}
			>
				Route Page not found!!
			</h1>
		</div>
	)
}

export default React.memo(NotFound)
