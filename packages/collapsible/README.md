# Collapsible

`lion-collapsible` is a combination of a button (the trigger), a chunk of 'extra content' and an animation that is used to disclose the extra content.

```js script
import { html } from 'lit-html';

import './lion-collapsible.js';

export default {
  title: 'Others/Collapsible',
};
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

- Use `expanded` to render default open
- `invoker` slot can be custom template e.g. `lion-button`

## How to use

### Installation

```bash
npm i --save @lion/collapsible
```

```js
import { LionCollapsible } from '@lion/collapsible';
// or
import '@lion/collapsible/lion-collapsible.js';
```

### Usage

```html
<lion-collapsible>
  <button slot="invoker">Invoker Text</button>
  <div slot="content">
    Extra content
  </div>
</lion-collapsible>
```

### Examples

### With open state

```js preview-story
export const expanded = () => html`
  <lion-collapsible expanded>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

### Custom Template

```js preview-story
export const customTemplate = () => html`
  <lion-collapsible>
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```
