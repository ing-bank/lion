import { LionButton } from '@lion/button';
import { css, html } from '@lion/core';

/**
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('@lion/listbox').LionOption} LionOption
 */

/**
 * LionSelectInvoker: invoker button consuming a selected element
 */
// @ts-expect-error
export class LionSelectInvoker extends LionButton {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          justify-content: space-between;
          align-items: center;
        }

        #content-wrapper {
          position: relative;
          pointer-events: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      selectedElement: {
        type: Object,
      },
      readOnly: {
        type: Boolean,
        reflect: true,
        attribute: 'readonly',
      },
      singleOption: {
        type: Boolean,
        reflect: true,
        attribute: 'single-option',
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      after: () => {
        const icon = document.createElement('span');
        icon.textContent = '▼';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        return icon;
      },
    };
  }

  get _contentWrapperNode() {
    return /** @type {ShadowRoot} */ (this.shadowRoot).getElementById('content-wrapper');
  }

  constructor() {
    super();

    /**
     * When the connected LionSelectRich instance is readOnly,
     * this should be reflected in the invoker as well
     */
    this.readOnly = false;
    /**
     * The option element that is currently selected
     * @type {LionOption | null}
     */
    this.selectedElement = null;
    /**
     * When the connected LionSelectRich instance has only one option,
     * this should be reflected in the invoker as well
     */
    this.singleOption = false;
    this.type = 'button';
  }

  // eslint-disable-next-line class-methods-use-this
  __handleKeydown(/** @type {KeyboardEvent} */ event) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
      /* no default */
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.__handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.__handleKeydown);
  }

  _contentTemplate() {
    if (this.selectedElement) {
      const labelNodes = Array.from(this.selectedElement.childNodes);
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
    return html` <div id="content-wrapper">${this._contentTemplate()}</div> `;
  }

  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`${!this.singleOption ? html`<slot name="after"></slot>` : ''}`;
  }
}
