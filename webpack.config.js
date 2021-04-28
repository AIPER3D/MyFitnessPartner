const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	target: 'electron-renderer',
	module: {
		rules: [
			// {
			//   test: /\.ts/,
			//   use: 'ts-loader',
			//   include: [path.resolve(__dirname, 'src')]
			// },
			{
				test: /\.(ts|js|jsx|tsx)$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-typescript',
							'@babel/preset-react'
						],
						plugins: [
							'@babel/proposal-class-properties',
							'@babel/proposal-object-rest-spread',
							'babel-plugin-styled-components'
						]
					}
				}
			},
			{
				test: [/\.s[ac]ss$/i, /\.css$/i],
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader'
					// // Compiles Sass to CSS
					// 'sass-loader',
				],
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: {
					loader: 'file-loader',
					options: {
						esModule : false
					}
				}
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'file-loader'
				}]
			},
			{
				test: /\.worker\.(c|m)?js$/i,
				loader: 'worker-loader',
				options: {
					esModule: false,
				},
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'public/index.html'),
			filename: path.resolve(__dirname, 'build/index.html'),
			templateParameters(compilation, assets, options) {
				return {
					compilation: compilation,
					webpack: compilation.getStats().toJson(),
					webpackConfig: compilation.options,
					htmlWebpackPlugin: {
						files: assets,
						options: options
					},
					process,
				};
			},
			minify: {
				// collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true
			},
			nodeModules: process.env.NODE_ENV !== 'production' ? path.resolve(__dirname, '../node_modules') : false,
			// isBrowser: false,
      		isDevelopment: process.env.NODE_ENV !== 'production',
			
		})
	],
	resolve: {
		extensions: [".js", ".json", ".jsx", ".ts", ".tsx", ".css"],
		// extensions that are used
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath : '.'
	}
}