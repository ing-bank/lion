import { html, LitElement } from 'lit';
import { OverlayMixin, withModalDialogConfig } from '@lion/ui/overlays.js';

/**
 * @customElement lion-dialog
 */
export class LionDialog extends OverlayMixin(LitElement) {
  /** @type {any} */
  static get properties() {
    return {
      isAlertDialog: { type: Boolean, attribute: 'is-alert-dialog' },
    };
  }

  constructor() {
    super();
    this.isAlertDialog = false;
  }

  /**
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
      isAlertDialog: this.isAlertDialog,
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
