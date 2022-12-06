import { css, LitElement } from 'lit';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 */
class DemoOverlayBackdrop extends LitElement {
  static get styles() {
    return css`
      :host {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: grey;
        opacity: 0.3;
      }

      :host(.local-overlays__backdrop--visible) {
        display: block;
      }

      :host(.local-overlays__backdrop--animation-in) {
        animation: local-overlays-backdrop-fade-in 300ms;
      }

      :host(.local-overlays__backdrop--animation-out) {
        animation: local-overlays-backdrop-fade-out 300ms;
        opacity: 0;
      }

      @keyframes local-overlays-backdrop-fade-in {
        from {
          opacity: 0;
        }
      }

      @keyframes local-overlays-backdrop-fade-out {
        from {
          opacity: 0.3;
        }
      }
    `;
  }
}
customElements.define('demo-overlay-backdrop', DemoOverlayBackdrop);
