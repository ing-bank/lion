import { LionButton } from '@lion/button';
import { html } from '@lion/core';

/**
 * LionSelectInvoker: invoker button consuming a selected element
 *
 * @customElement
 * @extends LionButton
 */
export class LionSelectInvoker extends LionButton {
  static get properties() {
    return {
      selectedElement: {
        type: Object,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      after: () => {
        const icon = document.createElement('span');
        icon.textContent = '▼';
        return icon;
      },
    };
  }

  get contentWrapper() {
    return this.shadowRoot.getElementById('content-wrapper');
  }

  constructor() {
    super();
    this.selectedElement = null;
  }

  _contentTemplate() {
    if (this.selectedElement) {
      const labelNodes = Array.from(this.selectedElement.querySelectorAll('*'));
      if (labelNodes.length > 0) {
        return labelNodes.map(node => node.cloneNode(true));
      }
      return this.selectedElement.textContent;
    }
    return ``;
  }

  _renderBefore() {
    return html`
      <div id="content-wrapper">
        ${this._contentTemplate()}
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _renderAfter() {
    return html`
      <slot name="after"></slot>
    `;
  }
}
