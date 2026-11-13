import { LionInputIban } from '@lion/ui/input-iban.js';

// The shape that used to be accepted here. Subclassing is a supported path - own tag names, own
// branding and styling - but it is a subclasser's job and out of scope for these tests, so the
// scenario now consumes instead of subclassing and this answer is expected to fail.
export class MyForm extends LionInputIban {
  constructor() {
    super();
    this.label = 'Account';
    this.modelValue = 'NL17INGB0002822608';
  }
}

customElements.define('my-form', MyForm);
