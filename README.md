# @RAVDOCS/CONSOLE
Console utilities which allows us to create a communication side-channel with the renderer. We can:

- Hook into the console log process to capture process.stdout (e.g. console.log()) .
- Format console.log() to pass JSON data in the side-channel.

# Formatting Console.log

The formatting of console.log() to pass JSON data is an experimental feature. We need to determine how we will handle the {{log}} helper and errors.

# Install
```bash
npm install @ravdocs/console --save
```

# Basic Usage

```js
var Konsole = require('@ravdocs/console');

var stdout = Konsole.hook(function (output, obj) {
	var now = new Date().toISOString();
	output.str += '[' + now + '] ' + obj.str;
}, process.stdout);


// setup process hook
stdout.capture();

// execute your code here
console.log('My pants are on fire!');
console.log('I am a little teapot!');

// release process hook
stdout.release();

// inspect outputs
out = stdout.toString(); // ---> [timestamp] My pants are on fire!'\n [timestamp] I am a little teapot!
```
