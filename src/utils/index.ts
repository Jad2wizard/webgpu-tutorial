function getExclamationMarks(numChar: number): string {
	return Array(numChar).join('!')
}

const delay = (timeout = 2000): Promise<string> => new Promise(resolve => setTimeout(resolve, timeout))

const testAsync = async (): Promise<void> => {
	console.log('start tick')
	await delay()
	console.log('end')
}

export {getExclamationMarks, delay}
