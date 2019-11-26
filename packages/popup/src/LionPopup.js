import { OverlayController, LionOverlay } from '@lion/overlays';

export class LionPopup extends LionOverlay {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay() {
    return new OverlayController({
      placementMode: 'local',
      hidesOnOutsideClick: true,
      hidesOnEsc: true,
      contentNode: this._overlayContentNode,
      invokerNode: this._overlayInvokerNode,
      handlesAccessibility: true,
      ...this.config,
    });
  }
}
