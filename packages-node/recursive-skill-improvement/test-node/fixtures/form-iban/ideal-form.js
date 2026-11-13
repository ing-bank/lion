import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionForm } from '@lion/ui/form.js';
import { LionInputIban } from '@lion/ui/input-iban.js';

// The overarching component. It registers what it renders in its own scoped registry - no global
// registration, no define entrypoint - and keeps its shadow root: the form and its controls share that
// one tree, which is what makes the controls upgrade and register upward.
export class MyForm extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-form': LionForm,
    'lion-input-iban': LionInputIban,
  };

  render() {
    return html`
      <lion-form>
        <form>
          <lion-input-iban
            name="account"
            label="Account"
            .modelValue=${'NL17INGB0002822608'}
          ></lion-input-iban>
        </form>
      </lion-form>
    `;
  }
}

customElements.define('my-form', MyForm);
