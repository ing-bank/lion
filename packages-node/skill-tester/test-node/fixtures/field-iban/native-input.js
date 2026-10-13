// REJECTED — control #1: the right label and the right prefill, but a native input instead of the
// documented component. Everything here parses and every import resolves, so a failure can only come
// from the assertion doing its job.
import { LitElement, html } from 'lit';

export class MyIbanField extends LitElement {
  render() {
    return html`<label>Account<input type="text" value="NL17INGB0002822608" /></label>`;
  }
}
