---
title: 'Dialog: Use Cases'
parts:
  - Dialog
  - Use Cases
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
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
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
    hidesOnEsc: true,
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

## Long form dialog

Useful for data entry flows where the dialog content is form-heavy and scrollable.

```js preview-story
export const longFormDialog = () => {
  return html`
    <style>
      ${demoStyle} .dialog-form {
        display: grid;
        gap: 16px;
        max-height: 70vh;
        overflow: auto;
        width: 600px;
      }
    </style>
    <lion-dialog>
      <button slot="invoker">Open long form dialog</button>
      <div slot="content" class="demo-box dialog-form">
        <h2 class="demo-box">Application form</h2>
        <lion-input name="firstName" label="First name"></lion-input>
        <lion-input name="lastName" label="Last name"></lion-input>
        <lion-input name="email" label="Email"></lion-input>
        <lion-input name="phone" label="Phone"></lion-input>
        <lion-input-date name="date" label="Date of application"></lion-input-date>
        <lion-input name="street" label="Street"></lion-input>
        <lion-input name="houseNumber" label="House number"></lion-input>
        <lion-input name="postalCode" label="Postal code"></lion-input>
        <lion-input name="city" label="City"></lion-input>
        <lion-input name="country" label="Country"></lion-input>
        <lion-textarea name="bio" label="Biography"></lion-textarea>
        <lion-textarea name="motivation" label="Motivation"></lion-textarea>
        <lion-textarea name="experience" label="Experience"></lion-textarea>
        <lion-checkbox-group label="What do you like?" name="checkers">
          <lion-checkbox .choiceValue=${'foo'} label="I like foo"></lion-checkbox>
          <lion-checkbox .choiceValue=${'bar'} label="I like bar"></lion-checkbox>
        </lion-checkbox-group>
        <lion-checkbox-group label="Contact preferences" name="contactPrefs">
          <lion-checkbox .choiceValue=${'email'} label="Email"></lion-checkbox>
          <lion-checkbox .choiceValue=${'sms'} label="SMS"></lion-checkbox>
          <lion-checkbox .choiceValue=${'phone'} label="Phone"></lion-checkbox>
        </lion-checkbox-group>
        <lion-radio-group name="options" label="Choose option">
          <lion-radio .choiceValue=${'option1'} label="Option 1"></lion-radio>
          <lion-radio .choiceValue=${'option2'} label="Option 2"></lion-radio>
        </lion-radio-group>
        <div class="demo-box">
          <button
            type="button"
            @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
          >
            Submit
          </button>
        </div>
      </div>
    </lion-dialog>
  `;
};
```

Configuration passed to `config` property:

```js
{
  hasBackdrop: false,
  hidesOnEsc: true,
  preventsScroll: true,
  elementToFocusAfterHide: document.body
}
```
