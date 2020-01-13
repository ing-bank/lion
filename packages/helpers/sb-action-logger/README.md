# Storybook Action Logger

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

A visual element to show action logs in Storybook demos `sb-action-logger`.

**This is a demonstrative tool**, not a debugging tool (although it may help initially).
If you try logging complex values such as arrays, objects or promises,
you should expect to get only the string interpretation as the output in this logger.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/helpers-storybook-action-logger) for a live demo and API documentation

## Installation

```bash
npm i @lion/helpers
```

## Usage

```html
<script type="module">
  import '@lion/helpers/sb-action-logger/sb-action-logger.js';
</script>

<sb-action-logger></sb-action-logger>
```

Then, with the sb-action-logger instance selected, call the `log` method on it.

```js
myActionLoggerInstance.log('Hello, World!');
```
