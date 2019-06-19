# @RAVDOCS/CONSOLE
Console utilities which allows us to create a communication side-channel with the renderer. We can:

- Hook into the console log process to capture process.stdout (e.g. console.log()) .
- Format console.log() to pass JSON data in the side-channel.

# JSON Format Console.log()

The justification for:

- **hooking** the `stdout` so that we can send the stdout data to the admin tools and also save the stdout data with the generated document.
- **formatting** the `stdout` is so that it is much easier to extract the needed data from stdout in a machine readable format. For example, we want to know what actual templates were nested by the nest helper. We use template nesting data in the `usages` database table.

The formatting of console.log() to pass JSON data is still an **experimental** feature. We are yet to determine how we will handle the following:

- **Global {{log}} Helper** - we would need a custom global helper which would not call console.log() but instead call konsole.info(...). When {{log}} helper is asked to log objects the custom helper would konsole.info() the object as serialized JSON. Therefore, we would have a system which would output serialized JSON inside of serialized JSON.

- **Errant Console.log()** - we should be able to handle the errant console.log statement that sneeks into the stdout from the render. This sould not cause the rendering process to fail. We should just gracefully handle this and wrap the errant line to text in JSON format.

- **Private Helpers** - you can create a private helper whose scope is limited to just one template. Inside of that helper you can call console.log(). However, we create the context in which the private helpers execute. Therefore, we could swap out the console for konsole in the vm2. See https://github.com/ravdocs/template-renderer/blob/master/src/handlebars/vm2.js#L57

- **Helpers Throwing Errors** - helpers can throw errors. I am pretty sure we will not need to do anything here as javascript errors do not use process.stdout.

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
