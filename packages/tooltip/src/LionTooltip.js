import { html, LitElement } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';
import '../lion-tooltip-arrow.js';

export class LionTooltip extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local',
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
      popperConfig: {
        placement: 'top', // default
        modifiers: {
          keepTogether: {
            enabled: true,
          },
          arrow: {
            enabled: true,
          },
        },
      },
    };
  }

  constructor() {
    super();
    this.mouseActive = false;
    this.keyActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
    this._overlayContentNode.appendChild(this.shadowRoot.querySelector('lion-tooltip-arrow'));

    this.__getArrowHeight = async () => {
      this._overlayCtrl.removeEventListener('show', this.__getArrowHeight);

      const arrow = this._overlayContentNode.querySelector('lion-tooltip-arrow');
      arrow._updateArrowStyles();
    };

    this._overlayCtrl.addEventListener('show', this.__getArrowHeight);
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
      <lion-tooltip-arrow x-arrow></lion-tooltip-arrow>
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }

  _setupOpenCloseListeners() {
    this.__resetActive = () => {
      this.mouseActive = false;
      this.keyActive = false;
    };

    this.__showMouse = () => {
      if (!this.keyActive) {
        this.mouseActive = true;
        this.opened = true;
      }
    };

    this.__hideMouse = () => {
      if (!this.keyActive) {
        this.opened = false;
      }
    };

    this.__showKey = () => {
      if (!this.mouseActive) {
        this.keyActive = true;
        this.opened = true;
      }
    };

    this.__hideKey = () => {
      if (!this.mouseActive) {
        this.opened = false;
      }
    };

    this._overlayCtrl.addEventListener('hide', this.__resetActive);
    this.addEventListener('mouseenter', this.__showMouse);
    this.addEventListener('mouseleave', this.__hideMouse);
    this._overlayInvokerNode.addEventListener('focusin', this.__showKey);
    this._overlayInvokerNode.addEventListener('focusout', this.__hideKey);
  }

  _teardownOpenCloseListeners() {
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this.__showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }
}
