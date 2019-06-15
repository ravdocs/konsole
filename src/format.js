'use strict';

module.exports = function format(options) {

	function toJson(severity, type, name, value) {
		var data = {
			genus: options.genus,
			severity: severity,
			type: type,
			name: name || '',
			value: value || '',
			timestamp: new Date()
		};
		return JSON.stringify(data);
	}

	function info(type, name, value) {
		var str = toJson('info', type, name, value);
		console.log(str);
	}

	function warn(type, name, value) {
		var str = toJson('warn', type, name, value);
		console.log(str);
	}

	function error(type, name, value) {
		var str = toJson('error', type, name, value);
		console.log(str);
	}

	return {
		info: info,
		warn: warn,
		error: error
	};
};
