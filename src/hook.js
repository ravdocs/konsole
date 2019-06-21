'use strict';

// console.log ===> stdout
// console.warn ===> console.error ===> stderr

// todo: test console.log('%s %s', str1, str2);

// https://gist.github.com/pguillory/729616/32aa9dd5b5881f6f2719db835424a7cb96dfdfd6

function hook(callback, stream) {

	var oldWrite = stream.write;
	var out = {
		str: ''
	};

	function capture () {
		this.clean();
		this.disable();
		return this;
	}

	function release () {
		this.enable();
		this.restore();
		return this;
	}

	function reset () {
		return this.disable().clean().enable();
	}

	function clean () {
		out = {
			str: ''
		};
		return this;
	}

	function toString () {
		return this.output().str;
	}

	function toStringJson () {

		// todo: how will we handle the {{log}} helper or private helpers logging info?
		// todo: loop each line looking for none json content and convert it to a json element.
		var lines = this.output().str.trim().split('}\n{');
		return  '[' + lines.join(',') + ']';
	}

	function output () {
		return out;
	}

	function enable() {
		var self = this;
		stream.write = (function (write) {
			return function (str, enc, fd) {
				write.apply(stream, arguments);
				callback.call(self, out, {
					str: str,
					enc: enc,
					fd: fd
				});
			};
		})(oldWrite);
		return this;
	}

	function disable () {
		var self = this;
		stream.write = (function () {
			return function (str, enc, fd) {
				callback.call(self, out, {
					str: str,
					enc: enc,
					fd: fd
				});
			};
		})();
		return this;
	}

	function restore () {
		stream.write = oldWrite;
		return this;
	}

	function appendError(e) {
		// out.str += e.toMessage();
	}

	return {
		// todo: why do we need so many public methods?
		restore: restore,
		disable: disable,
		enable: enable,
		clean: clean,
		reset :reset,
		capture:capture,
		release: release,
		output: output,
		toString: toString,
		toStringJson: toStringJson,
		appendError: appendError
	};
}

module.exports = hook;
