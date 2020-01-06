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
import @lion/form/lion-form.js;
```

### Example

`/path/to/my-hello-component/translations/en-GB.js`

```js
export default { greeting: 'Hello {name}!', };`
```

Loading data:

```js
localize.loadNamespace({
  'my-hello-component': locale => {
    return import(`./translations/${locale}.js`);
  },
});
```

Rendering data:

```js
_onNameChanged() {
  // inserts 'Hello John!' into the element with id="name"
  const greeting = localize.msg('my-hello-component:greeting', { name: 'John' });
  this.shadowRoot.querySelector('#greeting').innerText = greeting;
}
```
