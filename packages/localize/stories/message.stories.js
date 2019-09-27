import { storiesOf, html } from '@open-wc/demoing-storybook';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { localize, LocalizeMixin } from '../index.js';

storiesOf('Localize System|Message', module).add('locale', () => {
  class messageExample extends LocalizeMixin(LionLitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./translations/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    render() {
      return html`
        <div aria-live="polite">
          <h1>${this.msgLit('lit-html-example:header', { locale: localize.locale })}</h1>
          <p>${this.msgLit('lit-html-example:body')}</p>
        </div>
      `;
    }
  }
  if (!customElements.get('message-example')) {
    customElements.define('message-example', messageExample);
  }

  return html`
    <button
      @click=${() => {
        localize.locale = 'en-GB';
      }}
    >
      en-GB
    </button>
    <button
      @click=${() => {
        localize.locale = 'en-US';
      }}
    >
      en-US
    </button>
    <button
      @click=${() => {
        localize.locale = 'en-AU';
      }}
    >
      en-AU
    </button>
    <button
      @click=${() => {
        localize.locale = 'nl-NL';
      }}
    >
      nl-NL
    </button>
    <button
      @click=${() => {
        localize.locale = 'nl-BE';
      }}
    >
      nl-BE
    </button>
    <message-example></message-example>
  `;
});
