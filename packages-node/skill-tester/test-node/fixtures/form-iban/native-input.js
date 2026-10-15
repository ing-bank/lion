import { LitElement, html } from 'lit';
import '@lion/ui/define/lion-form.js';

export class MyForm extends LitElement {
  createRenderRoot() {
    return this;
  }

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
