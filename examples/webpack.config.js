'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ConcatPlugin = require('webpack-concat-plugin');
const AfterConcatPlugin = require('../index.js');
//const HelloWorldPlugin = require('./hello-world-plugin.js');

module.exports = function (env, argv) {
	let config = {
		mode: argv.mode || 'development',
		devtool: 'source-map',
		context: path.resolve(__dirname),
		watch: false,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		entry: {
			'/bundle/App': './frontend/App.js'
		},
		output: {
			path: __dirname + "/public",
			sourceMapFilename: '[name].map',
			chunkFilename: '[id].chunk.js',
			filename: '[name].js'
		},
		"devServer": {
			"contentBase": './public'
		},
		plugins: [
			new webpack.ProgressPlugin()
			//, new HelloWorldPlugin({ options: true })
			,
			// Build "Module1.js|map"
			new ConcatPlugin({
				sourceMap: true,
				uglify: false,
				name: 'Module1',
				fileName: '[name].js',
				outputPath: '/bundle/',
				filesToConcat: [
					'./frontend/Module1/script1.js',
					'./frontend/Module1/script2.js',
				]
			}),
			// Build "Module2.js|map"
			new ConcatPlugin({
				sourceMap: true,
				uglify: true,
				name: 'Module2',
				fileName: '[name].js',
				outputPath: '/bundle/',
				filesToConcat: [
					'./frontend/Module2/script1.js',
					'./frontend/Module2/script2.js',
				]
			}),
			// Build "module-all.js|map" from previouse bundles.
			new AfterConcatPlugin({
				isTracelog: true,
				input: [
					'/bundle/Module1.js',
					'/bundle/Module2.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					uglify: true,
					name: 'module-all',
					fileName: '[name].js',
					outputPath: '/bundle/'
				}
			}),
			// Build "module-all2.js|map" from previouse bundles and custom script "Helpers.js".
			new AfterConcatPlugin({
				isTracelog: true,
				customPathPos: AfterConcatPlugin.getCustomPathPositions().BEGIN,
				input: [
					'/bundle/module-all.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					uglify: true,
					name: 'module-all2',
					fileName: '[name].js',
					outputPath: '/bundle/',
					filesToConcat: [
						'./frontend/Helpers.js'
					]
				}
			})
		]
	};
	/**
	 * Also we can use 'webpack-merge' for separate configs.
	 * Configs can be placed to different files and merged by
	 **/
	if (false) {
		config = merge(config, {
			plugins: [
				new ConcatPlugin({
					sourceMap: true,
					uglify: false,
					name: 'Module1',
					fileName: '[name].js',
					outputPath: '/bundle/',
					filesToConcat: [
						'./frontend/Module1/script1.js',
						'./frontend/Module1/script2.js',
					]
				}),
				new ConcatPlugin({
					sourceMap: true,
					uglify: true,
					name: 'Module2',
					fileName: '[name].js',
					outputPath: '/bundle/',
					filesToConcat: [
						'./frontend/Module2/script1.js',
						'./frontend/Module2/script2.js',
					]
				})
			]
		});
		config = merge(config, {
			plugins: [
				new AfterConcatPlugin({
					isTracelog: true,
					input: [
						'/bundle/Module1.js',
						'/bundle/Module2.js'
					],
					optionsNewConcatPlugin: {
						sourceMap: true,
						uglify: true,
						name: 'module-all',
						fileName: '[name].js',
						outputPath: '/bundle/'
					}
				})
			]
		});
	}

	return config;
};
