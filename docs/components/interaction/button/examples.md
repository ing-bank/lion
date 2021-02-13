# Interaction >> Button >> Examples || 30

```js script
import { html } from '@lion/core';
import '@lion/button/lion-button.js';
import iconSvg from './src/icon.svg.js';
```

## Icon button

```js preview-story
export const iconButton = () => html`<lion-button>${iconSvg(html)}Bug</lion-button>`;
```

## Icon only button

When only an icon is used, make sure the button still have an accessible name, via `aria-label`.

```js preview-story
export const iconOnly = () => html`<lion-button aria-label="Bug">${iconSvg(html)}</lion-button>`;
```

## Multiple buttons inline

```js preview-story
export const mainAndIconButton = () => html`
  <lion-button>Default</lion-button>
  <lion-button>${iconSvg(html)} Bug</lion-button>
`;
```
