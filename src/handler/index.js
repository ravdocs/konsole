'use strict';

var Frame = require('../frame');

module.exports = function(frames) {
	return function handler(type, args) {

		// handle framed and unframed console statements
		var isUnframed = args[0] instanceof Frame;
		var frame = (isUnframed)
			? args[0]
			: new Frame({
				type: type,
				source: 'engine/handler',
				name: args[0],
				value: args[1]
			});

		frames.push(frame);
	};
};
