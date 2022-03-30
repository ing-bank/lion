# Node Tools >> Extend Docs >> Overview ||10

When maintaining your own extension layer of lion you most likely want to maintain a similar documentation.
Copying and rewriting imports/tags the markdown files works but also means that whenever something change you need copy and rewrite again.

To do this automatically you can use this preset for [rocket](https://rocket.modern-web.dev/).

## Features

- Import lion documentation and adjust it using [remark-extend](../remark-extend/overview.md)
- Renames named imports and all it's usage
- Adjusts import paths
- Replace tags in template literals

## Installation

```bash
npm i -D rocket-preset-extend-lion-docs
```

👉 _rocket.config.js_

```js
import { rocketLaunch } from '@rocket/launch';
import { extendLionDocs } from 'rocket-preset-extend-lion-docs';

const extendLionDocsInstance = await extendLionDocs({
  classPrefix: 'Wolf',
  classBareImport: '@wolf/',
  tagPrefix: 'wolf-',
  tagBareImport: '@wolf/',
});

export default {
  presets: [rocketLaunch(), extendLionDocsInstance],
};
```

## Reusing documentation

To take an existing documentation you can "import" it using [remark-extend](../remark-extend/overview.md).

As an example you can create `docs/components/tabs/overview.md`.

In it you do

- write a headline
- use importSmallBlockContent to reuse content from lion
- add your own installation instruction

````md
# Tabs >> Overview ||10

```js ::importSmallBlockContent('@lion/tabs/docs/overview.md', '# Tabs >> Overview ||10')

```

## Installation

```bash
npm i --save @wolf/tabs
```

```js
import { WolfTabs } from '@wolf/tabs';
```
````

## How does it work

1. `importSmallBlockContent`` will import the content from lion
2. all code blocks will then be precessed to use `@wolf` instead of `@lion`
3. all links which are absolute to github will be processed to be local links

as an example this is a part of the lion docs for tabs

````md
```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/tabs/define';
```

```js preview-story
export const main = () => html`
  <lion-tabs>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
```
````

After all replacements the output that will be used for markdown rendering will be

````md
# Tabs >> Overview ||10

```js script
import { LitElement, html } from '@wolf/core';
import '@wolf/tabs/define';
```

```js preview-story
export const main = () => html`
  <wolf-tabs>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </wolf-tabs>
`;
```

## Installation

```bash
npm i --save @wolf/tabs
```

```js
import { WolfTabs } from '@wolf/tabs';
```
````

Doing so means you can focus on writing what is specific to your design system extension and you don't need to rewrite all the examples and explanations of lion but you can import them while still using your components.

## Use with a monorepo

The above setup assumes that you have the same "system" of exports in `@wolf` as we have in `@lion`.

So your users are able to do

```js
// provide classes as side effect free imports
import { WolfTabs } from '@wolf/tabs';
// register web components via `/define`
import '@wolf/tabs/define';
```

This means you need to have to define the following package entry points for you tabs extension.

👉 _tabs/package.json_

```json
"exports": {
  ".": "./src/index.js",
  "./define": "./src/define/tabs.js",
}
```

## Use as a single repo

Often its easier for your users to have one package to work with instead of a big list of individual packages.
If you are distributing one package then your exports/imports will be different.

So your users are able to do

```js
// provide classes as side effect free imports
import { WolfTabs } from 'wolf-web/tabs';
// register web components via `/define`
import 'wolf-web/tabs/define';
```

👉 _package.json_

```json
"exports": {
  ".": "./index.js",
  "./tabs/define": "./define/tabs.js",
}
```

The configuration for that is

👉 _rocket.config.js_

```js
import { rocketLaunch } from '@rocket/launch';
import { extendLionDocs } from 'rocket-preset-extend-lion-docs';

const extendLionDocsInstance = await extendLionDocs({
  classPrefix: 'Wolf',
  classBareImport: 'wolf-web/',
  tagPrefix: 'wolf-',
  tagBareImport: 'wolf-web/',
});

export default {
  presets: [rocketLaunch(), extendLionDocsInstance],
};
```

## Do not distribute side effects

When distributing you may choose to stay side effect free. This means no definitions of custom elements. You may want to do this to "force" usage of a scoped registry in order to support multiple mayor version of a component in a single application. We would recommend [Scoped Elements](https://open-wc.org/docs/development/scoped-elements/) for that.

So your users are able to do

```js
// provide classes as side effect free imports
import { WolfTabs } from 'wolf-web/tabs';
// NOTE: there no way to import a definition as a user
```

For demos it's still useful/needed to have those definitions. To have them but not exposing them you can use private imports which are only available to the package itself. This feature is called [Subpath imports](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_subpath_imports) in node.

To enable it you can set the following settings

👉 _rocket.config.js_

```js
import { rocketLaunch } from '@rocket/launch';
import { extendLionDocs } from 'rocket-preset-extend-lion-docs';

const extendLionDocsInstance = await extendLionDocs({
  classPrefix: 'Wolf',
  classBareImport: 'wolf-web/',
  tagPrefix: 'wolf-',
  tagBareImport: '#',
});

export default {
  presets: [rocketLaunch(), extendLionDocsInstance],
};
```

This rewrites the custom element definition side effects to

```js
// from
import '@lion/tabs/define';

// to
import '#tabs/define';
```

In order for such imports to work you need to define them

👉 _package.json_

```json
"imports": {
  "#tabs/define": "./__element-definitions/wolf-tabs.js",
}
```
