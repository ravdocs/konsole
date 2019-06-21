'use strict';

var Assert = require('assert');
var Hook = require('console-hook');

describe.only('console-hook: capture and release stdout', function () {
	it('should be able to capture stdout and release it', function (done) {

		var captures = [];
		var silence = true;
		var myHook = Hook(console, silence).attach((severity, args) => {
			var message = args[0];
			var meta = args[1] || {};
			var flatten = {
				severity: severity, // log, warn, error
				sourceType: meta.sourceType,
				sourceName: meta.sourceName,
				messageLevel: meta.messageLevel || 2,
				messageValue: message,
				templateName: meta.templateName,
				templateVersion: meta.templateVersion,
				templateLine: meta.templateLine,
				timestamp: new Date().toISOString()
			};
			captures.push(flatten);
		});

		try {

			// {{helper1}}
			console.log('message1', {
				messageLevel: 1,
				sourceType: 'helper',
				sourceName: 'helper1',
				templateName: 'tplname1',
				templateVersion: 'tplversion1',
				templateLine: 23
			});

			// {{helper2}}
			console.log('message2', {
				messageLevel: 1,
				sourceType: 'helper',
				sourceName: 'helper2',
				templateName: 'tplname2',
				templateVersion: 'tplversion2',
				templateLine: 44
			});

			// {{somehelper}} random console.log() without meta data
			console.log('oops')

			// {{error}} helper
			// would pass meta data on
			var error = new Error('An intentional error message from helper helper.');
			error.intentional = true;
			error.meta = {
				messageLevel: 1,
				sourceType: 'helper',
				sourceName: 'error',
				templateName: 'tplname2',
				templateVersion: 'tplversion2',
				templateLine: 55
			};
			throw error;

		} catch (e) {
			if (e.intentional) { // from {{error}} helper
				console.error(e.toString(), e.meta);
			} else {
				console.error(e.toString());
			}
		}

		// okay, we're done playing with the console stuffs
		myHook.detach();

		// inspect capture
		console.log(captures);
		Assert.equal(Array.isArray(captures), true);
		Assert.equal(captures.length, 2);


		done();
	});
});
