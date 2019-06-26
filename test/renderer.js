'use strict';

var Assert = require('assert');
var Konsole = require('../src/index.js');

describe('Renderer Setup: capture and release stdout with data reporting from helpers', function () {
	it('should be able to capture stdout and release it', function (done) {

		// In @RAVDOCS/EXPRESS-RENDERER controllers/web.js
		var logger = new Konsole.Logger({source: 'controllers/html'});
		logger.info('HTML ENGINE: started.');
		logger.info('Render', '@ravdocs/template-renderer@1.0.999');
		logger.info('Template', 'sometemplate@2019-01-01 PUBLISHED');
		logger.info('Timezone', process.env.TZ);
		logger.info('Memory before', '12 MB');

		// In @RAVDOCS/TEMPLATE-RENDERER src/engine/index.js
		var captures = [];
		var handler = Konsole.Handler(captures);
		var stdout = Konsole.Hook({silence: true}).attach(handler);

		try {

			(function () {
				// {{helper1}}
				var coordinates = [{a: 'a', b: 'b'}];
				var konsole = new Konsole.Wrapper({
					source: 'helpers/helper1',
					invoked: 'myTemplate@myVersion:123'
				});
				// var konsole = HelpersUtils.getKonsole('helper1', options);
				konsole.info('HELPER HELPER1');
				konsole.info('hash1', 'value1');

				// log `data` like what template was nested or coordinates
				konsole.data('nested', 'name.category@version'); // string
				konsole.data('coordinates', coordinates); // data array object
			}());

			(function () {
				// {{helper2}}
				var konsole = new Konsole.Wrapper({
					source: 'renderer/helpers/helper2',
					invoked: 'myTemplate2@myVersion2:444'
				});
				// var konsole = HelpersUtils.getKonsole('helper1', options);
				konsole.info('HELPER HELPER2');
				konsole.info('hash1', 'vaule1');
				konsole.info('hash2', 'vaule2');
			}());

			(function () {
				// some unframed console statements from someone elses code
				console.log('oops');
				console.info('hellow-info-oops');
				console.warn('hello-warn-oops');
				console.error('hello-error-oops');
				console.info(this);
			}());


			(function () {
				// {{error}} helper should frame the error before throwing the error
				var message = 'An intentional error message from helper helper.';
				var error = new Error(message);
				error.intentional = true;
				error.frame = new Konsole.Frame({
					method: 'error',
					source: 'helpers/error',
					value0: message,
					value1: error.stack,
					invoked: 'myTemplate2@myVersion2:444'
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
			var frame = (e.frame instanceof Konsole.Frame)
				? e.frame
				: new Konsole.Frame({
					method: 'error',
					source: 'engine/trycatch',
					value0: e.toString(),
					value1: e.stack
				});
			captures.push(frame);
		}

		// release console
		stdout.detach();

		// test captures frames
		Assert.equal(Array.isArray(captures), true);
		Assert.equal(captures.length, 13);

		// In @RAVDOCS/EXPRESS-RENDERER controllers/web.js
		logger.appendFrames(captures);
		logger.info('HTML ENGINE');
		logger.info('Memory after', '22 MB');
		logger.info('Time duration', '0.01 secs');
		logger.info('Completed', 'All done');

		// test logger frames
		var frames = logger.getFrames();
		Assert.equal(Array.isArray(frames), true);
		Assert.equal(frames.length, 22);

		// console.log(frames);

		done();
	});
});
