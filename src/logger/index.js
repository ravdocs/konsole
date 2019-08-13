'use strict';

var Frame = require('../frame');

module.exports = function Logger (opts) {

	opts = opts || {};

	var frames = [];
	var source = opts.source;
	var invoked = opts.invoked;

	function toFrame(type, name, value) {
		return new Frame({
			type: type,
			source: source,
			name: name,
			value: value,
			invoked: invoked
		});
	}

	function info(arg0, arg1) {
		var type = 'info';
		var frame = toFrame(type, arg0, arg1);
		frames.push(frame);
	}

	function warn(arg0, arg1) {
		var type = 'warn';
		var frame = toFrame(type, arg0, arg1);
		frames.push(frame);
	}

	function error(arg0, arg1) {
		var type = 'error';
		var frame = toFrame(type, arg0, arg1);
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
		warn: warn,
		error: error,
		appendFrames: appendFrames,
		getFrames: getFrames
	};
};

