---
title: 'Extensions'
parts:
  - Tooltip
  - Extensions
eleventyNavigation:
  key: 'Tooltip: Extensions'
  order: 40
  parent: Tooltip
  title: Extensions
---

# Extensions

This page is the **extension surface**: adding your own tag name,
branding or styling, or overriding a protected hook. A consumer composing `lion-tooltip` in the
regular flow does not need any of it.

# Examples

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-tooltip.js';
```

```js preview-story
export const main = () => html`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }

    .demo-tooltip-content {
      display: block;
      font-size: 16px;
      color: white;
      background-color: black;
      border-radius: 4px;
      padding: 8px;
    }

    .demo-box-placements {
      display: flex;
      flex-direction: column;
      margin: 40px 0 0 200px;
    }

    .demo-box-placements lion-tooltip {
      margin: 20px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content" class="demo-tooltip-content">This is a tooltip</div>
  </lion-tooltip>
`;
```
