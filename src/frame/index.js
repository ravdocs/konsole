'use strict';

// todo: handle json objects as arg0 or arg1

module.exports = function Frame(props) {

	props = props || {};

	var method = props.method || 'info';
	method = method.toLowerCase();
	if (method === 'log') method = 'info';

	this.method = method;
	this.sourceType = props.sourceType;
	this.sourceName = props.sourceName;
	this.messageValue0 = props.messageValue0;
	this.messageValue1 = props.messageValue1;
	this.templateName = props.templateName;
	this.templateVersion = props.templateVersion;
	this.templateLine = props.templateLine;
	this.timestamp = new Date().toISOString();
};
