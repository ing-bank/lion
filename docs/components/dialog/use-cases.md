---
parts:
  - Dialog
  - Use Cases
title: 'Dialog: Use Cases'
eleventyNavigation:
  key: 'Dialog: Use Cases'
  order: 20
  parent: Dialog
  title: Use Cases
---

# Dialog: Use Cases

`lion-dialog` is a component wrapping a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-button.js';

import { demoStyle } from './src/demoStyle.js';
import './src/styled-dialog-content.js';
import './src/slots-dialog-content.js';
import './src/external-dialog.js';
```

```html
<lion-dialog>
  <div slot="content">
    This is a dialog
    <button @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}">x</button>
  <div>
  <button slot="invoker">Click me</button>
</lion-dialog>
```

## Alert dialog

In some cases the dialog should act like an [alertdialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/), which is a combination of an alert and dialog. If that is the case, you can add `is-alert-dialog` attribute, which sets the correct role on the dialog.

```js preview-story
export const alertDialog = () => {
  return html`
    <style>
      ${demoStyle}
    </style>
    <lion-dialog is-alert-dialog class="dialog">
      <button type="button" slot="invoker">Reset</button>
      <div slot="content" class="demo-box">
        Are you sure you want to clear the input field?
        <button
          type="button"
          @click="${ev => ev.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          Yes
        </button>
        <button
          type="button"
          @click="${ev => ev.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          No
        </button>
      </div>
    </lion-dialog>
  `;
};
```

## External trigger

```js preview-story
export const externalTrigger = () => {
  const externalTriggerDialog = () => {
    class DialogTriggerDemo extends LitElement {
      static get properties() {
        return {
          _isOpen: { state: true },
        };
      }

      toggleDialog(open) {
        return () => (this._isOpen = open);
      }

      handleDialog(e) {
        this._isOpen = e.detail.opened;
      }

      render() {
        return html`
          <button @click=${this.toggleDialog(true)}>Open dialog</button>
          <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
            <div slot="content" class="dialog demo-box">
              Hello! You can close this notification here:
              <button class="close-button" @click=${this.toggleDialog(false)}>⨯</button>
            </div>
          </lion-dialog>
        `;
      }
    }
  };

  return html`
    <style>
      ${demoStyle}
    </style>
    <div class="demo-box_placements">
      <dialog-trigger-demo></dialog-trigger-demo>
    </div>
  `;
};
```

## Placement overrides

```js preview-story
export const placementOverrides = () => {
  const dialog = placement => {
    const cfg = { viewportConfig: { placement } };
    return html`
      <lion-dialog .config="${cfg}">
        <button slot="invoker">Dialog ${placement}</button>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
          >
            ⨯
          </button>
        </div>
      </lion-dialog>
    `;
  };
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
export const otherOverrides = () => {
  const cfg = {
    hasBackdrop: false,
    hidesOnEscape: true,
    preventsScroll: true,
    elementToFocusAfterHide: document.body,
  };

  return html`
    <style>
      ${demoStyle}
    </style>
    <lion-dialog .config="${cfg}">
      <button slot="invoker">Click me to open dialog</button>
      <div slot="content" class="demo-dialog-content">
        Hello! You can close this dialog here:
        <button
          class="demo-dialog-content__close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </lion-dialog>
  `;
};
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


## With form submit


```js preview-story
export const withFormSubmit = () => {
      return html`<lion-dialog>
        <div slot="content">
          <lion-form id="myForm" @submit="${({currentTarget}) => currentTarget.closest('lion-dialog').close()}">
            <form id="myForm" @submit="${e => e.preventDefault()}">
              <input type="text" name="name" />
              <button type="submit">Submit</button>
            </form>
          </lion-form>
        </div>
        <lion-button slot="invoker">Invoker</lion-button>
      </lion-dialog>`;
}
```
