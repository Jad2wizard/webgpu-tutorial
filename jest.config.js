module.exports = {
	setupFiles: ['./jest.setup.js'],
	transform: {
		'^.+\\.(css|less)?$':
			'<rootDir>/node_modules/jest-css-modules-transform',
		'^.+\\.js?$': 'babel-jest',
		'^.+\\.ts[x]?$': 'ts-jest'
	},
	moduleFileExtensions: ['tsx', 'ts', 'less', 'js', 'json', 'jsx'],
	moduleNameMapper: {
		'^utils(.*)$': '<rootDir>/src/utils$1',
		'^three-examples(.*)$': '<rootDir>/node_modules/three/examples$1'
	}
}
