'use strict';

var Assert = require('assert');
var Konsole = require('..');

describe('Hook - stdout', function () {
	it('should be able to capture stdout', function(done) {

		var stdout = Konsole.hook(function (output, obj) {
			// output.str += new Date().toISOString() + ' ' + obj.str;
			output.str += obj.str;
		}, process.stdout);

		// setup
		stdout.disable();

		// invoke render
		console.log('log 1');
		console.log('log 2');

		// shutdown & cleanup
		stdout.enable();
		stdout.restore();

		// inspect outputs
		Assert.equal(stdout.str(), 'log 1\nlog 2\n');

		done();
	});
});