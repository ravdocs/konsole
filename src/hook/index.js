'use strict';

var ConsoleHook = require('console-hook');

module.exports = function Hook(opts) {
	opts = opts || {};
	var silence = opts.silence || true;
	var stream = opts.stream || console;
	return ConsoleHook(stream, silence);
};
