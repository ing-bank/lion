import { LionButton } from '@lion/button';
import { html, css } from '@lion/core';

/**
 * LionListboxInvoker: invoker button consuming seleceted state of listbox
 *
 * @customElement
 * @extends LionButton
 */
// eslint-disable-next-line no-unused-vars
export class LionListboxInvoker extends LionButton {
  static get styles() {
    return [
      // ...super.styles,
      css`
        :host {
          background-color: lightgray;
          display: block;
          padding: 8px;
        }

        /* sr-only */
        :host ::slotted(button) {
          position: absolute;
          visibility: hidden;
          top: 0;
        }
      `,
    ];
  }

  static get properties() {
    return {
      selectedElement: {
        type: Object,
      },
    };
  }

  get contentWrapper() {
    return this.shadowRoot.getElementById('content-wrapper');
  }

  constructor() {
    super();
    this.selectedElement = document.createElement('span');
  }

  // eslint-disable-next-line
  __clickDelegationHandler() {
    // no delegate here, just the original click
  }

  _contentTemplate() {
    const labelNode = this.selectedElement.querySelector('*');
    if (labelNode) {
      return labelNode.cloneNode(true);
    }

    const labelText = this.selectedElement.label;
    if (labelText) {
      return labelText;
    }

    return this.selectedElement.cloneNode(true);
  }

  render() {
    return html`
      <div id="content-wrapper">
        ${this._contentTemplate()}
      </div>
      <slot name="_button"></slot>
      <div class="click-area" @click="${this.__clickDelegationHandler}"></div>
    `;
  }
}
