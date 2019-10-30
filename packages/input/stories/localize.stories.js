import { storiesOf, html } from '@open-wc/demoing-storybook';
import { MaxLength, Validator, loadDefaultFeedbackMessages } from '@lion/validate';
import { localize, LocalizeMixin } from '@lion/localize';
import { LionInput } from '../index.js';

loadDefaultFeedbackMessages();

storiesOf('Forms|Input Localize', module).add('localize', () => {
  class InputValidationExample extends LocalizeMixin(LionInput) {
    static get localizeNamespaces() {
      return [
        { 'input-localize-example': locale => import(`./translations/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    async onLocaleUpdated() {
      super.onLocaleUpdated();
      await this.localizeNamespacesLoaded;
      this.label = localize.msg('input-localize-example:label');
    }
  }

  if (!customElements.get('input-localize-example')) {
    customElements.define('input-localize-example', InputValidationExample);
  }

  class NotEqualsString extends Validator {
    constructor(...args) {
      super(...args);
      this.name = 'NotEqualsString';
    }

    execute(value, param) {
      const hasError = value === param;
      return hasError;
    }

    static async getMessage() {
      return localize.msg(`input-localize-example:error.notEqualsString`);
    }
  }

  return html`
    <input-localize-example
      .validators=${[new MaxLength(5)]}
      .modelValue=${'default validator'}
    ></input-localize-example>
    <input-localize-example
      .validators=${[new NotEqualsString('custom validator')]}
      .modelValue=${'custom validator'}
    ></input-localize-example>
    <p>
      Change the locale with the buttons below:
      <button
        @click=${() => {
          localize.locale = 'de-DE';
        }}
      >
        DE
      </button>
      <button
        @click=${() => {
          localize.locale = 'en-GB';
        }}
      >
        EN
      </button>
      <button
        @click=${() => {
          localize.locale = 'fr-FR';
        }}
      >
        FR
      </button>
      <button
        @click=${() => {
          localize.locale = 'nl-NL';
        }}
      >
        NL
      </button>
      <button
        @click=${() => {
          localize.locale = 'zh-CN';
        }}
      >
        CN
      </button>
    </p>
  `;
});
