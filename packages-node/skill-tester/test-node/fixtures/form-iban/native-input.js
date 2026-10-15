import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionForm } from '@lion/ui/form.js';

export class MyForm extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-form': LionForm };

  render() {
    return html`
      <lion-form>
        <form>
          <input name="account" label="Account" value="NL17INGB0002822608" />
        </form>
      </lion-form>
    `;
  }
}

customElements.define('my-form', MyForm);
