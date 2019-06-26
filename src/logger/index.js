'use strict';

var Frame = require('../frame');

module.exports = function Logger (opts) {

	opts = opts || {};

	var frames = [];
	var source = opts.source;
	var invoked = opts.invoked;

	function toFrame(method, value0, value1) {
		return new Frame({
			method: method,
			source: source,
			value0: value0,
			value1: value1,
			invoked: invoked
		});
	}

	function info(arg0, arg1) {
		var method = 'info';
		var frame = toFrame(method, arg0, arg1);
		frames.push(frame);
	}

	function appendFrames(arr) {
		arr.forEach(function (frame) {
			frames.push(frame);
		});
	}

	function getFrames () {
		return frames;
	}

	return {
		info: info,
		appendFrames: appendFrames,
		getFrames: getFrames
	};
};

