'use strict';

var Assert = require('assert');

var Konsole = require('../src/index.js');
var Frame = Konsole.Frame;
var Hook = Konsole.Hook;

describe.only('Renderer Setup: capture and release stdout with data reporting from helpers', function () {
	it('should be able to capture stdout and release it', function (done) {

		var captures = [];
		var silence = false;
		var myHook = Hook(console, silence).attach((method, args) => {
			var frame, frame2;
			frame = args[0];

			// handle framed console statements
			if (frame instanceof Frame) return captures.push(frame);

			// handle random console statements
			var frame2 = new Frame({
				method: method,
				sourceType: 'renderer',
				sourceName: 'hook',
				messageLevel: 1,
				messageValue0: args[0],
				messageValue1: args[1]
			});
			captures.push(frame2);
		});

		try {

			// {{helper1}}
			var konsole = new Konsole.stdout({
				sourceType: 'helper',
				sourceName: 'helper1',
				templateName: 'myTemplate',
				templateVersion: 'myVersion',
				templateLine: 123
			});
			konsole.info('Header');
			// konsole.info('Header', null, 2);
			// konsole.warn('this might be a problem');
			// konsole.error('small problem, but keep on executing');
			// // konsole.errorHalt('big problem, but stop');
			// throw new Error('I am confused.');
			var hashval = 'hashvalue'
			konsole.info('hashname', hashval, 2);

			// {{helper2}}
			var konsole = new Konsole.stdout({
				sourceType: 'helper',
				sourceName: 'helper2',
				templateName: 'myTemplate2',
				templateVersion: 'myVersion2',
				templateLine: 444
			});
			konsole.info('message2');

			// {{somehelper}} random console statements
			console.log('oops');
			console.info('hellow-info-oops');
			console.warn('hello-warn-oops');
			console.error('hello-error-oops');

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

		} catch (e) {
			var frame = e.frame || new Frame({
				method: 'error',
				sourceType: 'renderer',
				sourceName: 'trycatch',
				messageLevel: 1,
				messageValue0: e.toString(),
				messageValue1: e.stack
			});
			captures.push(frame);
		}

		// okay, we're done playing with the console stuffs
		myHook.detach();

		// inspect captures
		captures.forEach(function(frame) {
			console.log(frame);
		});
		// console.log(captures);

		// test captures
		Assert.equal(Array.isArray(captures), true);
		Assert.equal(captures.length, 8);

		done();
	});
});
