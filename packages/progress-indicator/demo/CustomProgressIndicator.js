import { svg, css } from '@lion/core';
import { LionProgressIndicator } from '../index.js';

export class CustomProgressIndicator extends LionProgressIndicator {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        svg {
          animation: spinner-rotate 2s linear infinite;
          display: inline-block;
          height: 48px;
          width: 48px;
        }

        circle {
          animation: spinner-dash 1.35s ease-in-out infinite;
          fill: none;
          stroke-width: 3.6;
          stroke: firebrick;
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
    return svg`<svg viewBox="22 22 44 44">
      <circle cx="44" cy="44" r="20.2" />
    </svg>`;
  }
}
