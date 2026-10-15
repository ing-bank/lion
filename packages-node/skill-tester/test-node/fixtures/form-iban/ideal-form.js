import { LitElement, html } from 'lit';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-input-iban.js';

// A parent of a form control: it carries the field and must be usable inside a form, so it renders
// into the host. With no shadow root there is no scoped registry, which is why the component uses the
// define entrypoints - they register the tags globally.
export class MyForm extends LitElement {
  createRenderRoot() {
    return this;
  }

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
