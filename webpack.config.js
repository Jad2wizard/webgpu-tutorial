/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const {port} = require('./config.json')
const {TsConfigPathsPlugin} = require('awesome-typescript-loader')

// prettier-ignore
module.exports = (env, argv) => {
	const isDev = argv.mode === 'development'
	const config = {
		entry: {
			main: isDev
				? [
					'eventsource-polyfill',
					`webpack-hot-middleware/client?path=http://127.0.0.1:${port}/__webpack_hmr&timeout=20000`,
					'./src/index.tsx'
				]
				: ['./src/index.tsx']
		},
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist/js'),
			publicPath: '/js/'
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			plugins: [
				new TsConfigPathsPlugin('./tsconfig.json')
			]
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.(css)/,
					loader:
						'style-loader!css-loader?modules&localIdentName=[path][name]--[local]--[hash:base64:5]'
				},
				{
					test: /\.(less)/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName:
									'[path][name]--[local]--[hash:base64:5]'
							}
						},
						'less-loader'
					]
				},
				{
					test: /\.(png|jpg)/,
					loader: 'url-loader?limit=8192'
				}
			]
		},
		plugins: [
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: require(__dirname + '/dist/js/manifest.json')
			}),
		]
	}

	if (isDev) {
		config.mode = 'development'
		config.devtool = 'inline-source-map'
		config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
		config.plugins.push(new webpack.HotModuleReplacementPlugin())
	} else {
		config.mode = 'production'
		config.devtool = 'source-map'
	}
	return config
}
