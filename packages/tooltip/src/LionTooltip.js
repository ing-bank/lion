import { css, LitElement } from '@lion/core';
import { ArrowMixin, OverlayMixin } from '@lion/overlays';

/**
 * @typedef {import('@lion/overlays/types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('@lion/core').CSSResultArray} CSSResultArray
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
      super.styles ? super.styles : [],
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
    this._mouseActive = false;
    this._keyActive = false;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      ...super._defineOverlayConfig(),
      placementMode: 'local',
      elementToFocusAfterHide: undefined,
      hidesOnEsc: true,
      hidesOnOutsideEsc: true,
      handlesAccessibility: true,
      isTooltip: true,
      invokerRelation: this.invokerRelation,
    });
  }

  _hasDisabledInvoker() {
    if (this._overlayCtrl && this._overlayCtrl.invoker) {
      return (
        /** @type {HTMLElement & { disabled: boolean }} */ (this._overlayCtrl.invoker).disabled ||
        this._overlayCtrl.invoker.getAttribute('aria-disabled') === 'true'
      );
    }
    return false;
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__resetActive = this.__resetActive.bind(this);
    this._overlayCtrl.addEventListener('hide', this.__resetActive);

    this.addEventListener('mouseenter', this._showMouse);
    this.addEventListener('mouseleave', this._hideMouse);

    this._showKey = this._showKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusin', this._showKey);

    this._hideKey = this._hideKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusout', this._hideKey);
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this._showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  __resetActive() {
    this._mouseActive = false;
    this._keyActive = false;
  }

  _showMouse() {
    if (!this._keyActive) {
      this._mouseActive = true;
      if (!this._hasDisabledInvoker()) {
        this.opened = true;
      }
    }
  }

  _hideMouse() {
    if (!this._keyActive) {
      this.opened = false;
    }
  }

  _showKey() {
    if (!this._mouseActive) {
      this._keyActive = true;
      if (!this._hasDisabledInvoker()) {
        this.opened = true;
      }
    }
  }

  _hideKey() {
    if (!this._mouseActive) {
      this.opened = false;
    }
  }
}
