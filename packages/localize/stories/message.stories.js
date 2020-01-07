import { LitElement, render } from '@lion/core';
import { html } from '@open-wc/demoing-storybook';
import { localize, LocalizeMixin } from '../index.js';

export default {
  title: 'Localize System/Extras',
};

class StorybookLocaleSwitcher extends LitElement {
  static get properties() {
    return {
      showLocales: { type: Array, attribute: 'show-locales' },
    };
  }

  constructor() {
    super();
    this.showLocales = ['en-GB', 'en-US', 'en-AU', 'nl-NL', 'nl-BE'];
  }

  callback(locale) {
    document.documentElement.lang = locale;
  }

  render() {
    return html`
      ${this.showLocales.map(
        showLocale => html`
          <button @click=${() => this.callback(showLocale)}>
            ${showLocale}
          </button>
        `,
      )}
    `;
  }
}

customElements.define('sb-locale-switcher', StorybookLocaleSwitcher);

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
