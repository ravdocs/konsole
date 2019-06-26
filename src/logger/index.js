'use strict';

var Frame = require('../frame');

module.exports = function Logger (opts) {

	opts = opts || {};

	var frames = [];
	var source = opts.source;
	var templateName = opts.templateName;
	var templateVersion = opts.templateVersion;
	var templateLine = opts.templateLine;

	function toFrame(method, messageValue0, messageValue1) {
		return new Frame({
			method: method,
			source: source,
			messageValue0: messageValue0,
			messageValue1: messageValue1,
			templateName: templateName,
			templateVersion: templateVersion,
			templateLine: templateLine
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

