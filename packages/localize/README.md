# Localize

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

The localization system helps to manage localization data split into locales and automate its loading.
The loading of data tries to be as unobtrusive as possible for a typical workflow while providing a flexible and controllable mechanism for non-trivial use cases.
The formatting of data containing numbers and dates takes current locale into accout by using Intl MessageFormat specification.

## LocalizeManager

The core of the system is a `LocalizeManager` instance which is responsible for data loading and working with this data.
It is exposed as a `localize` singleton instance.
This ensures that the data can be cached in the single place and reused across different components and same component instances.

```js
import { localize } from '@lion/localize';
// localize is the instance of LocalizeManager
```

The system is designed for two different groups of developers: component developers and application developers.
Component developers will have a unified way to integrate with localization system while application developers will be able to customize the loading behavior.

## Usage for component developers

As a component developer you get:

- unified data structure for different locales;
- promisified helper to load data;
- notification about page locale changes;
- formatting using Intl MessageFormat;
- mixins simplifying integration with components.

Data is split into locales.
Typically the locale is an ES module which is by convention put into the `/translations` directory of your project.
But there is also a possibility to serve data from an API using JSON format.
Localization data modules for `my-hello-component` might look like these:

- `/path/to/my-hello-component/translations/en-GB.js`

  ```js
  export default {
    greeting: 'Hello {name}!',
  };
  ```

- `/path/to/my-hello-component/translations/nl-NL.js`

  ```js
  export default {
    greeting: 'Hallo {name}!',
  };
  ```

The approach with ES modules is great because it allows to simply reuse basic locale data and override only the needed parts for more specific locales.

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

To load this data the method `loadNamespace()` which returns a promise can be used.

```js
localize.loadNamespace(namespace).then(() => {
  // do smth when data is loaded
});
```

The `namespace` can be one of two types: an object with an explicit loader function and just a simple string for which the loader has been preconfigured.
Let's look at both cases in depth.

1. Using explicit loader functions:

```js
// use the dynamic import to load static assets
localize.loadNamespace({
  'my-hello-component': locale => {
    // resolves to a module with the module.default `{ greeting: 'Hallo {name}!' }`
    return import(`./translations/${locale}.js`);
  },
});
```

Usage of dynamic imports is recommended if you want to be able to create smart bundles later on for a certain locale.
The module must have a `default` export as shown above to be handled properly.

But in fact you are not limited in the way how exactly the data is loaded.
If you want to fetch it from some API this is also possible.

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

But it does not make much sense to have such a loader function for each of your namespaces.
And this is there the second option comes in handy.

1. Using the loaders preconfigured via `setupNamespaceLoader()`:

```js
// using the regexp to match all component names staring with 'my-'
localize.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
  const response = await fetch(`http://api.example.com/?namespace=${namespace}&locale=${locale}`);
  return response.json();
});

Promise.all([
  localize.loadNamespace('my-hello-component');
  localize.loadNamespace('my-goodbuy-component');
])
```

Thus there is a loder function for all components having a certain prefix in a name.

The locale which will be loaded by default is accesed via the `localize.locale`.

The single source of truth for page's locale is `<html lang="my-LOCALE">`.
At the same time the interaction should happen via `localize.locale` getter/setter to be able to notify and react to the change.

```js
localize.addEventListener('localeChanged', () => {
  // do smth when data is loaded for a new locale
});

