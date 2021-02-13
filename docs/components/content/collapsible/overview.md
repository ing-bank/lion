# Content >> Collapsible >> Overview ||10

`lion-collapsible` is a combination of a button (the invoker), a chunk of 'extra content', and an animation that is used to disclose the extra content. There are two slots available respectively; `invoker` to specify collapsible invoker and `content` for the extra content of the collapsible.

```js script
import { html } from '@lion/core';
import '@lion/collapsible/lion-collapsible.js';
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

- Use `opened` or `toggle()` to render default open
- `invoker` slot can be custom template e.g. `lion-button` or native `button` with custom styling
- Observe the state with the help of `@opened-changed` event
- `show()` and `hide()` are helper methods to hide or show the content from outside

## Installation

```bash
npm i --save @lion/collapsible
```

```js
import { LionCollapsible } from '@lion/collapsible';
// or
import '@lion/collapsible/lion-collapsible.js';
```
