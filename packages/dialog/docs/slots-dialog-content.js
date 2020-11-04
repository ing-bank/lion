import { LitElement, html } from '@lion/core';

class SlotsDialogContent extends LitElement {
  render() {
    return html`
      <button>shadow button</button>
      <slot name="actions">
        <button>slot button</button>
      </slot>
    `;
  }
}

customElements.define('slots-dialog-content', SlotsDialogContent);
