# @RAVDOCS/KONSOLE
`process.console` utilities which allows us to create a data-based communication side-channel by hooking the console methods. The side-channel can then be used by the renderer helpers to share communication and data events during the rendering process.

The utilities:
- **Konsole.Hook** - hooks the `proces.console` to capture the communication events.
- **Konsole.Wrap** - wraps the `process.console` methods to frame method invocation to normalized the invocation with meta data.
- **Konsole.Frame** - generates a data frame suitable for submission to a `process.console` method.

# Background

If we simply hook the `process.console` method outputs we will only get a text string output from `process.console` methods. While a text string is helpful for a human to read the output from the renderer is not machine readable and the data is not normalized. By normalizing the `process.console` methods invocation in a data frame we build tools and product features that use the side-channel data.

Examples of features include:

- Storing usage of templates used to render the data.
- Storing coordinate geometry of specific rendered elements inside of the document.
- Storing warnings generated from the merge logic.
- Storing comments from the template programmer inside of the console data.
- Validation of documents rendered after package generation.

> **Private Helpers** - you can create a private helper whose scope is limited to just one template. Inside of that helper you can call console.log(). However, we create the context in which the private helpers execute. Therefore, we could swap out the console for konsole in the vm2. See https://github.com/ravdocs/template-renderer/blob/master/src/handlebars/vm2.js#L57


# Install
```bash
npm install @ravdocs/konsole --save
```

# Usage

Please see the unit tests.

