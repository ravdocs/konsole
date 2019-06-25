'use strict';

var ConsoleHook = require('console-hook');

module.exports = function Hook(opts) {
	opts = opts || {};
	return ConsoleHook(console, opts.silence);
};
