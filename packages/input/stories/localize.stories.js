import { storiesOf, html } from '@open-wc/demoing-storybook';
import { maxLengthValidator } from '@lion/validate';
import { localize, LocalizeMixin } from '@lion/localize';
import { LionInput } from '../src/LionInput.js';

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

  const notEqualsString = (value, stringValue) => stringValue.toString() !== value;
  const notEqualsStringValidator = (...factoryParams) => [
    (...params) => ({ notEqualsString: notEqualsString(...params) }),
    factoryParams,
  ];

  return html`
    <input-localize-example
      .errorValidators=${[maxLengthValidator(5)]}
      .modelValue=${'default validator'}
    ></input-localize-example>
    <input-localize-example
      .errorValidators=${[notEqualsStringValidator('custom validator')]}
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
    </p>
  `;
});
