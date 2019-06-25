'use strict';

var Frame = require('../frame');

module.exports = function Logger (opts) {

	opts = opts || {};

	var frames = [];
	var sourceType = opts.sourceType;
	var sourceName = opts.sourceName;
	var templateName = opts.templateName;
	var templateVersion = opts.templateVersion;
	var templateLine = opts.templateLine;

	function toFrame(method, messageLevel, messageValue0, messageValue1) {
		return new Frame({
			method: method,
			sourceType: sourceType,
			sourceName: sourceName,
			messageLevel: messageLevel,
			messageValue0: messageValue0,
			messageValue1: messageValue1,
			templateName: templateName,
			templateVersion: templateVersion,
			templateLine: templateLine
		});
	}

	function info(arg0, arg1, levelParam) {
		var method = 'info';
		var level = levelParam || 1;
		var frame = toFrame(method, level, arg0, arg1);
		frames.push(frame);
	}

	function info2(arg0, arg1) {
		var level = 2;
		info(arg0, arg1, level);
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
		info2: info2,
		appendFrames: appendFrames,
		getFrames: getFrames
	};
};

