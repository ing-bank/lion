# Message

The localization system helps to manage localization data, split into locales and automate its loading.

## Features

### LocalizeMixin

The LocalizeMixin is the one you want to use in your web components. By adding this mixing, you can internationalize your component.

`LocalizeMixin` has the following features:

- Use translated text in your template (`msgLit()`)
- Get the localize namespaces of the component (`localizeNamespaces`)
- Await loading of localize namespaces (`localizeNamespacesLoaded`)

Advanced:

- Set whether your component should wait for localize namespaces before rendering your component's template (`waitForLocalizeNamespaces`)
- Lit-element's `performUpdate()` is overridden in this mixin to perform updates async or delayed sync based on the `waitForLocalizeNamespaces` getter
- Lifecycle methods `onLocaleReady()`, `onLocaleChanged()`, `onLocaleUpdated()`

## How to use

### In a webcomponent

Below, we show a common and easy example, it assumes you have your translation files set up. It uses an explicit loader function for the `namespace`.

```js
import { LocalizeMixin } from '@lion/localize';

class MyHelloComponent extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    // using an explicit loader function
    return [
      { 'my-hello-component': locale => import(`./translations/${locale}.js`) }
      ...super.localizeNamespaces,
    ];
  }

  render() {
    return html`
      <div>
        ${this.msgLit('my-hello-component:greeting')}
      </div>
    `;
  }
}
```

The `namespace` can be one of two types: an object with an explicit loader function as shown above and just a simple string for which the loader has been preconfigured.

> When calling `this.msgLit()`, what comes after `:` may contain dots only if they are intended as a separator for objects. For more details, please check [messageformat](https://messageformat.github.io/messageformat/), which is the underlying library that we use.

An example of the a preconfigured loader:

```js
static get localizeNamespaces() {
  return ['my-hello-component', ...super.localizeNamespaces];
}
```

If you don't want your rendering to wait for localize namespaces to have loaded, this is how you override it. If you use `performUpdate()`, this will now also not wait for localize namespaces to have loaded.

```js
class MyHelloComponent extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    // using an explicit loader function
    return [
      { 'my-hello-component': locale => import(`./translations/${locale}.js`) },
      ...super.localizeNamespaces,
    ];
  }

  static get waitForLocalizeNamespaces() {
    return false;
  }

  render() {
    return html`
      <div>
        ${this.msgLit('my-hello-component:greeting')}
      </div>
    `;
  }
}
```

It is also possible to pass data to your translation:

```js
render() {
  return html`
    <div>
      ${this.name ? this.msgLit('my-hello-component:greeting', { name: this.name }) : ''}
    </div>
  `;
}
```

Usage of dynamic imports is recommended if you want to be able to create smart bundles later on for a certain locale.

### Not using a webcomponent

For example, if you simply want to make a reusable template, you can also use localization using the singleton instance of LocalizeManager called `localize`.

```js
import { html } from '@lion/core';
import { localize } from '@lion/localize';

export function myTemplate(someData) {
  return html`
    <div>
      ${localize.msg('my-hello-component:feeling', { feeling: someData.feeling })}
    </div>
  `;
}
```

This template is meant for importing in your webcomponent which uses this localize namespace.

### Translation files

Data is split into locales.
Typically the locale is an ES module which is by convention put into the `/translations` directory of your project or package. There are base language files (`en.js`, `nl.js`) and dialect files which extend them (`en-GB.js`, `nl-NL.js`). In the dialect files, you can extend or overwrite translations in the base language files.

Localization data modules for `my-hello-component` might look like these:

- `/path/to/my-family-component/translations/en.js`

  ```js
  export default {
    havePartnerQuestion: 'Do you have a partner?',
    haveChildrenQuestion: 'Do you have children?',
  };
  ```

- `/path/to/my-family-component/translations/en-GB.js`

  ```js
  import en from './en.js';
  export default en;
  ```

- `/path/to/my-family-component/translations/en-US.js`

  ```js
  import en from './en.js';

  export default {
    ...en,
    haveChildrenQuestion: 'Do you have kids?',
  };
  ```

The module must have a `default` export as shown above to be handled properly.

### Advanced

If you want to fetch translation data from some API this is also possible.

```js
// fetch from an API
localize.loadNamespace({
  'my-hello-component': async locale => {
    const response = await fetch(
      `http://api.example.com/?namespace=my-hello-component&locale=${locale}`,
    );
    return response.json(); // resolves to the JSON object `{ greeting: 'Hallo {name}!' }`
  },
});
```

There is also a method which helps with setting up the loading of multiple namespaces.

Using the loaders preconfigured via `setupNamespaceLoader()`:

```js
// using the regexp to match all component names staring with 'my-'
localize.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
  const response = await fetch(`http://api.example.com/?namespace=${namespace}&locale=${locale}`);
  return response.json();
});

Promise.all([
  localize.loadNamespace('my-hello-component');
  localize.loadNamespace('my-goodbye-component');
])
```

`localize.msg` uses [Intl MessageFormat implementation](https://www.npmjs.com/package/message-format) under the hood, so you can use all of its powerful features.
