---
parts:
  - 'Button: Extensions'
title: 'Button: Extensions'
eleventyNavigation:
  key: 'Button: Extensions'
  order: 90
  parent: Button
  title: 'Button: Extensions'
---

# Button: Extensions

```js script
import { html } from '@mdjs/mdjs-preview';
import './assets/bootstrap-button.js';
```

## Bootstrap button

```js preview-story
const capitalize = s => s[0].toUpperCase() + s.slice(1);

export const bootstrapButton = () => {
  const variants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
  ];

  return html`<div>
    ${variants.map(v => html`<bootstrap-button variant="${v}">${capitalize(v)}</bootstrap-button>`)}
  </div>`;
};
```
