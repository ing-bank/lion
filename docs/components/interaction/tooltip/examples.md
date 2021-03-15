# Interaction >> Tooltip >> Examples ||30

```js script
import { html } from '@lion/core';
import '@lion/tooltip/define';
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
