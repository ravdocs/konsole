'use strict';

var Frame = require('../frame');

module.exports = function Wrapper (opts) {

	var sourceType = opts.sourceType;
	var sourceName = opts.sourceName;
	var templateName = opts.templateName;
	var templateVersion = opts.templateVersion;
	var templateLine = opts.templateLine;

	// auto greeting would break unittests, but allow
	// private helpers to have nice greetings.
	// var greeting = sourceName.toUpperCase() + ' HELPER';
	// var frame = toFrame('info', 1, greeting);
	// console.info(frame);


	function toFrame(method, messageValue0, messageValue1) {
		return new Frame({
			method: method,
			sourceType: sourceType,
			sourceName: sourceName,
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
		console.info(frame);
	}

	function warn(arg0, arg1) {
		var method = 'warn';
		var frame = toFrame(method, arg0, arg1);
		console.warn(frame);
	}

	function error(arg0, arg1) {
		var method = 'error';
		var frame = toFrame(method, arg0, arg1);
		console.error(frame);
	}

	function data(arg0, arg1) {
		var method = 'data';
		var frame = toFrame(method, arg0, arg1);
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
