/**
 * @link: https://webpack.js.org/contribute/writing-a-plugin/#example
 */

class HelloWorldPlugin {
	apply(compiler) {
		console.log('HelloWorldPlugin/1');
		compiler.hooks.done.tap('Hello World Plugin/2', (
			stats /* stats is passed as argument when done hook is tapped.  */
		) => {
			console.log('Hello World!/3', stats);
		});
	}
}

module.exports = HelloWorldPlugin;