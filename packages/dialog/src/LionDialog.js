import { html, LitElement } from '@lion/core';
import { OverlayMixin, withModalDialogConfig } from '@lion/overlays';

export class LionDialog extends OverlayMixin(LitElement) {
  constructor() {
    super();
    /** @private */
    this.__toggle = () => {
      this.opened = !this.opened;
    };
  }

  /**
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
    };
  }

  /**
   * @protected
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  /**
   * @protected
   */
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
    `;
  }
}
