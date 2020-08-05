[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Progress Indicator

`lion-progress-indicator` implements accessibility requirements for progress indicators.

```js script
import { html } from 'lit-html';
import './demo/custom-progress-indicator.js';

export default {
  title: 'Others/Progress Indicator',
};
```

## Features

- Accessibility compliant
- Localized "Loading" label
- Implementation independent of visuals

## How to use

### Installation

```bash
npm i --save @lion/progress-indicator
```

```js
import { LionProgressIndicator } from '@lion/progress-indicator';
// or
import '@lion/progress-indicator/lion-progress-indicator.js';
```

### Example

```html
<lion-progress-indicator></lion-progress-indicator>
```

## Extended indicator with a custom visual

`LionProgressIndicator` is designed to be extended to add visuals. Implement the `_graphicTemplate` method to set the rendered content, and apply styles normally.

### Example extension

```js
class CustomProgressIndicator extends LionProgressIndicator {
  static get styles() {
    return [
      css`
        svg {
          animation: spinner-rotate 2s linear infinite;
          display: inline-block;
          height: 48px;
          width: 48px;
        }

        circle {
          fill: none;
          stroke-width: 3.6;
          stroke: firebrick;
          stroke-dasharray: 100, 28;
        }

        @keyframes spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }
      `,
    ];
  }

  _graphicTemplate() {
    return html`<svg viewBox="22 22 44 44">
      <circle cx="44" cy="44" r="20.2" />
    </svg>`;
  }
}
```

### Result

```js preview-story
export const customProgressDemo = () => html`
  <custom-progress-indicator></custom-progress-indicator>
`;
```
