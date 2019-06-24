'use strict';

var Assert = require('assert');
var Konsole = require('../src/index.js');
var Frame = Konsole.Frame;
var Hook = Konsole.Hook;

describe.only('Renderer Setup: capture and release stdout with data reporting from helpers', function () {
	it('should be able to capture stdout and release it', function (done) {

		var captures = [];
		var silence = true;
		var stdout = Hook(console, silence).attach((method, args) => {

			// handle framed and unframed console statements
			var frame = (args[0] instanceof Frame)
				? args[0]
				: new Frame({
					method: method,
					sourceType: 'renderer',
					sourceName: 'hook',
					messageLevel: 1,
					messageValue0: args[0],
					messageValue1: args[1]
				});

			captures.push(frame);
		});

		try {

			(function () {
				// {{helper1}}
				var coordinates = [{a: 'a', b: 'b'}];
				var konsole = new Konsole.Stdout({
					sourceType: 'helper',
					sourceName: 'helper1',
					templateName: 'myTemplate',
					templateVersion: 'myVersion',
					templateLine: 123
				});
				konsole.info('HELPER HELPER1');
				konsole.info('hash1', 'value1', 2);

				// log data like what template was nested or coordinates
				konsole.data('nested', 'name.category@version'); // string
				konsole.data('coordinates', coordinates); // data array object
			}());

			(function () {
				// {{helper2}}
				var konsole = new Konsole.Stdout({
					sourceType: 'helper',
					sourceName: 'helper2',
					templateName: 'myTemplate2',
					templateVersion: 'myVersion2',
					templateLine: 444
				});
				konsole.info('HELPER HELPER2');
				konsole.info('hash1', 'vaule1', 2);
				konsole.info('hash2', 'vaule2', 2);
			}());

			(function () {
				// some unframed console statements from someone elses code
				console.log('oops');
				console.info('hellow-info-oops');
				console.warn('hello-warn-oops');
				console.error('hello-error-oops');
			}());


			(function () {
				// {{error}} helper
				var message = 'An intentional error message from helper helper.';
				var error = new Error(message);
				error.intentional = true;
				error.frame = new Frame({
					method: 'error',
					sourceType: 'helper',
					sourceName: 'error',
					messageLevel: 1,
					messageValue0: message,
					messageValue1: error.stack,
					templateName: 'myTemplate2',
					templateVersion: 'myVersion2',
					templateLine: 444
				});
				throw error;
			}());

		} catch (e) {
			var frame = (e.frame instanceof Frame)
				? e.frame
				: new Frame({
					method: 'error',
					sourceType: 'renderer',
					sourceName: 'trycatch',
					messageLevel: 1,
					messageValue0: e.toString(),
					messageValue1: e.stack
				});
			captures.push(frame);
		}

		// release console
		stdout.detach();

		// inspect captures
		// captures.forEach(function(frame, i) {
		// 	console.log(i + 1, frame);
		// });

		// test captures
		Assert.equal(Array.isArray(captures), true);
		Assert.equal(captures.length, 12);

		done();
	});
});
