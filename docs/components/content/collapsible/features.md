# Content >> Collapsible >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/collapsible/define';
```

## Default open

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

## Methods

There are the following methods available to control the extra content for the collapsible.

- `toggle()`: toggle the extra content
- `show()`: show the extra content
- `hide()`: hide the extra content

```js preview-story
export const methods = ({ shadowRoot }) => html`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click=${() => shadowRoot.querySelector('#car-collapsible').toggle()}>
      Toggle content
    </button>
    <button @click=${() => shadowRoot.querySelector('#car-collapsible').show()}>
      Show content
    </button>
    <button @click=${() => shadowRoot.querySelector('#car-collapsible').hide()}>
      Hide content
    </button>
  </section>
`;
```

## Events

`lion-collapsible` fires an event on `invoker` click to notify the component's current state. It is useful for analytics purposes or to perform some actions while expanding and collapsing the component.

- `@opened-changed`: triggers when collapsible either gets opened or closed

```js preview-story
export const events = ({ shadowRoot }) => html`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${ev => {
      const collapsibleState = shadowRoot.getElementById('collapsible-state');
      collapsibleState.innerText = `Opened: ${ev.target.opened}`;
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
