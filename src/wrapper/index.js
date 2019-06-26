'use strict';

var Frame = require('../frame');

module.exports = function Wrapper (opts) {

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
