'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ConcatPlugin = require('webpack-concat-plugin');
const AfterConcatPlugin = require('../index.js');
//const HelloWorldPlugin = require('./hello-world-plugin.js');

module.exports = function(env, argv) {
	let config = {
		mode: argv.mode || 'development',
		devtool: 'source-map',
		context: path.resolve(__dirname),
		watch: false,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		/**
		 * We don't use any entrypoint in this example.
		 * But a webpack requires at least one.
		 */
		entry: {
			'/bundle/entry-App': './frontend/App.js',
			'/bundle/entry-Helpers': './frontend/Helpers.js'
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
			/**----------------------------------------------------------------
			 * STEP 1.
			 * Using base "ConcatPlugin" for base bundling from 'frontend' directory.
			 **/
			/**
			 * Step1-1-js. Create "./public/bundle/Module1.js|map"
			 * "./public/bundle/Module1.js" <<  "./frontend/Module1/script1.js" + "./frontend/Module1/script2.js"
			 */
			new ConcatPlugin({
				sourceMap: true,
				uglify: false,
				name: 'Module1',
				fileName: '[name].js',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/Module1/script1.js',
					'./frontend/Module1/script2.js'
				]
			}),
			/**
			 * Step1-1-css. Create "./public/bundle/Module1.css|map"
			 * "./public/bundle/Module1.css" <<  "./frontend/Module1/component1.css" + "./frontend/Module1/component2.css"
			 */
			new ConcatPlugin({
				//sourceMap: true,
				//uglify: false, // Warning! Don't use uglify for *.css
				name: 'Module1',
				fileName: '[name].css',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/Module1/component1.css',
					'./frontend/Module1/component2.css',
				]
			}),
			/**
			 * Step1-2-js. Create "./public/bundle/Module2.js|map"
			 * "./public/bundle/Module2.js" <<  "./frontend/Module2/script1.js" + "./frontend/Module1/script2.js"
			 */
			new ConcatPlugin({
				sourceMap: true,
				uglify: true,
				name: 'Module2',
				fileName: '[name].js',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/Module2/script1.js',
					'./frontend/Module2/script2.js',
				]
			}),
			/**
			 * Step1-2-css. Create "./public/bundle/Module2.css|map"
			 * "./public/bundle/Module2.css" <<  "./frontend/Module2/component1.css" + "./frontend/Module2/component2.css"
			 */
			new ConcatPlugin({
				//sourceMap: true,
				//uglify: false,
				name: 'Module2',
				fileName: '[name].css',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/Module2/component1.css',
					'./frontend/Module2/component2.css',
				]
			}),
			/**
			 * Step1-3-js. Create "./public/bundle/Helpers.js|map"
			 * "./public/bundle/Module2.js" <<  "./frontend/Module2/script1.js" + "./frontend/Module1/script2.js"
			 */
			new ConcatPlugin({
				sourceMap: true,
				uglify: true,
				name: 'Helpers',
				fileName: '[name].js',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/Helpers.js',
					'./frontend/Helpers2.js',
				]
			}),
			new ConcatPlugin({
				//sourceMap: true,
				//uglify: false,
				name: 'common',
				fileName: '[name].css',
				outputPath: '/bundle/step1/',
				filesToConcat: [
					'./frontend/common.css',
				]
			}),
			/**----------------------------------------------------------------
			 * STEP 2.
			 * Using own "AfterConcatPlugin" for create "bundles from bundles" from step1.
			 **/
			/** Step2-1. Create './public/bundle/module-all.js'
			 * './public/bundle/module-all.js' << './public/bundle/Module1.js' + './public/bundle/Module2.js'
			 * @see: "Step1-1-js" and "Step1-2-js" is source.
			 */
			// Build "module-all.js|map" from previouse bundles.
			new AfterConcatPlugin({
				input: [
					'/bundle/step1/Module1.js',
					'/bundle/step1/Module2.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					uglify: true,
					name: 'module-all',
					fileName: '[name].js',
					outputPath: '/bundle/step2/'
				}
			}),
			/** Step2-2. Create './public/bundle/module-all.css'
			 * './public/bundle/module-all.css' << './public/bundle/Module1.js' + './public/bundle/Module2.js'
			 * @see: "Step1-1-css" and "Step1-2-css" is source.
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				input: [
					'/bundle/step1/Module1.css',
					'/bundle/step1/Module2.css'
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					//uglify: false,// Warning! Don't use "uglify : true" for *.css files
					name: 'module-all',
					fileName: '[name].css',
					outputPath: '/bundle/step2/'
				}
			}),
			/**----------------------------------------------------------------
			 * STEP 3.
			 * Using own "AfterConcatPlugin" for create "bundles from bundles" from step1 and step2.
			 **/
			/**
			 * Create superbundle 'app-all.js' from "frontend", step1, step2.
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				input: [
					'/bundle/step1/Helpers.js',
					'/bundle/step2/module-all.js',
					//'/bundle/entry-App.js' // @warning: We can't use entrypoint for concat :(. But we can bundle "frontend/App.js" on step1
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					uglify: false,
					name: 'app-all',
					fileName: '[name].js',
					outputPath: '/bundle/step3/',
					filesToConcat: [
						'./frontend/App.js' // Also we can use "frontend/App.js" like this.
											// But if "App.js" separated to many files, better way - concat them on step1.
					]
				}
			}),
			/**
			 * Create superbundle 'app-all.css' from "frontend", step1, step2.
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				input: [
					'/bundle/step1/common.css',
					'/bundle/step2/module-all.css'
				],
				optionsNewConcatPlugin: {
					sourceMap: true,
					//uglify: false,// Warning! Don't use "uglify : true" for *.css files
					name: 'app-all',
					fileName: '[name].css',
					outputPath: '/bundle/step3/'
				}
			}),
		]
	};
	// ------------------------------------------------------------------------
	// Advanced samples
	// -----
	/**
	 * We can use 'webpack-merge' for separate configs.
	 * Configs can be placed to different files and merged by
	 **/
	config = merge(config, {
		plugins: [
			/**
			 * We can define any plugin (e.g. ConcatPlugin).
			 */
			new ConcatPlugin({
				sourceMap: false,
				uglify: false,
				name: 'ConcatPlugin_Module1',
				fileName: '[name].js',
				outputPath: '/bundle/trash',
				filesToConcat: [
					'./frontend/Module1/script1.js',
					'./frontend/Module1/script2.js'
				]
			}),
			/**
			 * '/bundle/Module1.js' + '/bundle/Module2.js'
			 */
			new AfterConcatPlugin({
				/**
				 * @note: use this option if you want get info about this bundle process.
				 * Or use "$webpack --display-modules" for enable tracelog for all instances of AfterConcatPlugin.
				 * @type {Boolean} isTracelog
				 */
				isTracelog: false,
				input: [
					'/bundle/step1/Module1.js',
					'/bundle/step1/Module2.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: false,
					uglify: false,
					name: 'B_Module1+B_Module2',
					fileName: '[name].js',
					outputPath: '/bundle/trash/'
				}
			}),
			/**
			 * '/bundle/Module1.js' + '/bundle/Module2.js' + '/frontend/Helpers.js'
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				input: [
					'/bundle/step1/Module1.js',
					'/bundle/step1/Module2.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: false,
					uglify: false,
					name: 'B_Module1+B_Module2+F_Helpers',
					fileName: '[name].js',
					outputPath: '/bundle/trash/',
					filesToConcat: [
						'./frontend/Helpers.js'
					]
				}
			}),
			/**
			 * '/bundle/Module1.js' + '/bundle/Module2.js' + '/frontend/Helpers.js'
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				customPathPos: AfterConcatPlugin.getCustomPathPositions().BEGIN, // @note: use this flag for chage concat position
				input: [
					//'./frontend/Helpers.js', // @note: this don't work - use option "customPathPos" above and filesToConcat bellow
					'/bundle/step1/Module1.js',
					'/bundle/step1/Module2.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: false,
					uglify: false,
					name: 'F_Helpers+B_Module1+B_Module2',
					fileName: '[name].js',
					outputPath: '/bundle/trash/',
					filesToConcat: [
						'./frontend/Helpers.js'
					]
				}
			}),
			/**
			 * 'frontend/Helpers.js' + '/bundle/module-all.js'
			 */
			new AfterConcatPlugin({
				// isTracelog: true,
				customPathPos: AfterConcatPlugin.getCustomPathPositions().BEGIN,
				input: [
					'/bundle/step2/module-all.js'
				],
				optionsNewConcatPlugin: {
					sourceMap: false,
					uglify: false,
					name: 'F_Helpers+B_module-all',
					fileName: '[name].js',
					outputPath: '/bundle/trash/',
					filesToConcat: [
						'./frontend/Helpers.js'
					]
				}
			})
		]
	});
	
	return config;
};
