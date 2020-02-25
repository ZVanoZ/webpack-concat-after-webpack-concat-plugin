let App = {
	run() {
		console.log('App/run')
		Module1.sayHello();
		Module2.sayHello();
		Helpers.sayHello2('App');
	}
};
console.log('"App.js" included');
App.run();
