import { withModalDialogConfig, OverlayMixin } from '@lion/overlays';
import { LitElement, html } from '@lion/core';

export class LionDialog extends OverlayMixin(LitElement) {
  constructor() {
    super();
    this.closeEventName = 'dialog-close';
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
    };
  }

  _setupOpenCloseListeners() {
    this.__toggle = () => {
      this.opened = !this.opened;
    };

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  _teardownOpenCloseListeners() {
    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.__toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }
}
