import { html, css } from '@lion/core';
import { LionProgressIndicator } from '@lion/progress-indicator';

export class CustomProgressIndicator extends LionProgressIndicator {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .progress--icon {
          display: inline-block;
          width: 48px;
          height: 48px;
          animation: spinner-rotate 2s linear infinite;
        }

        .progress--icon--circle {
          animation: spinner-dash 1.35s ease-in-out infinite;
          fill: none;
          stroke-width: 6px;
          stroke: var(--primary-color);
          stroke-dasharray: 100, 28; /* This is a fallback for IE11 */
        }

        @keyframes spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100, 28;
            stroke-dashoffset: -16;
          }
          100% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: -127;
          }
        }
      `,
    ];
  }

  _graphicTemplate() {
    return html`
      <svg class="progress--icon" viewBox="20 20 47 47">
        <circle class="progress--icon--circle" cx="44" cy="44" r="20.2" />
      </svg>
    `;
  }
}

customElements.define('custom-progress-indicator', CustomProgressIndicator);
