'use strict';

var Assert = require('assert');
var Konsole = require('..');

describe('Hook: capture and release stdout', function () {
	it('should be able to capture stdout and release it', function(done) {

		var stdout = Konsole.hook(function decorator (output, obj) {
			// output.str += new Date().toISOString() + ' ' + obj.str;
			output.str += obj.str;
		}, process.stdout);

		// capture stdout
		stdout.capture();

		// invoke render
		console.log('log 1');
		console.log('log 2');

		// release stdout
		stdout.release();

		// inspect outputs
		Assert.equal(stdout.toString(), 'log 1\nlog 2\n');

		done();
	});
});
