// REJECTED — control #2: the right component, upgraded, in a scoped registry, but with neither the
// label nor the prefill the prompt demands. It exists because the label and prefill assertions had
// never been *seen* to fail in eight measured runs, and an assertion that has never failed is not yet
// a check. This fixture makes them fail for the right reason, and nothing else.
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionInputIban } from '@lion/ui/input-iban.js';

export class MyIbanField extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-input-iban': LionInputIban,
  };

  render() {
    return html`<lion-input-iban name="account"></lion-input-iban>`;
  }
}
