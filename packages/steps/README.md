# Steps

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-steps` breaks a single goal down into dependable sub-tasks.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/steps-steps) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/select
```

```js
import '@lion/steps/lion-steps.js';
import '@lion/steps/lion-step.js';
```

### Example

```html
<lion-steps>
  <lion-step initial-step>Step 1</lion-step>
  <lion-step>Step 2</lion-step>
  <lion-step>......</lion-step>
  <lion-step>Step N</lion-step>
</lion-steps>
```
