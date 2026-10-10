---
parts:
  - Translate Text
  - Localize
  - Systems
title: 'Localize: Translate Text'
eleventyNavigation:
  key: Systems >> Localize >> Translate Text
  title: Translate Text
  order: 20
  parent: Systems >> Localize
---

# Localize: Translate Text

## As a function

```js script
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { localize, formatNumber, formatDate, LocalizeMixin } from '@lion/ui/localize.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import '@lion/ui/define-helpers/sb-locale-switcher.js';
```

```js preview-story
export const asFunction = () => {
  const localizeManager = getLocalizeManager();
  localizeManager
    .loadNamespace({
      'lit-html-example': locale => import(`./assets/${locale}.js`),
    })
    .then(() => {
      update();
    });

  const wrapper = document.createElement('div');
  let message = 'Loading...';
  function update() {
    message = localizeManager.msg('lit-html-example:body');
    render(
      html`
        <p>${message}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,
      wrapper,
    );
  }
  // localize
  //   // TODO: look for Astro fix...
  //   // .loadNamespace({
  //   //   'lit-html-example': locale => import(`./assets/${locale}.js`),
  //   // })
  //   .then(() => {
  //     update();
  //   });
  localizeManager.addEventListener('localeChanged', () => {
    localizeManager.loadingComplete.then(() => update());
  });
  return wrapper;
};
```

```js
localize.msg('lit-html-example:body'); // for en-GB: I am from England
localize.msg('lit-html-example:body'); // for nl-NL: Ik kom uit Nederland
// ...
```

## Keys as array (Fallback mechanism)

When you pass an array of keys to `localize.msg`, the manager tries them in order and returns the first translation it finds. This is handy when a feature wants to override copy (e.g. a promotion namespace) while keeping a shared fallback.

For example, you might want to show a special greeting during a promotional period, but fall back to a default greeting when the promotion is not active:

```js
localizeManager.addData('en-GB', 'promo-banner', {
  greeting: 'Special offer! Welcome, {name}!',
});

localizeManager.addData('en-GB', 'defaults', {
  greeting: 'Welcome back, {name}!',
});

// If promo-banner:greeting exists, use it; otherwise use defaults:greeting
localize.msg(['promo-banner:greeting', 'defaults:greeting'], { name: 'John' });
```

## Array and Object translations with `msgList`

While `localize.msg()` is designed for text strings with variable interpolation, sometimes you need to work with structured translation data like arrays or objects. For this purpose, use `localize.msgList()` which returns the raw translation data without string conversion.

### Translating Lists

This is useful when you need to render a list of translated items, such as feature lists, menu items, or step-by-step instructions.

```js preview-story
export const arrayTranslations = () => {
  class ArrayExample extends LocalizeMixin(LitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./assets/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    render() {
      const items = localize.msgList('lit-html-example:keys');
      return html`
        <div>
          <h3>Features:</h3>
          <ul>
            ${Array.isArray(items) ? items.map(item => html`<li>${item}</li>`) : ''}
          </ul>
        </div>
      `;
    }
  }
  if (!customElements.get('array-example')) {
    customElements.define('array-example', ArrayExample);
  }
  return html`
    <array-example></array-example>
    <sb-locale-switcher></sb-locale-switcher>
  `;
};
```

**Translation files** (`docs/fundamentals/systems/localize/assets/en.js`):

```js
export default {
  header: '{ locale }: Localize message example',
  body: 'I am English',
  keys: ['First line of a list', 'Second line of a list', 'Third line of a list'],
};
```

**Translation files** (`docs/fundamentals/systems/localize/assets/nl.js`):

```js
export default {
  header: '{ locale }: Localize message voorbeeld',
  body: 'Ik kom uit Nederland',
  keys: ['Eerste regel van een lijst', 'Tweede regel van een lijst', 'Derde regel van een lijst'],
};
```

### Key differences between `msg()` and `msgList()`

- **`msg(key, vars, opts)`**: Returns a formatted string. Supports MessageFormat variable interpolation. Always converts result to string.
- **`msgList(key, opts)`**: Returns raw translation data (string, array, object, etc.). No variable interpolation. Use when you need to access structured data.

```js
// msg() - for text with variables
localize.msg('my-ns:greeting', { name: 'Alice' }); // "Hello, Alice!"

// msgList() - for arrays
localize.msgList('my-ns:features'); // ['Feature 1', 'Feature 2', 'Feature 3']

// msgList() - for objects
localize.msgList('my-ns:config'); // { theme: 'dark', language: 'en' }
```

## Web Component

For use in a web component we have `LocalizeMixin` that lets you define namespaces and awaits loading of those translations.

```js preview-story
export const webComponent = () => {
  class MessageExample extends LocalizeMixin(LitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./assets/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    render() {
      return html`
        <div aria-live="polite">
          <p>${localize.msg('lit-html-example:body')}</p>
        </div>
      `;
    }
  }
  if (!customElements.get('message-example')) {
    customElements.define('message-example', MessageExample);
  }
  return html`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `;
};
```

```js
class MessageExample extends LocalizeMixin(LitElement) {
  render() {
    return html`
      <div aria-live="polite">
        <p>${localize.msg('lit-html-example:body')}</p>
      </div>
    `;
  }
}
```

## Google Translate integration

When Google Translate is enabled, it takes control of the html[lang] attribute.
Below, we find a simplified example that illustrates this.

### The problem

A developer initializes a page like this (and instructs localize to fetch data for `en-US` locale)

```html
<html lang="en-US"></html>
```

If Google Translate is enabled and set to French, it will change html[lang]:
to `<html lang="fr">`

Now `localize` will fetch data for locale `fr`. There are two problems here:

- There might be no available data for locale `fr`
- Let's imagine data were loaded for `fr`. If Google Translate is turned off again,
  the page content will consist of a combination of different locales.

### How to solve this

To trigger support for Google Translate, we need to configure two attributes

```html
<html lang="en-US" data-localize-lang="en-US"></html>
```

- html[data-localize-lang] will be read by `localize` and used for fetching data
- html[lang] will be configured for accessibility purposes (it will makes sure the
  page is accessible if localize would be lazy loaded).

When Google Translate is set to French, we get: `<html lang="fr" data-localize-lang="en-US">`

The page is accessible and `localize` will fetch the right resources
