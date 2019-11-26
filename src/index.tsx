import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Hello from './components/Hello'

/* eslint-disable */
if ((module as any).hot) {
	;(module as any).hot.accept()
}
/* eslint-enable */

ReactDOM.render(
	<Hello name="Jad" enthusiasmLevel={3}></Hello>,
	document.getElementById('main') as HTMLElement
)
