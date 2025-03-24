# Systems >> Localize >> Translate Text ||20

## As a function

```js script
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { localize, formatNumber, formatDate, LocalizeMixin } from '@lion/ui/localize.js';
import '@lion/ui/define-helpers/sb-locale-switcher.js';
```

```js preview-story
export const asFunction = () => {
  const wrapper = document.createElement('div');
  let message = 'Loading...';
  function update() {
    message = localize.msg('lit-html-example:body');
    render(
      html`
        <p>${message}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,
      wrapper,
    );
  }
  localize
    .loadNamespace({
      'lit-html-example': locale => import(`./assets/${locale}.js`),
    })
    .then(() => {
      update();
    });
  localize.addEventListener('localeChanged', () => {
    localize.loadingComplete.then(() => update());
  });
  return wrapper;
};
```

```js
localize.msg('lit-html-example:body'); // for en-GB: I am from England
localize.msg('lit-html-example:body'); // for nl-NL: Ik kom uit Nederland
// ...
```

## Web Component

For use in a web component we have `LocalizeMixin` that lets you define namespaces and awaits loading of those translations.

```js preview-story
export const webComponent = () => {
  class MessageExample extends LocalizeMixin(LitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./assets/translations/${locale}.js`) },
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
