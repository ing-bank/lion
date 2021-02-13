# Interaction >> Dialog >> Examples || 30

`lion-dialog` is a component wrapping a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from '@lion/core';
import '@lion/dialog/lion-dialog.js';

import './src/applyDemoDialogStyles.js';
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
export const stylingContent = () => {
  const hideOnOutsideClickConfig = { hidesOnOutsideClick: true, hidesOnEsc: true };
  return html`
    <lion-dialog .config=${hideOnOutsideClickConfig}>
      <button slot="invoker">Styled dialog</button>
      <styled-dialog-content slot="content"></styled-dialog-content>
    </lion-dialog>
  `;
};
```

> The overlay cannot be closed by dispatching the `close-overlay` from a button in a styled component that is slotted in as content, because it will not cross the shadow boundary of the component. A method should be created that will dispatch the `close-overlay` event from the component.

## Content with slots

Slots inside your custom content component still can get focus and can close the dialog directly.

```js preview-story
export const slotsContent = () => {
  const hideOnOutsideClickConfig = { hidesOnOutsideClick: true, hidesOnEsc: true };
  return html`
    <lion-dialog .config=${hideOnOutsideClickConfig}>
      <button slot="invoker">Dialog with content with slots</button>
      <slots-dialog-content slot="content" class="demo-dialog--content">
        <div slot="actions">
          You can close this dialog here:
          <button
            class="close-button"
            @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
          >
            ⨯
          </button>
        </div>
      </slots-dialog-content>
    </lion-dialog>
  `;
};
```

## Placements

You can easily change the placement of the content node relative to the viewport, by adjusting the `placement` inside the `viewportConfig`.

```js preview-story
export const placementOverrides = () => {
  const dialog = placement => {
    const viewportConfig = { viewportConfig: { placement } };
    return html`
      <lion-dialog .config=${viewportConfig}>
        <button slot="invoker">Dialog ${placement}</button>
        <div slot="content" class="demo-dialog--content">
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
  };
  return html`
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

## Other overrides

No backdrop, hides on escape, prevents scrolling while opened, and focuses the body when hiding.

```js preview-story
export const otherOverrides = () => html`
  <lion-dialog
    .config=${{
      hasBackdrop: false,
      hidesOnEscape: true,
      preventsScroll: true,
      elementToFocusAfterHide: document.body,
    }}
  >
    <button slot="invoker">Click me to open dialog</button>
    <div slot="content" class="demo-dialog--content">
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
