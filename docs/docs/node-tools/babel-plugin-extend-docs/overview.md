# Node Tools >> Babel Extend Docs >> Overview ||10

A plugin which rewrites imports and templates according to a configuration.
This enables the reuse of existing documentation from source packages while still using your extensions code.

## Installation

```bash
npm i -D babel-plugin-extend-docs
```

We want to only execute `babel-plugin-extend-docs` on the actual files we want to modify/extend.

You may also consider using [babel overrides](https://babeljs.io/docs/en/options#overrides).

👉 _web-dev-server.config.js_

```js
import path from 'path';
import { fromRollup } from '@web/dev-server-rollup';
import rollupBabel from '@rollup/plugin-babel';

const extendDocsConfig = {
  changes: [
    // possible changes as described below
  ],
};

// note that you need to use `.default` for babel
const babel = fromRollup(rollupBabel.default);

export default {
  nodeResolve: true,
  plugins: [
    babel({
      include: ['./glob/to/files/**/*.js'],
      plugins: [[path.resolve('./'), extendDocsConfig]],
    }),
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

Both `variable` and `tag` are required to have a `paths` array which defines how to remap import paths. Generally it should be a single entry.

```js
paths: [
  { from: 'source-pkg/counter', to: 'extension-pkg/counter' },
],
```

## Replacement of tags

We have an existing demo code which we want to reuse.

```js
import { LitElement, html } from '@lion/core';
import 'source-pkg/counter/define';
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <source-counter></source-counter>
    `;
  }
}
customElements.define('my-app', MyApp);
```

We created a "better" version of `<source-counter>` so we would like to use that in the demo.
Our extension is called `<extension-counter>` and is available via `extension-pkg/counter/define`.

Within `babel-plugin-extend-docs` we can define to replace the tag + it's import.

```js
tag: {
  from: 'source-counter',
  to: 'extension-counter',
  paths: [{ from: 'source-pkg/counter/define', to: 'extension-pkg/counter/define' }],
}
```

### Result of Replacement of tags

```js
import { LitElement, html } from '@lion/core';
import 'extension-pkg/counter/define';
class MyApp extends LitElement {
  render() {
    return html`
      <h1>Example App</h1>
      <extension-counter></extension-counter>
    `;
  }
}
customElements.define('my-app', MyApp);
```

## Replacement of classes

We have an existing demo code which we want to reuse.

```js
import { LitElement, html } from '@lion/core';
import { SourceCounter } from 'source-pkg/counter';
class TenCounter extends SourceCounter {
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

We created a "better" version of `SourceCounter` so we would like that `TenCounter` now extends it instead.

Within `babel-plugin-extend-docs` we can define to replace the class + it's import.

```js
variable: {
  from: 'SourceCounter',
  to: 'ExtensionCounter',
  paths: [
    { from: 'source-pkg/counter', to: 'extension-pkg/counter' },
  ],
},
```

### Result of Replacement of classes

```js
import { LitElement, html } from '@lion/core';
import { SourceCounter } from 'extension-pkg/counter';
class TenCounter extends SourceCounter {
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

You can run the example locally via `npm run start` or look at its [source code](https://github.com/ing-bank/lion/tree/master/packages-node/babel-plugin-extend-docs/demo/).
_Note we are configuring babel via the [server.config.mjs](https://github.com/ing-bank/lion/tree/master/packages-node/babel-plugin-extend-docs/demo/server.config.mjs)_

👉 _server.config.mjs_

```js
import path from 'path';
import { fromRollup } from '@web/dev-server-rollup';
import rollupBabel from '@rollup/plugin-babel';

const extendDocsConfig = {
  changes: [
    {
      name: 'SourceCounter',
      variable: {
        from: 'SourceCounter',
        to: 'ExtensionCounter',
        paths: [{ from: '#source/counter', to: '#extension/counter' }],
      },
      tag: {
        from: 'source-counter',
        to: 'extension-counter',
        paths: [{ from: '#source/counter/define', to: '#extension/counter/define' }],
      },
    },
  ],
};

// note that you need to use `.default` for babel
const babel = fromRollup(rollupBabel.default);

export default {
  nodeResolve: true,
  watch: true,
  open: 'demo/',
  plugins: [
    babel({
      include: ['./demo/**/*.demo.js'],
      plugins: [[path.resolve('./'), extendDocsConfig]],
    }),
  ],
};
```
