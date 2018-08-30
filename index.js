'use strict';

// console.log ===> stdout
// console.warn ===> console.error ===> stderr

// todo: test console.log('%s %s', str1, str2);

// https://gist.github.com/pguillory/729616/32aa9dd5b5881f6f2719db835424a7cb96dfdfd6

function hook(callback, stream) {

	var oldWrite = stream.write;
	var output = {
		str: ''
	};

	return {
		restore: function () {
			stream.write = oldWrite;
			return this;
		},
		disable: function () {
			var self = this;
			stream.write = (function () {
				return function (str, enc, fd) {
					callback.call(self, output, {
						str: str,
						enc: enc,
						fd: fd
					});
				};
			})();
			return this;
		},
		enable: function () {
			var self = this;
			stream.write = (function (write) {
				return function (str, enc, fd) {
					write.apply(stream, arguments);
					callback.call(self, output, {
						str: str,
						enc: enc,
						fd: fd
					});
				};
			})(oldWrite);
			return this;
		},
		output: function () {
			return output;
		},
		str: function () {
			return this.output().str;
		},
		clean: function () {
			output = {
				str: ''
			};
			return this;
		},
		reset: function () {
			return this.disable().clean().enable();
		}
	};
}

exports.hook = hook;
