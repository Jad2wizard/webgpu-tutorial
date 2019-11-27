'use strict'
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: new P(function(resolve) {
							resolve(result.value)
					  }).then(fulfilled, rejected)
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next()
			)
		})
	}
Object.defineProperty(exports, '__esModule', {value: true})
function getExclamationMarks(numChar) {
	return Array(numChar).join('!')
}
exports.getExclamationMarks = getExclamationMarks
const a = '1'
const b = a + 1
console.log(b)
const delay = (timeout = 2000) =>
	new Promise(resolve => setTimeout(resolve, timeout))
const testAsync = () =>
	__awaiter(this, void 0, void 0, function*() {
		console.log('start tick')
		yield delay()
		console.log('end')
	})
exports.testAsync = testAsync
//# sourceMappingURL=index.js.map
