'use strict';
//const webpack = require('webpack');
const ConcatPlugin = require('webpack-concat-plugin');

/**
 * WebpackPluginInstance
 * webpack.ConcatPlugin
 * webpack.Compiler
 * @see: WebpackPluginInstance into node_modules/webpack/declarations/WebpackOptions.d.ts
 * @see: WebpackPluginFunction into node_modules/webpack/declarations/WebpackOptions.d.ts
 */
class Plugin {
	static getCustomPathPositions() {
		return {
			BEGIN: 'CUSTOM_PATH_POS_BEGIN',
			END: 'CUSTOM_PATH_POS_END',
		};
	}

	constructor(options) {
		// console.log('___/plugin/constructor: ', this);
		this.options = options;
		if ('object' !== typeof (this.options)) {
			throw new Error('"options" is not Object');
		}
		this.options.isTracelog = this.options.isTracelog || false;
		this.options.customPathPos = this.options.customPathPos || Plugin.getCustomPathPositions().END;
		if (!options.input) {
			throw new Error('"options.input" is empty');
		}
		if (!Array.isArray(options.input)) {
			throw new Error('"options.input" is not Array');
		}
		if ('object' !== typeof (this.options.optionsNewConcatPlugin)) {
			throw new Error('"options.optionsNewConcatPlugin" is not Object');
		}
	}

	/**
	 * @param compiler {Compiler} @see: node_modules/webpack/lib/Compiler.js
	 */
	apply(compiler) {
		// console.log('compiler', compiler.options.plugins.length);
		this.tracelog('=====webpack-concat-after-webpack-concat-plugin=====');
		if (this.options.optionsNewConcatPlugin.sourceMap
			&& !this.options.optionsNewConcatPlugin.uglify
		) {
			console.warn(
				'WARNING: Source maps don\'t work without uglify! '
				+ "\n" + '_ Cause is "floridoo/concat-with-sourcemaps".'
				+ "\n" + '_ @see: https://github.com/floridoo/concat-with-sourcemaps/issues/8',
				{
					options: this.options
				}
			);
		}
		let optionsNewConcatPlugin = Object.assign({
			filesToConcat: [ '' ]
		}, this.options.optionsNewConcatPlugin);
		let newConcatPlugin = new ConcatPlugin(optionsNewConcatPlugin);
		this.tracelog('START: ', `${newConcatPlugin.settings.outputPath}${newConcatPlugin.getFileName()}`);
		let filesToConcat = [];
		this.options.input.forEach((inputPath) => {
			this.tracelog('FIND_PATH: ', inputPath);
			let isFound = false;
			compiler.options.plugins.forEach((plugin) => {
				// Condition with "instanceof" do not work! Why???
				// if (!(plugin instanceof ConcatPlugin)) {
				if (!('ConcatPlugin' === plugin.constructor.name)) {
					this.tracelog('SKIPPED_PLUGIN: ', plugin.constructor.name);
					return;
				}
				let pluginOutPath = `${plugin.settings.outputPath}${plugin.getFileName()}`;
				if (inputPath !== pluginOutPath) {
					this.tracelog('SKIPPED_PATH: ', pluginOutPath);
					return;
				}
				isFound = true;
				plugin.settings.filesToConcat.forEach((filePath) => {
					filesToConcat.push(filePath);
					this.tracelog('ADDED: ', filePath);
				});
			});
			if (!isFound) {
				console.error(
					new Error('Not found input point "' + inputPath + '" for "webpack-concat-after-webpack-concat-plugin".'),
					{
						options: this.options
					}
				);
			}
		});
		if (filesToConcat.length < 1) {
			this.tracelog('WARNING: can\'t find files to concat.');
		} else {
			newConcatPlugin.settings.filesToConcat.forEach((filePath) => {
				if (filePath === '') {
					return;
				}
				if (this.options.customPathPos === Plugin.getCustomPathPositions().BEGIN) {
					filesToConcat.unshift(filePath)
				} else {
					filesToConcat.push(filePath)
				}
			});
			this.tracelog('RESULT: ', filesToConcat);

			newConcatPlugin.settings.filesToConcat = filesToConcat;
			compiler.options.plugins.push(newConcatPlugin);
		}
		this.tracelog('END: ', this.options.output);
	}

	tracelog(...args) {
		if (!this.options.isTracelog) {
			return;
		}
		console.log.apply(this, args);
	}
}

module.exports = Plugin;