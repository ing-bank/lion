import { LitElement, html, css } from '@lion/core';

class SlotsDialogContent extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          background-color: #fff;
        }
        .actions {
          border-top: 2px solid green;
        }
      `,
    ];
  }

  _closeOverlay() {
    this.dispatchEvent(new Event('close-overlay', { bubbles: true }));
  }

  render() {
    return html`
      <p>This content contains an actions slot</p>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
      <button class="close-button" @click=${this._closeOverlay}>⨯</button>
    `;
  }
}

customElements.define('slots-dialog-content', SlotsDialogContent);
