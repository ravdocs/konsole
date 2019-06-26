'use strict';

var Frame = require('../frame');

module.exports = function(frames) {
	return function handler(method, args) {

		// handle framed and unframed console statements
		var isUnframed = args[0] instanceof Frame;
		var frame = (isUnframed)
			? args[0]
			: new Frame({
				method: method,
				source: 'engine/handler',
				value0: args[0],
				value1: args[1]
			});

		frames.push(frame);
	};
};
