import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionForm } from '@lion/ui/form.js';
import { LionInputIban } from '@lion/ui/input-iban.js';

export class MyForm extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-form': LionForm,
    'lion-input-iban': LionInputIban,
  };

  render() {
    return html`
      <lion-form>
        <form>
          <lion-input-iban name="account"></lion-input-iban>
        </form>
      </lion-form>
    `;
  }
}

customElements.define('my-form', MyForm);
