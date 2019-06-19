'use strict';

var Assert = require('assert');
var Konsole = require('..');

describe('Format: capture, format, release stdout', function () {
	it('should be able to format stdout', function(done) {

		var stdout = Konsole.hook(function decorator (output, obj) {
			output.str += obj.str;
		}, process.stdout);

		// capture stdout
		stdout.capture();

		try {

			// render helpers 1
			var konsole = new Konsole.format({genus: 'helper-one'});
			var param1 = 1, param2 = 2, hash3 = 3;
			konsole.info('param', 'name1', param1);
			konsole.warn('param', 'name2', param2);
			konsole.error('param', 'name3', hash3);

			// render helpers 2
			var konsole = new Konsole.format({genus: 'helper-two'});
			param1 = 1, param2 = 2, hash3 = 3;
			konsole.info('param', 'name1', param1);
			konsole.warn('param', 'name2', param2);
			konsole.error('param', 'name3', hash3);

			// render helper 3
			throw new Error('A fake helper error.');

		} catch (e) {
			// step 1: log error to centeralized logging platform (loggly) here.
			// step 2: add caught error to the stdout via `stdout.addError().

			// todo: stdout.addError(e);
		}

		// release stdout
		stdout.release();

		// inspect outputs
		var actual = stdout.toStringJson();
		var arr = JSON.parse(actual);
		// console.log('actual', actual);
		arr.forEach(function(el) {
			Assert.equal(!!el.genus, true);
			Assert.equal(!!el.severity, true);
			Assert.equal(!!el.type, true);
			Assert.equal(!!el.name, true);
			Assert.equal(!!el.value, true);
			Assert.equal(!!el.timestamp, true);
		});

		done();
	});
});
