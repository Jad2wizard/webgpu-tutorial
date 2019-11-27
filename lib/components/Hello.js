'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const React = require('react')
const antd_1 = require('antd')
const utils_1 = require('utils')
//import * as THREE from 'three'
// import {OrbitControls} from 'three-examples/jsm/controls/OrbitControls'
const Hello_less_1 = require('./Hello.less')
const {useEffect, useState, useCallback} = React
/* eslint-enable */
const Hello = ({name, enthusiasmLevel = 1}) => {
	const [count, setCount] = useState(enthusiasmLevel)
	if (enthusiasmLevel <= 0) {
		throw new Error('You could be a little more enthusiastic. :D')
	}
	useEffect(() => {
		utils_1.testAsync()
	}, [])
	const handleClick = useCallback(() => {
		setCount(count + 1)
	}, [])
	return React.createElement(
		'div',
		{className: Hello_less_1.default.hello},
		React.createElement(
			'div',
			{className: Hello_less_1.default.greeting},
			'Hello ',
			name + utils_1.getExclamationMarks(count)
		),
		React.createElement(
			antd_1.Button,
			{onClick: handleClick},
			'\u70B9\u51FB'
		)
	)
}
exports.default = Hello
//# sourceMappingURL=Hello.js.map
