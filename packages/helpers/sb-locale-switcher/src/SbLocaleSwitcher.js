import { LitElement, html } from '@lion/core';

export class SbLocaleSwitcher extends LitElement {
  static get properties() {
    return {
      showLocales: { type: Array, attribute: 'show-locales' },
    };
  }

  constructor() {
    super();
    this.showLocales = ['en-GB', 'en-US', 'en-AU', 'nl-NL', 'nl-BE'];
  }

  // eslint-disable-next-line class-methods-use-this
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
