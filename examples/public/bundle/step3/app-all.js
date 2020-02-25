Helpers = {
	sayHello(msgSource) {
		console.log('Helpers/sayHello/msgSource=' + (msgSource || ''));
	}
};
console.log('"Helpers.js" included');

Helpers.sayHello2 = function(msgSource) {
	console.log('Helpers/sayHello2/msgSource=' + (msgSource || ''));
};
console.log('"Helpers2.js" included');

Module1 = {}
console.log('"Module1/script1.js" included');


Module1.__proto__ = {
	sayHello: function () {
		console.log('Module1/sayHello');
		Helpers.sayHello('Module1')
	}
};
console.log('"Module1/script2.js" included');
Module2 = {}
console.log('"Module2/script1.js" included');

Module2.__proto__ = {
	sayHello: function () {
		console.log('Module2/sayHello');
	}
};
console.log('"Module1/script2.js" included');
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
//# sourceMappingURL=app-all.js.map