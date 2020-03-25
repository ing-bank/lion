# Localize

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

The localization system helps to manage localization data split into locales and automate its loading.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/localize--page) for a live demo and documentation

## How to use

### Installation

```sh
npm i --save @lion/localize
```

```js
import { localize } from '@lion/localize';
```

### Example

Translation data:

```js
// path/to/hello-world/translations/en-GB.js
export default { greeting: 'Hello {name}!', };`
```

Loading translations:

```js
// path/to/hello-world/HelloWorld.js
localize.loadNamespace({
  'hello-world': locale => {
    return import(`./translations/${locale}.js`);
  },
});
```

> Note: dynamic variables inside dynamic imports may cause problems with tools that do static analysis, and may not work out of the box

Translating messages:

```js
localize.msg('hello-world:greeting', { name: 'John' });
// Hello John!
```
