import { LitElement, html } from '@lion/core';

class SlotsDialogContent extends LitElement {
  render() {
    return html`
      <p>This content contains an actions slot</p>
      <slot name="actions"></slot>
    `;
  }
}

customElements.define('slots-dialog-content', SlotsDialogContent);
