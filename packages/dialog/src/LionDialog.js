import { LionOverlay, OverlayController, withModalDialogConfig } from '@lion/overlays';

export class LionDialog extends LionOverlay {
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
}
