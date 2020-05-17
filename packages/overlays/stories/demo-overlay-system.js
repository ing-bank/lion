import { html, LitElement } from '@lion/core';
import { OverlayMixin } from '../src/OverlayMixin.js';

class DemoOverlaySystem extends OverlayMixin(LitElement) {
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
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
      <div>popup is ${this.opened ? 'opened' : 'closed'}</div>
    `;
  }
}
customElements.define('demo-overlay-system', DemoOverlaySystem);
