'use strict';

var Frame = require('../frame');

module.exports = function (opts) {

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
		console.info(frame);
	}

	function warn(arg0, arg1, levelParam) {
		var method = 'warn';
		var level = levelParam || 1;
		var frame = toFrame(method, level, arg0, arg1);
		console.warn(frame);
	}

	function error(arg0, arg1) {
		var method = 'error';
		var level = 1;
		var frame = toFrame(method, level, arg0, arg1);
		console.error(frame);
	}

	function data(arg0, arg1) {
		var method = 'data';
		var level = 1;
		var frame = toFrame(method, level, arg0, arg1);
		console.info(frame);
	}

	return {
		data: data,
		log: info,
		info: info,
		warn: warn,
		error: error
	};
};
