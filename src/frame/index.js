'use strict';

// todo: handle json objects as arg0 or arg1

module.exports = function Frame(props) {

	props = props || {};

	var type = props.type || 'info';
	type = type.toLowerCase();
	if (type === 'log') type = 'info';

	this.type = type;
	this.source = props.source;
	this.name = props.name;
	this.value = props.value;
	this.invoked = props.invoked;
	this.created = new Date().toISOString();
};
