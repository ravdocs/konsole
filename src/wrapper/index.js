'use strict';

var Frame = require('../frame');

module.exports = function Wrapper (opts) {

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
		console.info(frame);
	}

	function warn(arg0, arg1) {
		var type = 'warn';
		var frame = toFrame(type, arg0, arg1);
		console.warn(frame);
	}

	function error(arg0, arg1) {
		var type = 'error';
		var frame = toFrame(type, arg0, arg1);
		console.error(frame);
	}

	function data(arg0, arg1) {
		var type = 'data';
		var frame = toFrame(type, arg0, arg1);
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
