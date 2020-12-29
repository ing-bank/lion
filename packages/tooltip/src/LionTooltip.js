import { css, LitElement } from '@lion/core';
import { ArrowMixin, OverlayMixin, withTooltipConfig } from '@lion/overlays';

/**
 * @typedef {import('@lion/overlays/types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('lit-element').CSSResultArray} CSSResultArray
 */

/**
 * @customElement lion-tooltip
 */
export class LionTooltip extends ArrowMixin(OverlayMixin(LitElement)) {
  static get properties() {
    return {
      invokerRelation: {
        type: String,
        attribute: 'invoker-relation',
      },
    };
  }

  static get styles() {
    return [
      /** @type {CSSResult | CSSStyleSheet | CSSResultArray} */ (super.styles),
      css`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  constructor() {
    super();
    /**
     * Whether an arrow should be displayed
     * @type {boolean}
     */
    this.hasArrow = false;
    /**
     * Decides whether the tooltip invoker text should be considered a description
     * (sets aria-describedby) or a label (sets aria-labelledby).
     * @type {'label'|'description'}
     */
    this.invokerRelation = 'description';
    // this._mouseActive = false;
    // this._keyActive = false;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      ...super._defineOverlayConfig(),
      ...withTooltipConfig({ invokerRelation: this.invokerRelation }),
    });
  }

  // _setupOpenCloseListeners() {
  //   super._setupOpenCloseListeners();
  //   this.__resetActive = this.__resetActive.bind(this);
  //   this._overlayCtrl.addEventListener('hide', this.__resetActive);

  //   this.__handleOpenClosed = this.__handleOpenClosed.bind(this);

  //   this.addEventListener('mouseenter', this.__handleOpenClosed);
  //   this.addEventListener('mouseleave', this.__handleOpenClosed);

  //   this._overlayInvokerNode.addEventListener('focusin', this.__handleOpenClosed);
  //   this._overlayInvokerNode.addEventListener('focusout', this.__handleOpenClosed);
  // }

  // _teardownOpenCloseListeners() {
  //   super._teardownOpenCloseListeners();
  //   this._overlayCtrl.removeEventListener('hide', this.__resetActive);
  //   this.removeEventListener('mouseenter', this.__handleOpenClosed);
  //   this.removeEventListener('mouseleave', this.__handleOpenClosed);
  //   this._overlayInvokerNode.removeEventListener('focusin', this.__handleOpenClosed);
  //   this._overlayInvokerNode.removeEventListener('focusout', this.__handleOpenClosed);
  // }

  // __resetActive() {
  //   this.__isFocused = false;
  //   this.__isHovered = false;
  // }

  // /**
  //  * @param {Event} event
  //  */
  // __handleOpenClosed({ type }) {
  //   this.__isFocused = type === 'focusout' ? false : this.__isFocused || type === 'focusin';
  //   this.__isHovered = type === 'mouseleave' ? false : this.__isHovered || type === 'mouseenter';
  //   const shouldOpen = this.__isFocused || this.__isHovered;
  //   this.opened = shouldOpen && !this._overlayCtrl._hasDisabledInvoker();
  // }
}
