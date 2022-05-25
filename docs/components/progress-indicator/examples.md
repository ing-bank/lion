# Progress Indicator >> Examples ||30

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/progress-indicator/define';
import './assets/my-indeterminate-progress-spinner.js';
import './assets/my-determinate-progress-bar.js';

const changeProgress = () => {
  const progressBar = document.getElementsByName('my-bar')[0];
  progressBar.value = Math.floor(Math.random() * 101);
};
```

## Styled progress bar example

Add custom styles and more features by extending the `LionProgressIndicator`.

```js
export class MyDeterminateProgressBar extends LionProgressIndicator {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 6px;
          overflow: hidden;
          background-color: #eee;
        }

        .progress__filled {
          height: inherit;
          background-color: green;
          border-radius: inherit;
        }
      `,
    ];
  }

  _graphicTemplate() {
    return html`
      <div class="progress__filled" style="width: \${this._progressPercentage}%"></div>
    `;
  }
}
```

By given the progress-indicator a value it becomes determinate.
The min is automatically set to "0" and max to "100", but they can be set to your local needs.

```js preview-story
export const progressBarDemo = () =>
  html`
    <my-determinate-progress-bar
      aria-label="Interest rate"
      name="my-bar"
      value="50"
    ></my-determinate-progress-bar>
    <button @click="${changeProgress}">Randomize Value</button>
  `;
```

## Styled progress spinner example

`LionProgressIndicator` is designed to be extended to add visuals. Implement the `_graphicTemplate()` method to set the rendered content and apply styles normally.

```js
class MyIndeterminateProgressSpinner extends LionProgressIndicator {
  static get styles() {
    return [
      css`
        .progress__icon {
          display: inline-block;
          width: 48px;
          height: 48px;
          animation: spinner-rotate 2s linear infinite;
        }

        .progress__filled {
          animation: spinner-dash 1.35s ease-in-out infinite;
          fill: none;
          stroke-width: 6px;
          stroke: var(--primary-color);
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
      <svg class="progress__icon" viewBox="20 20 47 47">
        <circle class="progress__filled" cx="44" cy="44" r="20.2" />
      </svg>
    `;
  }
}
```

```js preview-story
export const main = () =>
  html` <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner> `;
```
