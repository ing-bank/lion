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
    this.__close = () => {
      this.opened = false;
    };
    this.__toggle = () => {
      this.opened = !this.opened;
    };
    this._overlayCtrl.invokerNode.addEventListener('click', this.__toggle);
  }

  _teardownOpenCloseListeners() {
    this._overlayCtrl.invokerNode.removeEventListener('click', this.__toggle);
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }
}
