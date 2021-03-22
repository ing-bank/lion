# Interaction >> Tooltip >> Overview ||10

A web component used for basic popups on hover.
Its purpose is to show content appearing when the user hovers over an invoker element with the cursor or with the keyboard, or if the invoker element is focused.

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
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`;
```

## Features

- Show content when hovering the invoker
- Show content when the invoker is focused
- Does not show content when invoker is disabled
- Uses Popper.js under the hood, to have the content pop up relative to the invoker
- Use `.config` to override the overlay configuration
- Config has `popperConfig` property that has a one to one relation with Popper.js configuration API.

## Installation

```bash
npm i --save @lion/tooltip
```

```js
import { LionTooltip } from '@lion/tooltip';
// or
import '@lion/tooltip/define';
```
