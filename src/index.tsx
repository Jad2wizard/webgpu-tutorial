import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import Webgl from './webgl'
import ThreeDemo from './three'

/* eslint-disable */
if ((module as any).hot) {
	;(module as any).hot.accept()
}
/* eslint-enable */

// const canvas = document.createElement('canvas')
// const root = document.querySelector('#main')
// root?.appendChild(canvas)
// canvas.width = 300
// canvas.height = 300
// const ctx = canvas.getContext('2d')
// //@ts-ignore
// window.ctx = ctx
// if (ctx) {
// 	ctx.fillStyle = '#ff0000aa'
// 	ctx.fillRect(0, 0, 200, 100)
// }

ReactDOM.render(<ThreeDemo />, document.querySelector('#main'))
// const iframe = document.querySelector('iframe')
// if (iframe) {
// 	window.addEventListener('message', e => {
// 		if (e.data === 'jl:init') {
// 			console.log('receive msg from jl: ', e.data)
// 			iframe.contentWindow?.postMessage('jad', '*')
// 		}
// 	})
// }
