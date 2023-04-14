import { html, LitElement } from 'lit';
import { OverlayMixin, withModalDialogConfig } from '@lion/ui/overlays.js';

export class LionDialog extends OverlayMixin(LitElement) {
  /**
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
    };
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
