# Content >> Progress Indicator >> Examples ||30

```js script
import { html } from '@lion/core';
import './assets/custom-progress-indicator.js';
```

## Extended indicator with a custom visual

`LionProgressIndicator` is designed to be extended to add visuals. Implement the `_graphicTemplate()` method to set the rendered content and apply styles normally.

### Example extension

```js
class CustomProgressIndicator extends LionProgressIndicator {
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
```

### Result

```js preview-story
export const main = () => html` <custom-progress-indicator></custom-progress-indicator> `;
```