// changes locale, syncs to `<html lang="es-ES">` and fires the event above
localize.locale = 'es-ES';
```

If the locale is changed when a few namespaces have been already loaded for the previous one, all the data will be requested for existing namespaces for a new locale and only after that the event listeneres will be called.
This ensures that all data necessary for localization is loaded prior to rendering.
If a certain namespace for a certain locale has been loaded previously, it will never be fetched again until the tab is reloaded in the browser.

When all necessary data is loaded and you want to show localized content on the page you need to format the data.
`localize.msg` comes into play here.
It expects a key in the format of `namespace:name` and can also receive variables as a second argument.

```js
_onNameChanged() {
  // inserts 'Hello John!' into the element with id="name"
  const name = localize.msg('my-hello-component:greeting', { name: 'John' });
  this.$idNameElement.innerText = name;
}
```

`localize.msg` uses [Intl MessageFormat implementation](https://www.npmjs.com/package/message-format) under the hood, so you can use all of its powerful features like placing a little bit different content based on number ranges or format a date according to the current locale.

### Using with LocalizeMixin

This mixin was created to significantly simplify integration with LionLitElement.
It provides several capabilities:

- automatic loading of specified namespaces;
- life-cycle callbacks for localization events;
- alias `_m` for `localize.msg`;
- promisified alias `_msgAsync` for `localize.msg` resolved when data is loaded.

```js
class MyHelloComponent extends LocalizeMixin(LionLitElement) {
  static get localizeNamespaces() {
    // using an explicit loader function
    return [
      { 'my-hello-component': locale => import(`./translations/${locale}.js`) }
      ...super.localizeNamespaces,
    ];

    // using a preconfigured loader function
    return ['my-hello-component', ...super.localizeNamespaces];
  }

  setupShadowDom() {
    // setup initial DOM with ids for insertion points
  }

  onLocaleReady() {
    // life-cycle callback - when data is loaded for initial locale
    // (reaction to loaded namespaces defined in `localizeNamespaces`)
  }

  onLocaleChanged() {
    // life-cycle callback - when data is loaded for new locale
    // (reaction to `localize.locale` change and namespaces loaded for it)
  }

  onLocaleUpdated() {
    // life-cycle callback - when localized content needs to be updated
    // (literally after `onLocaleReady` or `onLocaleChanged`)
    // most DOM updates should be done here with the help of `this.msgLit()` and cached id selectors
  }
}
```

Refer to demos to see a full example.

### Using with LocalizeLitRenderMixin

This is an extension of LocalizeMixin for usage with LionLitElement and LitRenderMixin.
It provides extra capabilities on top of LocalizeMixin:

- smart wrapper `msg` for `localize.msg`;
- automatic update of DOM after locale was changed.

With the help of this mixin writing a component can be as easy as defining namespaces in `localizeNamespaces` and writing lit-html template using `this.msgLit()`:

```js
render() {
  return html`
    <div>${this.name ? this.msgLit('my-hello-component:greeting', { name: this.name }) : ''}</div>
  `;
}
```

Refer to demos to see a full example.

## Usage for application developers

As an application developer you get:

- ability to inline localization data for any locales and namespaces to prevent async loading and improve rendering speed in critical cases;
- smart defaults for data loading;
- simple customization of paths where the data is loaded from for common use cases;
- full control over how the data is loaded for very specific use cases;

### Inlining of data

If you want to optimize the page rendering and you can inline some of your localization data upfront then there is a simple way to do it:

```js
// my-inlined-data.js
import { localize } from 'lion-localize/localize.js';
localize.addData('en-GB', 'my-namespace', {
  /* data */
});
localize.addData('nl-NL', 'my-namespace', {
  /* data */
});

// my-app.js
import './my-inlined-data.js'; // must be on top to be executed before any other code using the data
```

This code must come before any other code which might potentially render before the data is added.
You can inline as much locales as you support or sniff request headers on the server side and inline only the needed one.

### Customize loading

By convention most components will keep their localization data in ES modules at `/translations/%locale%.js`.
But as we have already covered in the documentation for component developers there is a way to change the loading for certain namespaces.

The configuration is done via `setupNamespaceLoader()`.
This is sort of a router for the data and is typically needed to fetch it from an API.

```js
// for one specific component
localize.setupNamespaceLoader('my-hello-component', async locale => {
  const response = await fetch(
    `http://api.example.com/?namespace=my-hello-component&locale=${locale}`,
  );
  return response.json();
});

// for all components which have a prefix in their names
localize.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
  const response = await fetch(`http://api.example.com/?namespace=${namespace}&locale=${locale}`);
  return response.json();
});
```

Typically in the application you have a prefix in all of your application specific components.
Having a way to load their corresponding localization data in a unified way is handy in such cases.
But you need to make sure this configuration happens before you run any other code using these namespaces.
