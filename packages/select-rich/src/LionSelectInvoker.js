import { LionButton } from '@lion/button';
import { css, html } from '@lion/core';

/**
 * LionSelectInvoker: invoker button consuming a selected element
 *
 * @customElement lion-select-invoker
 * @extends {LionButton}
 */
export class LionSelectInvoker extends LionButton {
  static get styles() {
    return [
      super.styles,
      css`
        #content-wrapper {
          position: relative;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * @desc the option Element that is currently selected
       */
      selectedElement: {
        type: Object,
      },
      /**
       * @desc When the connected LionSelectRich insteance is readOnly,
       * this should be reflected in the invoker as well
       */
      readOnly: {
        type: Boolean,
        reflect: true,
        attribute: 'readonly',
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

  get _contentWrapperNode() {
    return this.shadowRoot.getElementById('content-wrapper');
  }

  constructor() {
    super();
    this.selectedElement = null;
    this.type = 'button';
  }

  _contentTemplate() {
    if (this.selectedElement) {
      const labelNodes = Array.from(this.selectedElement.querySelectorAll('*'));
      if (labelNodes.length > 0) {
        return labelNodes.map(node => node.cloneNode(true));
      }
      return this.selectedElement.textContent;
    }
    return this._noSelectionTemplate();
  }

  /**
   * To be overriden for a placeholder, used when `hasNoDefaultSelected` is true on the select rich
   */
  // eslint-disable-next-line class-methods-use-this
  _noSelectionTemplate() {
    return html``;
  }

  _beforeTemplate() {
    return html`
      <div id="content-wrapper">
        ${this._contentTemplate()}
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`
      <slot name="after"></slot>
    `;
  }
}
