# Collapsible

`lion-collapsible` is a combination of a button (the invoker), a chunk of 'extra content', and an animation that is used to disclose the extra content. There are two slots available respectively; `invoker` to specify collapsible invoker and `content` for the extra content of the collapsible.

```js script
import { html } from '@lion/core';

import '@lion/collapsible/define';
import './demo/custom-collapsible.js';
import './demo/applyDemoCollapsibleStyles.js';

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

- Use `opened` or `toggle()` to render default open
- `invoker` slot can be custom template e.g. `lion-button` or native `button` with custom styling
- Observe the state with the help of `@opened-changed` event
- `show()` and `hide()` are helper methods to hide or show the content from outside

## How to use

### Installation

```bash
npm i --save @lion/collapsible
```

```js
import { LionCollapsible } from '@lion/collapsible';
// or
import '@lion/collapsible/define';
```

### Usage

```html
<lion-collapsible>
  <button slot="invoker">Invoker Text</button>
  <div slot="content">Extra content</div>
</lion-collapsible>
```

### Examples

#### Default open

Add the `opened` attribute to keep the component default open.

```js preview-story
export const defaultOpen = () => html`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

#### Methods

There are the following methods available to control the extra content for the collapsible.

- `toggle()`: toggle the extra content
- `show()`: show the extra content
- `hide()`: hide the extra content

```js preview-story
export const methods = () => html`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click=${() => document.querySelector('#car-collapsible').toggle()}>
      Toggle content
    </button>
    <button @click=${() => document.querySelector('#car-collapsible').show()}>Show content</button>
    <button @click=${() => document.querySelector('#car-collapsible').hide()}>Hide content</button>
  </section>
`;
```

#### Events

`lion-collapsible` fires an event on `invoker` click to notify the component's current state. It is useful for analytics purposes or to perform some actions while expanding and collapsing the component.

- `@opened-changed`: triggers when collapsible either gets opened or closed

```js preview-story
export const events = () => html`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${e => {
      const collapsibleState = document.getElementById('collapsible-state');
      collapsibleState.innerText = `Opened: ${e.target.opened}`;
    }}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

#### Custom Invoker Template

A custom template can be specified to the `invoker` slot. It can be any button or custom component which mimics the button behavior for better accessibility support. In the below example, `lion-button` and native `button` with styling is used as a collapsible invoker.

```js preview-story
export const customInvokerTemplate = () => html`
  <lion-collapsible>
    <button class="demo-custom-collapsible-invoker" slot="invoker">MORE ABOUT CARS</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <lion-collapsible style="margin-top:16px;">
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

#### Extended collapsible with animation

`LionCollapsible` can easily be extended to add more features in the component, for example, animation.

```js preview-story
export const customAnimation = () => html`
  <div class="demo-custom-collapsible-container">
    <div class="demo-custom-collapsible-body">
      A motorcycle, often called a motorbike, bike, or cycle, is a two- or three-wheeled motor
      vehicle.
    </div>
    <custom-collapsible>
      <button class="demo-custom-collapsible-invoker" slot="invoker">MORE ABOUT MOTORCYCLES</button>
      <div slot="content">
        Motorcycle design varies greatly to suit a range of different purposes: long distance
        travel, commuting, cruising, sport including racing, and off-road riding. Motorcycling is
        riding a motorcycle and related social activity such as joining a motorcycle club and
        attending motorcycle rallies.
      </div>
    </custom-collapsible>
  </div>
  <div class="demo-custom-collapsible-container">
    <div class="demo-custom-collapsible-body">
      A car (or automobile) is a wheeled motor vehicle used for transportation.
    </div>
    <custom-collapsible opened>
      <button class="demo-custom-collapsible-invoker" slot="invoker">MORE ABOUT CARS</button>
      <div slot="content">
        Most definitions of cars say that they run primarily on roads, seat one to eight people,
        have four tires, and mainly transport people rather than goods.
      </div>
    </custom-collapsible>
  </div>
`;
```

Use `_showAnimation` and `_hideAnimation` methods to customize open and close behavior. Check the full example for the `custom-collapsible` [here](https://github.com/ing-bank/lion/blob/master/packages/collapsible/demo/CustomCollapsible.js).

```js
_showAnimation({ contentNode }) {
    const expectedHeight = await this.__calculateHeight(contentNode);
    contentNode.style.setProperty('opacity', '1');
    contentNode.style.setProperty('padding', '12px 0');
    contentNode.style.setProperty('max-height', '0px');
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    contentNode.style.setProperty('max-height', expectedHeight);
    await this._waitForTransition({ contentNode });
}

_hideAnimation({ contentNode }) {
    if (this._contentHeight === '0px') {
      return;
    }
    ['opacity', 'padding', 'max-height'].map(prop => contentNode.style.setProperty(prop, 0));
    await this._waitForTransition({ contentNode });
}
```
