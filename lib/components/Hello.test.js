'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const React = require('react')
const enzyme = require('enzyme')
const Hello_1 = require('./Hello')
const Hello_less_1 = require('./Hello.less')
it('Test render', () => {
	const hello = enzyme.shallow(
		React.createElement(Hello_1.default, {name: 'jad', enthusiasmLevel: 2})
	)
	console.log('running...')
	console.log(Hello_less_1.default)
	expect(hello.find('.' + Hello_less_1.default.greeting).text()).toEqual(
		'Hello jad!'
	)
})
//# sourceMappingURL=Hello.test.js.map
