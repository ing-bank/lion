import { LitElement, render } from '@lion/core';
import { html } from '@open-wc/demoing-storybook';
import { localize, LocalizeMixin } from '../index.js';

import '@lion/helpers/sb-locale-switcher.js';

export default {
  title: 'Localize/Extras',
};

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
