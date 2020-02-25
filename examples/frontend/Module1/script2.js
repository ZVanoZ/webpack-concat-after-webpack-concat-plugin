Module1.__proto__ = {
	sayHello: function () {
		console.log('Module1/sayHello');
		Helpers.sayHello('Module1')
	}
};
console.log('"Module1/script2.js" included');