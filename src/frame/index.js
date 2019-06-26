'use strict';

// todo: handle json objects as arg0 or arg1

module.exports = function Frame(props) {

	props = props || {};

	var method = props.method || 'info';
	method = method.toLowerCase();
	if (method === 'log') method = 'info';

	this.method = method;
	this.source = props.source;
	this.value0 = props.value0;
	this.value1 = props.value1;
	this.invoked = props.invoked;
	this.timestamp = new Date().toISOString();
};
