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

# Console Formatting

During the HTML rendering process the helpers can console.log() information. The @ravdocs/express-renderer hooks the console.log process to capture this TEXT information and return this information to the admin tools in the Console Web feature.

Helpers can report problems in the following ways:
- Throwing errors which terminate the rendering and return an error message.
- Calling console.log() with TEXT information messages.

**The problem here is the value of the Console Web TEXT information is limited because it is NOT in a machine readable format.**

Consider a solution where we wrap console in the renderer to format the TEXT information sent to console.log to be JSON data instead of TEXT:

```js
exports.formatter = function (options) {
  
  function toJson(severity, type, name, value) {
    var data = {
      genus: options.genus,
      severity: severity,
      type: type,
      name: name || '',
      value: value || '',
      timestamp: new Date()
    };
    return JSON.stringify(data) + ',';
  }
    
  function info(type, name, value) {
    var str = toJson('info', type, name, value);
    console.log(str);
  }
  
  function warn(type, name, value) {
    var str = toJson('warn', type, name, value);
    console.log(str);
  }
  
  function error(type, name, value) {
      var str = toJson('error', type, name,value);
      console.log(str);
  }
  
  return {
    info: info,
    warn: warn,
    error: error
  };
};
```

Inside helpers we communicate to the Console Web like the following:
```js
if (okLog) console.log('NEST HELPER');
if (okLog) console.log('* param1: ', param1);
if (okLog) console.log('* param2: ', param2);
if (okLog) console.log('* hash3: ', hash3);
```

This would be replaced with
```js
var Konsole = require('@ravdocs/console');
var konsole = new Konsole.formatter({genus: 'helper-nest'});
if (okLog) konsole.info('param', 'name1', param1);
if (okLog) konsole.info('param', 'name2', param2);
if (okLog) konsole.info('param', 'name3', hash3);
```

The renderer which is hooking the `console` process to capture the console.log() output would capture JSON-ish data:
```text
{"genus": "helper-nest", "severity":"info", "type": "greeting", "name": "", "value": "", timestamp: "..." },
{"genus": "helper-nest", "severity":"info", "type": "param", "name": "name1", "value": param1, timestamp: "..." },
{"genus": "helper-nest", "severity":"info", "type": "param", "name": "name2", "value": param2, timestamp: "..." },
{"genus": "helper-nest", "severity":"info", "type": "hash", "name": "name3", "value": hash3, timestamp: "..." },
```

We just need to add array prefix and suffix to make this valid json. Now instead of sending TEXT to the admin tools we can send JSON data. The admin tools can convert this data into a TEXT display for viewing in the Console Web. However, we now have a JSON data file from the HTML rendering engine which can be machine readable looking for issues just like the PDF engine returns a data file.

```text
[2019-06-11T12:52:36.860Z] HTML ENGINE: started.
[2019-06-11T12:52:36.860Z] * Render: @ravdocs/template-renderer@1.0.270
[2019-06-11T12:52:36.860Z] * Template: welcomeletter-3.1xc@2019-05-14 DRAFT
[2019-06-11T12:52:36.860Z] * Timezone: US/Central
[2019-06-11T12:52:36.860Z] * Memory before: 232.81 MB
[2019-06-11T12:52:36.861Z] * Webpage.stylesheet: https://use.fontawesome.com/releases/v5.0.1/css/all.css
[2019-06-11T12:52:36.861Z] * Webpage.stylesheet: https://renderer.docsondemand.com/assets/static/css/render/normalize.css
[2019-06-11T12:52:36.861Z] * Webpage.stylesheet: https://renderer.docsondemand.com/assets/dynamic/css/render/common.css?origin=tools&guidelines=body&grids=none
[2019-06-11T12:52:36.861Z] * webpage.script: https://renderer.docsondemand.com/assets/dynamic/js/prince.js
[2019-06-11T12:52:36.862Z] UNDERLINE HELPER:
[2019-06-11T12:52:36.862Z] * Width: 'undefined'
[2019-06-11T12:52:36.862Z] * Font-family: 'Times New Roman'
[2019-06-11T12:52:36.862Z] * Font-size: '16px'
[2019-06-11T12:52:36.862Z] * Prefix: 'Name: '
[2019-06-11T12:52:36.862Z] 
[2019-06-11T12:52:36.862Z] TypeError: Cannot read property 'toFixed' of undefined
[2019-06-11T12:52:36.862Z] HTML ENGINE:
[2019-06-11T12:52:36.862Z] * Memory after: 232.94 MB
[2019-06-11T12:52:36.862Z] * Time duration: 0.005 secs
[2019-06-11T12:52:36.862Z] * Completed.
```

