'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const index_1 = require('./index')
describe('Test utils', () => {
	it('Test getExclamationMarks', () => {
		expect(index_1.getExclamationMarks(0)).toEqual('')
		expect(index_1.getExclamationMarks(1)).toEqual('')
		expect(index_1.getExclamationMarks(3)).toEqual('!!')
	})
})
//# sourceMappingURL=index.test.js.map
