import {getExclamationMarks} from './index'

describe('Test utils', () => {
	it('Test getExclamationMarks', () => {
		expect(getExclamationMarks(0)).toEqual('')
		expect(getExclamationMarks(1)).toEqual('')
		expect(getExclamationMarks(3)).toEqual('!!')
	})
})
