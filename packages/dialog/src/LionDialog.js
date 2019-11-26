import { OverlayController, withModalDialogConfig, OverlayMixin } from '@lion/overlays';
import { LitElement, html } from '@lion/core';

export class LionDialog extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ contentNode, invokerNode }) {
    return new OverlayController({
      ...withModalDialogConfig(),
      elementToFocusAfterHide: invokerNode,
      contentNode,
      invokerNode,
      ...this.config, // lit-property set by user for overrides
    });
  }

  _setupOpenCloseListeners() {
    this.__close = () => {
      this.opened = false;
    };
    this.__toggle = () => {
      this.opened = !this.opened;
    };
    this._overlayCtrl.invokerNode.addEventListener('click', this.__toggle);
    this._overlayCtrl.contentNode.addEventListener('close', this.__close);
  }

  _teardownOpenCloseListeners() {
    this._overlayCtrl.invokerNode.removeEventListener('click', this.__toggle);
    this._overlayCtrl.contentNode.removeEventListener('close', this.__close);
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }
}
