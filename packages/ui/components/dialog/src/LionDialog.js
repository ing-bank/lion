import { css, html, LitElement } from 'lit';

export class LionDialog extends LitElement {
  static properties = {
    opened: {},
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('close', this.#close);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('close', this.#close);
  }

  get #dialog() {
    return this.shadowRoot.querySelector('dialog');
  }

  #open() {
    this.#dialog.showModal();
    this.opened = true;
  }

  #close() {
    this.#dialog.close();
    this.opened = false;
  }

  static styles = css`
    :host {
      --border: 1px solid black;
    }
    dialog {
      border: var(--border);
    }
  `;

  render() {
    return html`
      <button part="invoker" @click=${this.#open}>
        <slot name="invoker"></slot>
      </button>
      <dialog id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </dialog>
    `;
  }
}
