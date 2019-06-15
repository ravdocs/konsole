# console
Hook into the console log to capture console.log(). Use for unit testing and code logging.

# Install
```bash
npm install @ravdocs/console --save
```

# Usage

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
