import { html, LitElement } from 'lit';
import { OverlayMixin } from '@lion/ui/overlays.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 */
class DemoElUsingOverlayMixin extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      placementMode: 'global',
    });
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `;
  }
}
customElements.define('demo-el-using-overlaymixin', DemoElUsingOverlayMixin);
