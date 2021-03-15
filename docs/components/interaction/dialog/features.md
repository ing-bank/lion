# Interaction >> Dialog >> Features ||20

`lion-dialog` is a component wrapping a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from '@lion/core';
import '@lion/dialog/define';

import { demoStyle } from './src/demoStyle.js';
import './src/styled-dialog-content.js';
import './src/slots-dialog-content.js';
```

```html
<lion-dialog>
  <div slot="content">
    This is a dialog
    <button @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}>x</button>
  <div>
  <button slot="invoker">Click me</button>
</lion-dialog>
```

## Styling content

It's not possible to style content from the dialog component. This is because the content slot is moved to the global root node. This is why a custom component should be created and slotted in as the content. This ensures style encapsulation on the dialog content.

```js preview-story
export const stylingContent = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog .config=${{ hidesOnOutsideClick: true, hidesOnEsc: true }}>
    <button slot="invoker">Styled dialog</button>
    <styled-dialog-content slot="content"></styled-dialog-content>
  </lion-dialog>
`;
```

## Content with slots

```js preview-story
export const slotsContent = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog .config=${{ hidesOnOutsideClick: true, hidesOnEsc: true }}>
    <button slot="invoker">Dialog with content with slots</button>
    <slots-dialog-content slot="content">
      <p>Some Stuff</p>
      <p slot="actions">I am in the actions slot</p>
    </slots-dialog-content>
  </lion-dialog>
`;
```

## Close overlay from component slotted as content

The overlay cannot be closed by dispatching the `close-overlay` from a button in a styled component that is slotted in as content, because it will not cross the shadow boundary of the component. A method should be created that will dispatch the `close-overlay` event from the component.

```js preview-story
export const closeOverlayFromComponent = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog .config=${{ hidesOnOutsideClick: true, hidesOnEsc: true }}>
    <button slot="invoker">Styled dialog</button>
    <styled-dialog-content slot="content"></styled-dialog-content>
  </lion-dialog>
`;
```

## Placement overrides

```js preview-story
export const placementOverrides = () => {
  const dialog = placement => html`
    <lion-dialog .config=${{ viewportConfig: { placement } }}>
      <button slot="invoker">Dialog ${placement}</button>
      <div slot="content" class="dialog">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </lion-dialog>
  `;
  return html`
    <style>
      ${demoStyle}
    </style>
    <div class="demo-box_placements">
      ${dialog('center')} ${dialog('top-left')} ${dialog('top-right')} ${dialog('bottom-left')}
      ${dialog('bottom-right')}
    </div>
  `;
};
```

Configuration passed to `config` property:

```js
{
  viewportConfig: {
    placement: ... // <-- choose a position
  }
}
```

## Other overrides

No backdrop, hides on escape, prevents scrolling while opened, and focuses the body when hiding.

```js preview-story
export const otherOverrides = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog
    .config=${{
      hasBackdrop: false,
      hidesOnEscape: true,
      preventsScroll: true,
      elementToFocusAfterHide: document.body,
    }}
  >
    <button slot="invoker">Click me to open dialog</button>
    <div slot="content" class="dialog">
      Hello! You can close this dialog here:
      <button
        class="close-button"
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`;
```

Configuration passed to `config` property:

```js
{
  hasBackdrop: false,
  hidesOnEscape: true,
  preventsScroll: true,
  elementToFocusAfterHide: document.body
}
```
