# Localize

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

The localization system helps to manage localization data split into locales and automate its loading.
The loading of data tries to be as unobtrusive as possible for a typical workflow while providing a flexible and controllable mechanism for non-trivial use cases.
The formatting of data containing numbers and dates takes current locale into account by using Intl MessageFormat specification.

## LocalizeManager

The core of the system is a `LocalizeManager` instance which is responsible for data loading and working with these data.
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
- async helper to load data;
- notification about page locale changes;
- formatting using Intl MessageFormat;
- mixins simplifying integration with components.

### Storing data

Data are split into locales.
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

### Loading data

Async method `loadNamespace()` can be used to load these data.

```js
localize.loadNamespace(namespace).then(() => {
  // do smth when data are loaded
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

But in fact you are not limited in the way how exactly the data are loaded.
If you want to fetch it from some API this is also possible.

```js
// fetch from an API
localize.loadNamespace({
  'my-hello-component': async locale => {
    const response = await fetch(
      `https://api.example.com/?namespace=my-hello-component&locale=${locale}`,
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
  const response = await fetch(`https://api.example.com/?namespace=${namespace}&locale=${locale}`);
  return response.json();
});

await Promise.all([
  localize.loadNamespace('my-hello-component');
  localize.loadNamespace('my-goodbye-component');
]);
```

Thus there is a loader function for all components having a certain prefix in a name.

### Page locale

The single source of truth for page locale is `<html lang="my-LOCALE">`.
Accessing it via `localize.locale` getter/setter is preferable.

External tools like Google Chrome translate or a demo plugin to change a page locale (e.g. in the Storybook) can directly change the attribute on the `<html>` tag.

If `<html lang>` is empty the default locale will be set to `en-GB`.

#### Changing the page locale

Changing the locale is simple yet powerful way to change the language on the page without reloading it:

```js
localize.addEventListener('localeChanged', () => {
  // do smth when data are loaded for a new locale
});

// change locale (syncs to `<html lang="es-ES">` and fires the event above)
localize.locale = 'es-ES';
```

If the locale is changed when a few namespaces have been already loaded for the previous one, all the data will be requested for existing namespaces for a new locale and only after that the event listeners will be called.
This ensures that all data necessary for localization is loaded prior to rendering.
If a certain namespace for a certain locale has been loaded previously, it will never be fetched again until the tab is reloaded in the browser.

#### Fallback locale

Due to the need to develop application code with not everything translated (yet) to all languages, it is good to have a fallback.
By default the fallback is `en-GB`, meaning that if some namespace does not have data for the current page locale, the `en-GB` will be loaded, making it an important foundation for all other locales data.
In addition to that the fallback is a necessary mechanism to allow some features of the browsers like Google Chrome translate to work and use the same original data for translations into all not officially supported languages.

> We highly discourage using fallback locales as a user, because it is bug-prone with things like date and number formatting. Please use full locales whenever possible.

### Rendering data

When all necessary data are loaded and you want to show localized content on the page you need to format the data.
`localize.msg` comes into play here.
It expects a key in the format of `namespace:name` and can also receive variables as a second argument.

```js
_onNameChanged() {
  // inserts 'Hello John!' into the element with id="name"
  const greeting = localize.msg('my-hello-component:greeting', { name: 'John' });
  this.shadowRoot.querySelector('#greeting').innerText = greeting;
}
```

`localize.msg` uses [Intl MessageFormat implementation](https://www.npmjs.com/package/message-format) under the hood, so you can use all of its powerful features like placing a little bit different content based on number ranges or format a date according to the current locale.

#### Rendering with LocalizeMixin

This mixin was created to significantly simplify integration with LitElement.
It provides many capabilities:

- automatic loading of specified namespaces;
- control of the rendering flow via `waitForLocalizeNamespaces`;
- smart wrapper `msgLit` for `localize.msg`;
- life-cycle callbacks and properties for localization events;
- automatic update of DOM after locale was changed.

```js
class MyHelloComponent extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    // using an explicit loader function
    return [
      { 'my-hello-component': locale => import(`./translations/${locale}.js`) }
      ...super.localizeNamespaces,
    ];

    // using a preconfigured loader function
    return ['my-hello-component', ...super.localizeNamespaces];
  }

  static get waitForLocalizeNamespaces() {
    // return false to unblock the rendering till the data are loaded
    return true;
  }

  render() {
    return html`
      <!-- use this.msgLit() here to inject data, e.g.: -->
      <span>${this.msgLit('my-hello-component:greeting')}</span>
    `;
  }

  onLocaleReady() {
    super.onLocaleReady();
    // life-cycle callback - when data are loaded for initial locale
    // (reaction to loaded namespaces defined in `localizeNamespaces`)
  }

  onLocaleChanged() {
    super.onLocaleChanged();
    // life-cycle callback - when data are loaded for new locale
    // (reaction to `localize.locale` change and namespaces loaded for it)
  }

  onLocaleUpdated() {
    super.onLocaleUpdated();
    // life-cycle callback - when localized content needs to be updated
    // (literally after `onLocaleReady` or `onLocaleChanged`)
    // most DOM updates should be done here with the help of `this.msgLit()` and cached id selectors
  }

  async inYourOwnMethod() {
    // before data are loaded or reloaded
    await this.localizeNamespacesLoaded;
    // after data are loaded or reloaded
  }
}
```

In the majority of cases defining `localizeNamespaces` and using `msgLit` in the `render` is enough to have a fully working localized component.

## Usage for application developers

As an application developer you get:

- ability to inline localization data for any locales and namespaces to prevent async loading and improve rendering speed in critical cases;
- smart defaults for data loading;
- simple customization of paths where the data are loaded from for common use cases;
- full control over how the data are loaded for very specific use cases;

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

This code must come before any other code which might potentially render before the data are added.
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
    `https://api.example.com/?namespace=my-hello-component&locale=${locale}`,
  );
  return response.json();
});

// for all components which have a prefix in their names
localize.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
  const response = await fetch(`https://api.example.com/?namespace=${namespace}&locale=${locale}`);
  return response.json();
});
```

Typically in the application you have a prefix in all of your application specific components.
Having a way to load their corresponding localization data in a unified way is handy in such cases.
But you need to make sure this configuration happens before you run any other code using these namespaces.
