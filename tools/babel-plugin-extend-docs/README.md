# babel-plugin-extend-docs

A plugin which rewrites imports and templates according to a configuration.
This enables the reuse of existing documentation from source packages while still using your extensions code.

## Installation

```bash
npm i -D babel-plugin-extend-docs
```

We want to only execute `babel-plugin-extend-docs` on the actual files we want to modify/extend.
We recommend using [babel overrides](https://babeljs.io/docs/en/options#overrides) for it.

👉 _babel.config.js_

```js
const extendDocsConfig = {
  rootPath: process.cwd(), // or `path.resolve('./')` as plugin needs to know the rootPath of your project
  changes: [
    // possible changes as described below
  ],
};

module.exports = {
  overrides: [
    {
      // plugin will only be executed on files that match this pattern
      test: ['./node_modules/source-library/demos/**/*.js'],
      plugins: [['babel-plugin-extend-docs', extendDocsConfig]],
    },
  ],
};
```

## Features

- Renames named imports and all it's usage
- Adjusts import paths
- Replace tags in template literals

## A Change

A change is what gets placed between in the extendDocsConfig within the `changes` array.

> automating the generation of changes is optional but encouraged

It has the following possibilities:

```js
changes: [
  {
    description: 'MyCounter', // not needed but can be added for easier reading of the config
    variable: {
      // see below
    },
    tag: {
      // see below
    },
  },
];
```

### Paths

Both `variable` and `tag` are required to have a `paths` array which defines how to remap import paths.
As demos can use multiple ways to import all of them needs to be written down in the config.

```js
paths: [
  { from: './index.js', to: './my-extension/index.js' },
  { from: '../index.js', to: '../my-extension/index.js' },
  { from: './src/MyCounter.js', to: './my-extension/index.js' },
  { from: '../src/MyCounter.js', to: '../my-extension/index.js' },
],
```

## Replacement of tags

We have an existing demo code which we want to reuse.

```js
import { LitElement, html } from 'lit-element';
import './my-counter.js';
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <my-counter></my-counter>
    `;
  }
}
customElements.define('my-app', MyApp);
```

We created a "better" version of `<my-counter>` so we would like to use that in the demo.
Our extension is called `<my-extension>` and is available in `./my-extension/my-extension.js`.

Within `babel-plugin-extend-docs` we can define to replace the tag + it's import.

```js
tag: {
  from: 'my-counter',
  to: 'my-extension',
  paths: [{ from: './my-counter.js', to: './my-extension/my-extension.js' }],
}
```

### Result of Replacement of tags

```js
import { LitElement, html } from 'lit-element';
import './my-extension/my-extension.js';
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <my-extension></my-extension>
    `;
  }
}
customElements.define('my-app', MyApp);
```

## Replacement of classes

We have an existing demo code which we want to reuse.

```js
import { LitElement, html } from 'lit-element';
import { MyCounter } from './src/MyCounter.js';
class TenCounter extends MyCounter {
  inc() {
    this.count += 10;
  }
}
customElements.define('ten-counter', TenCounter);
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <ten-counter></ten-counter>
    `;
  }
}
customElements.define('my-app', MyApp);
```

We created a "better" version of `MyCounter` so we would like that `TenCounter` now extends it instead.

Within `babel-plugin-extend-docs` we can define to replace the class + it's import.

```js
variable: {
  from: 'MyCounter',
  to: 'MyExtension',
  paths: [
    { from: './src/MyCounter.js', to: './my-extension/index.js' },
  ],
},
```

### Result of Replacement of classes

```js
import { LitElement, html } from 'lit-element';
import { MyExtension } from './my-extension/index.js';
class TenCounter extends MyExtension {
  inc() {
    this.count += 10;
  }
}
customElements.define('ten-counter', TenCounter);
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <ten-counter></ten-counter>
    `;
  }
}
customElements.define('my-app', MyApp);
```

## Full Demo & Api Example

You can run the example locally via `npm run start` or look at its [source code](https://github.com/ing-bank/lion/tree/master/tools/babel-plugin-extend-docs/demo/).
_Note we are configuring babel via the [server.config.js](https://github.com/ing-bank/lion/tree/master/tools/babel-plugin-extend-docs/demo/server.config.js)_

👉 _babel.config.js_

```js
const path = require('path');

const extendDocsConfig = {
  rootPath: path.resolve('./demo'),
  changes: [
    {
      name: 'MyCounter',
      variable: {
        from: 'MyCounter',
        to: 'MyExtension',
        paths: [
          { from: './index.js', to: './my-extension/index.js' },
          { from: './src/MyCounter.js', to: './my-extension/index.js' },
        ],
      },
      tag: {
        from: 'my-counter',
        to: 'my-extension',
        paths: [{ from: './my-counter.js', to: './my-extension/my-extension.js' }],
      },
    },
  ],
};

module.exports = {
  overrides: [
    {
      test: ['./node_modules/@lion/*/README.md', './node_modules/@lion/*/docs/**/*.md',
      plugins: [['babel-plugin-docs-extend', extendDocsConfig]],
    },
  ],
};
```

```js script
export default {
  title: 'Tools/BabelPluginExtendDocs',
};
```
