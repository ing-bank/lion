import { html, LitElement } from '@lion/core';
import { OverlayMixin } from '../src/OverlayMixin.js';

/**
 * @typedef {import('../types/OverlayConfig').OverlayConfig} OverlayConfig
 */
class DemoOverlaySystem extends OverlayMixin(LitElement) {
  constructor() {
    super();
    this.__toggle = this.__toggle.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      placementMode: 'global',
    });
  }

  __toggle() {
    this.opened = !this.opened;
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();

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
      <slot name="backdrop"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
      <div>popup is ${this.opened ? 'opened' : 'closed'}</div>
    `;
  }
}
customElements.define('demo-overlay-system', DemoOverlaySystem);
