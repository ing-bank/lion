# Tabs

`lion-tabs` implements tabs view to allow users to quickly move between a small number of equally important views.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/tabs) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/tabs;
```

### Usage

```js
import '@lion/tabs/lion-tabs.js';
```

```html
<lion-tabs>
  <button slot="tab">Info</button>
  <p slot="panel">
    Info page with lots of information about us.
  </p>
  <button slot="tab">Work</button>
  <p slot="panel">
    Work page that showcases our work.
  </p>
</lion-tabs>
```
