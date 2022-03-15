import { LionButton } from '@lion/button';
import { css, html, SlotMixin } from '@lion/core';

/**
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 * @typedef {import('@lion/listbox').LionOption} LionOption
 * @typedef {import('@lion/select-rich').LionSelectRich} LionSelectRich
 */

/**
 * LionSelectInvoker: invoker button consuming a selected element
 */
export class LionSelectInvoker extends SlotMixin(LionButton) {
  static get styles() {
    return [
      // TODO switch back to ...super.styles once fixed https://github.com/lit/lit.dev/pull/535
      ...LionButton.styles,
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
      selectedElement: { type: Object },
      hostElement: { type: Object },
      readOnly: { type: Boolean, reflect: true, attribute: 'readonly' },
      singleOption: { type: Boolean, reflect: true, attribute: 'single-option' },
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

  /**
   * @configure OverlayMixin
   */
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
     * The LionSelectRich element this invoker is part of. Will be set on connectedCallback of
     * LionSelectRich
     * @type {LionSelectRich | null}
     */
    this.hostElement = null;
    /**
     * When the connected LionSelectRich instance has only one option,
     * this should be reflected in the invoker as well
     */
    this.singleOption = false;
    this.type = 'button';
  }

  /** @private */
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

  /**
   * @protected
   * @returns {TemplateResult|Node[]|string|null}
   */
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

  render() {
    return html` ${this._beforeTemplate()} ${super.render()} ${this._afterTemplate()} `;
  }

  /**
   * To be overriden for a placeholder, used when `hasNoDefaultSelected` is true on the select rich
   * @protected
   * @returns {TemplateResult}
   */
  // eslint-disable-next-line class-methods-use-this
  _noSelectionTemplate() {
    return html``;
  }

  /** @protected */
  _beforeTemplate() {
    return html` <div id="content-wrapper">${this._contentTemplate()}</div> `;
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`${!this.singleOption ? html`<slot name="after"></slot>` : ''}`;
  }
}
