import { LitElement, html } from 'lit';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-input-iban.js';

export class MyForm extends LitElement {
  createRenderRoot() {
    return this;
  }

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
