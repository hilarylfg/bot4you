const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = function (options, webpack) {
	return {
		...options,
		entry: './src/main.ts',
		externals: [
			nodeExternals({
				allowlist: ['tsconfig-paths']
			})
		],
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist')
		},
		resolve: {
			extensions: ['.ts', '.js'],
			plugins: [
				new TsconfigPathsPlugin({
					configFile: './tsconfig.json'
				})
			]
		}
	}
}
