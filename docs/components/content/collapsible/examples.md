# Content >> Collapsible >> Examples ||30

```js script
import { html } from '@lion/core';
import '@lion/collapsible/define';
import '@lion/button/define';
import './assets/CustomCollapsible.js';
import './assets/applyDemoCollapsibleStyles.js';
```

## Custom Invoker Template

A custom template can be specified to the `invoker` slot. It can be any button or custom component which mimics the button behavior for better accessibility support. In the below example, `lion-button` and native `button` with styling is used as a collapsible invoker.

```js preview-story
export const customInvokerTemplate = () => html`
  <lion-collapsible style="margin-top:16px;">
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;
```

## Extended collapsible with animation

`LionCollapsible` can easily be extended to add more features in the component, like animation for example.

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

Use `_showAnimation()` and `_hideAnimation()` methods to customize open and close behavior. Check the code for a full example of a `custom-collapsible`.

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
