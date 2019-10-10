import { LitElement, html } from '@lion/core';
import { OverlayMixin, OverlayController } from '@lion/overlays';

export class LionPopup extends OverlayMixin(LitElement) {
  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }

  get _overlayContentNode() {
    return this.querySelector('[slot=content]');
  }

  get _overlayInvokerNode() {
    return this.querySelector('[slot=invoker]');
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlay() {
    return new OverlayController({
      placementMode: 'local',
      contentNode: this._overlayContentNode,
      invokerNode: this._overlayInvokerNode,
      handlesAccessibility: true,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.__toggle = () => this._overlayCtrl.toggle();
    this._overlayInvokerNode.addEventListener('click', this.__toggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._overlayInvokerNode.removeEventListener('click', this._toggle);
  }
}
