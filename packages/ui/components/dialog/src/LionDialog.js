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

  /**
   * @returns {HTMLDialogElement}
   */
  get #dialog() {
    return /** @type {HTMLDialogElement} */ (this.renderRoot.querySelector('dialog'));
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
      <dialog>
        <slot name="content"></slot>
      </dialog>
    `;
  }
}
