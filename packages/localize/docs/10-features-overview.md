# Features Overview

## Translate Text

### As a function

```js script
import { html } from '@lion/core';
import { render, LitElement } from '@lion/core';
import { localize, formatNumber, formatDate, LocalizeMixin } from '../index.js';

import '../../helpers/sb-locale-switcher.js';

export default {
  title: 'Localize/Features Overview',
};
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
      'lit-html-example': locale => import(`./translations/${locale}.js`),
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

### Web Component

For use in a web component we have `LocalizeMixin` that lets you define namespaces and awaits loading of those translations.

```js preview-story
export const webComponent = () => {
  class MessageExample extends LocalizeMixin(LitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./translations/${locale}.js`) },
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

## Numbers

To format numbers you can use `formatNumber`. For more details see [Numbers](?path=/docs/localize-system-numbers--formatting).

```js preview-story
export const numbers = () => {
  const wrapper = document.createElement('div');
  let value = 1234.56;
  function update() {
    render(
      html`
        <input type="text" value=${value} />
        <p>${formatNumber(value)}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,
      wrapper,
    );
  }
  localize.addEventListener('localeChanged', () => {
    update();
  });
  update();
  const input = wrapper.querySelector('input');
  input.addEventListener('input', ev => {
    value = ev.target.value;
    update();
  });
  return wrapper;
};
```

## Dates

To format dates you can use `formatDate`. For more details see [Dates](?path=/docs/localize-system-dates--formatting).

```js preview-story
export const dates = () => {
  const wrapper = document.createElement('div');
  let value = '1987/05/12';
  function update() {
    render(
      html`
        <input type="text" value=${value} />
        <p>${formatDate(new Date(value))}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,
      wrapper,
    );
  }
  localize.addEventListener('localeChanged', () => {
    update();
  });
  update();
  const input = wrapper.querySelector('input');
  input.addEventListener('input', ev => {
    value = ev.target.value;
    update();
  });
  return wrapper;
};
```
