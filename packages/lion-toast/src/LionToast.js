import { css, html, LitElement } from '@lion/core';
import { OverlayController, OverlayMixin } from '@lion/overlays';

/**
 * @typedef {import('@lion/overlays/types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/overlays/types/OverlayConfig').ViewportConfig} ViewportConfig
 * @typedef {import('@lion/overlays/types/OverlayMixinTypes').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('@lion/core').CSSResultArray} CSSResultArray
 */

/**
 * @customElement lion-toast
 */
// @ts-ignore
export class LionToast extends OverlayMixin(LitElement) {
  static get styles() {
    return css``;
  }

  /** @type {any} */
  static get properties() {
    return {
      position: { type: String },
      title: { type: String },
      bodyText: { type: String, attribute: 'body-text' },
      duration: { type: Number },
    };
  }

  constructor() {
    super();
    /**
     * Appears inside <h2> at the top of the toast
     * @type {string}
     */
    // eslint-disable-next-line wc/no-constructor-attributes
    this.title = '';
    /**
     * Appears inside <p> inside the toast
     * @type {string}
     */
    this.bodyText = '';
    /**
     * Sets where to show to the toast relative to the viewport
     * @type {'top-left' |'top' |'top-right' |'right' |'bottom-left' |'bottom' |'bottom-right' |'left' |'center'}
     */
    this.position = 'top';
    /**
     * Toast display duration in seconds
     * @type {number}
     * @protected
     */
    this.duration = 1;
    /**
     * Whether the toast is showing
     * @type {boolean}
     * @protected
     */
    this._isActive = false;
  }

  /** @protected */
  _defineOverlayConfig() {
    // @ts-ignore
    return /** @type {OverlayConfig} */ ({
      ...super._defineOverlayConfig(),
      placementMode: 'global',
      viewportConfig: this.position,
    });
  }

  /** @protected */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__resetActive = this.__resetActive.bind(this);
    /** @type {OverlayController} */ (this._overlayCtrl).addEventListener(
      'hide',
      this.__resetActive,
    );
  }

  /** @protected */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    /** @type {OverlayController} */ (this._overlayCtrl).removeEventListener(
      'hide',
      this.__resetActive,
    );
  }

  /** @private */
  __resetActive() {
    this._isActive = false;
  }

  /**
   * Changes show & hide mechanisms
   * @param {DefineOverlayConfig} config
   * @returns {OverlayController}
   * @protected
   */
  // eslint-disable-next-line
  _defineOverlay({ contentNode }) {
    const overlayConfig = this._defineOverlayConfig() || {};
    return new OverlayController({
      contentNode,
      ...overlayConfig, // wc provided in the class as defaults
      ...this.config, // user provided (e.g. in template)
      popperConfig: {
        ...(overlayConfig.popperConfig || {}),
        ...(this.config.popperConfig || {}),
        modifiers: [
          ...(overlayConfig.popperConfig?.modifiers || []),
          ...(this.config.popperConfig?.modifiers || []),
        ],
      },
    });
  }

  /** @protected */
  _setupOverlayCtrl() {
    /** @type {OverlayController} */
    this._overlayCtrl = this._defineOverlay({
      contentNode: this._overlayContentNode,
      contentWrapperNode: this._overlayContentWrapperNode,
      invokerNode: this._overlayInvokerNode,
      backdropNode: this._overlayBackdropNode,
    });
    this._setupOpenCloseListeners();
    this.__syncToOverlayController();
  }

  /** @private */
  __syncToOverlayController() {
    if (this.opened) {
      /** @type {OverlayController} */
      (this._overlayCtrl).show();
      this._isActive = true;
      setTimeout(/** @type {OverlayController} */ (this._overlayCtrl).hide, this.duration * 1000);
    } else {
      /** @type {OverlayController} */
      (this._overlayCtrl).hide();
    }
  }

  /** exposed api to show */
  show() {
    this.opened = true;
    this.__syncToOverlayController();
  }

  render() {
    const body = this.bodyText ? `<p>${this.bodyText}</p>` : '';
    const title = this.title ? `<h2>${this.title}</h2>` : '';
    return html`
      ${title}${body}
      <slot></slot>
    `;
  }
}
