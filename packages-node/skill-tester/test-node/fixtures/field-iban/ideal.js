// ACCEPTED. The canonical answer: a component file that composes the documented element and carries
// its own scoped registry. Byte-for-byte the shape that scored 100% (conformance and behaviour) in
// the measured runs.
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionInputIban } from '@lion/ui/input-iban.js';

export class MyIbanField extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-input-iban': LionInputIban,
  };

  render() {
    return html`
      <lion-input-iban
        name="account"
        label="Account"
        .modelValue="${'NL17INGB0002822608'}"
      ></lion-input-iban>
    `;
  }
}
