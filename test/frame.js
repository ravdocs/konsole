'use strict';

var Assert = require('assert');
var Konsole = require('../src/index.js');

describe.only('Console.Frame(): ', function () {
	it('should gracefully handle empty frame', function (done) {
		var frame = new Konsole.Frame();
		console.log(frame);
		Assert.equal(frame instanceof Konsole.Frame, true);
		done();
	});
	it('should gracefully handle empty frame', function (done) {
		var frame = new Konsole.Frame({});
		console.log(frame);
		Assert.equal(frame instanceof Konsole.Frame, true);
		done();
	});
});
