/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement, css } from 'lit';
import { OverlayMixin } from '@lion/ui/overlays.js';
import { LionButton } from '@lion/ui/button.js';

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
      <slot name="content"></slot>
    `;
  }
}
customElements.define('demo-el-using-overlaymixin', DemoElUsingOverlayMixin);

class DemoOverlay extends OverlayMixin(LitElement) {
  static get styles() {
    return [
      css`
        ::slotted([slot='content']) {
          background-color: #333;
          color: white;
          padding: 8px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-weight: bold;
          font-size: 16px;
          padding: 4px;
        }
      `,
    ];
  }

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
customElements.define('demo-overlay', DemoOverlay);

class DemoCloseButton extends LionButton {
  static get styles() {
    return [
      css`
        ::host {
          background: none;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();

    this.innerText = '⨯';
    this.setAttribute('aria-label', 'Close');
  }
}
customElements.define('demo-close-button', DemoCloseButton);
