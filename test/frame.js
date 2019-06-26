'use strict';

var Assert = require('assert');
var Konsole = require('../src/index.js');

describe('Console.Frame(): ', function () {
	it('should gracefully handle empty frame', function (done) {
		var frame = new Konsole.Frame();
		Assert.equal(frame instanceof Konsole.Frame, true);
		done();
	});
	it('should gracefully handle empty frame', function (done) {
		var frame = new Konsole.Frame({});
		Assert.equal(frame instanceof Konsole.Frame, true);
		done();
	});
	it('should handle `data` frame', function (done) {
		var frame = new Konsole.Frame({type: 'data'});
		Assert.equal(frame instanceof Konsole.Frame, true);
		Assert.equal(frame.type, 'data');
		done();
	});
});
