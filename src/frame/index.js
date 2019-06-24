'use strict';

// todo: handle json objects as arg0 or arg1

module.exports = function Frame(props) {

	var method = props.method;
	method = method.toLowerCase();
	if (method === 'log') method = 'info';

	var messageLevel = props.messageLevel || 1;

	this.method = method;
	this.sourceType = props.sourceType;
	this.sourceName = props.sourceName;
	this.messageLevel = messageLevel;
	this.messageValue0 = props.messageValue0;
	this.messageValue1 = props.messageValue1;
	this.templateName = props.templateName;
	this.templateVersion = props.templateVersion;
	this.templateLine = props.templateLine;
	this.timestamp = new Date().toISOString();
};
