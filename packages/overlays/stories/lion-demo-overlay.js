import { html, LitElement } from '@lion/core';
import { OverlayMixin } from '../src/OverlayMixin.js';

class LionDemoOverlay extends OverlayMixin(LitElement) {
  _defineOverlayConfig() {
    return {
      placementMode: 'global',
    };
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__toggle = () => {
      this.opened = !this.opened;
    };

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.__toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }
}
customElements.define('lion-demo-overlay', LionDemoOverlay);
