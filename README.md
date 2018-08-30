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
stdout.clean();
stdout.disable();

// execute your code here
console.log('My pants are on fire!');
console.log('I am a little teapot!');

// shutdown & cleanup process hook
stdout.enable();
stdout.restore();

// inspect outputs
out = stdout.str(); // <--- console.log('My pants are on fire!');\n [timestamp] I am a little teapot!
```

# todo
- unit tests
