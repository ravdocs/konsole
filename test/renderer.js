'use strict';

var Assert = require('assert');
var Konsole = require('../src/index.js');
var Frame = Konsole.Frame;


describe.only('Renderer Setup: capture and release stdout with data reporting from helpers', function () {
	it('should be able to capture stdout and release it', function (done) {

		// In @ravdocs/express-renderer web controller
		var logger = new Konsole.Logger();
		logger.info('HTML ENGINE: started.');
		logger.info2('Render', '@ravdocs/template-renderer@1.0.999');
		logger.info2('Template', 'sometemplate@2019-01-01 PUBLISHED');
		logger.info2('Timezone', process.env.TZ);
		logger.info2('Memory before', '12 MB');

		// In @ravdocs/template-renderer engine
		var captures = [];
		var silence = true;
		var stdout = Konsole.Hook(console, silence).attach(function (method, args) {

			// handle framed and unframed console statements
			var frame = (args[0] instanceof Konsole.Frame)
				? args[0]
				: new Konsole.Frame({
					method: method,
					sourceType: 'renderer',
					sourceName: 'hook',
					messageValue0: args[0],
					messageValue1: args[1]
				});

			captures.push(frame);
		});

		try {

			(function () {
				// {{helper1}}
				var coordinates = [{a: 'a', b: 'b'}];
				var konsole = new Konsole.Wrapper({
					sourceType: 'helper',
					sourceName: 'helper1',
					templateName: 'myTemplate',
					templateVersion: 'myVersion',
					templateLine: 123
				});
				// var konsole = HelpersUtils.getKonsole('helper1', options);
				konsole.info('HELPER HELPER1');
				konsole.info2('hash1', 'value1');

				// log `data` like what template was nested or coordinates
				konsole.data('nested', 'name.category@version'); // string
				konsole.data('coordinates', coordinates); // data array object
			}());

			(function () {
				// {{helper2}}
				var konsole = new Konsole.Wrapper({
					sourceType: 'helper',
					sourceName: 'helper2',
					templateName: 'myTemplate2',
					templateVersion: 'myVersion2',
					templateLine: 444
				});
				// var konsole = HelpersUtils.getKonsole('helper1', options);
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
				// {{error}} helper should frame the error before throwing the error
				var message = 'An intentional error message from helper helper.';
				var error = new Error(message);
				error.intentional = true;
				error.frame = new Konsole.Frame({
					method: 'error',
					sourceType: 'helper',
					sourceName: 'error',
					messageValue0: message,
					messageValue1: error.stack,
					templateName: 'myTemplate2',
					templateVersion: 'myVersion2',
					templateLine: 444
				});
				throw error;

				// todo:
				// var error = new Error(message);
				// error = HelpersUtils.frameError(error, 'helpername', options);
				// throw error;
			}());

		} catch (e) {

			// Helpers are encouraged to `throw` framed errors. However,
			// we still need to handle both framed and unframed errors.
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

		// test captures frames
		Assert.equal(Array.isArray(captures), true);
		Assert.equal(captures.length, 12);

		// In @ravdocs/express-renderer web controller
		logger.appendFrames(captures);
		logger.info('HTML ENGINE');
		logger.info2('Memory after', '22 MB');
		logger.info2('Time duration', '0.01 secs');
		logger.info2('Completed', 'All done');

		// test logger frames
		var frames = logger.getFrames();
		Assert.equal(Array.isArray(frames), true);
		Assert.equal(frames.length, 21);

		done();
	});
});
