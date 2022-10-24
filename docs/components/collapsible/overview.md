# Collapsible >> Overview ||10

A combination of a button (the invoker) and a chunk of 'extra content'. This web component can be extended with an animation to disclose the extra content. There are two slots available respectively; `invoker` to specify the collapsible's invoker and `content` for the extra content of the collapsible.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/components/define/lion-collapsible.js';
```

```js preview-story
export const main = () => html`
  <lion-collapsible>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

## Features

- Use `opened` attribute or `toggle()` method to render default open.
- `invoker` slot can be custom template e.g. our [button](../button/overview.md) or native `button` with custom styling.
- Observe the state with the help of `@opened-changed` event.
- `show()` and `hide()` are helper methods to hide or show the content from outside.

## Installation

```bash
npm i --save @lion/collapsible
```

```js
import { LionCollapsible } from '@lion/components/collapsible.js';
// or
import '@lion/components/define/lion-collapsible.js';
```
