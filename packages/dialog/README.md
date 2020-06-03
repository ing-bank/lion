[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Dialog

`lion-dialog` is a component wrapping a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from 'lit-html';
import demoStyle from './docs/demo-dialog-style.js';
import './docs/styled-dialog-content.js';
import './lion-dialog.js';

export default {
  title: 'Overlays/Dialog',
};
```

```js story
export const main = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog>
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

## Features

- Show content when clicking the invoker
- Respond to close event in the slot="content" element, to close the content
- Have a `.config` object to set or update the OverlayController's configuration

## How to use

### Installation

```bash
npm i --save @lion/dialog
```

```js
import { LionDialog } from '@lion/dialog';
// or
import '@lion/dialog/lion-dialog.js';
```

## Usage notes

- Your `slot="content"` node will be moved to the global overlay container during initialization.
  After, your content node is no longer a child of `lion-dialog`.
  If you still need to access it from the `lion-dialog` you can do so by using the `._overlayContentNode` property.
- To close the overlay from within the content node, you need to dispatch a `close-overlay` event that bubbles.
  It has to be able to reach the content node.
- If you need to traverse shadow boundaries, you will have to add `composed: true` as well, although this is discouraged as a practice.

## Changing the configuration

You can use the `config` property on the dialog to change the configuration.
The documentation of the full config object can be found in the `lion/overlay` package or here in [Overlay System - Configuration](/?path=/docs/overlays-system-configuration--placement-mode-local).

The `config` property uses a setter to merge the passed configuration with the current, so you only **overwrite what you pass** when updating `config`.

### Example

```html
<lion-dialog>
  <div slot="content">
    This is a dialog
    <button @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}>x</button>
  <div>
  <button slot="invoker">Click me</button>
</lion-dialog>
```

### Styling content

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

### Close overlay from component slotted as content

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

### Placement overrides

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
      ${dialog('center')} ${dialog('top-left')} ${dialog('top-right')} ${dialog('bottom-left')} ${dialog(
        'bottom-right',
      )}
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

### Other overrides

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
