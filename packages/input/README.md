# Input

`lion-input` component is a webcomponent that enhances the functionality of the native `<input>` element.

```js script
import { html } from '@lion/core';
import { MaxLength } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import { localize } from '@lion/localize';

import './lion-input.js';

export default {
  title: 'Forms/Input',
};
```

```js preview-story
export const main = () => html` <lion-input label="First Name"></lion-input> `;
```

## Features

- Based on [field](?path=/docs/forms-system-overview--page)
- Extra visual elements can be added via `slots`
  - **label**: can also be provided via the `label` attribute, but the slot can be used to change the `html` and `CSS` of the label.
    For example add an `u-sr-only` class to the label to make it visually hidden.
    A label is always needed for accessibility reasons.
  - **help-text**: a helper text shown below the label to give extra clarification.
  - **prefix**: does not have an active use case yet, but the option is in place.
  - **suffix**: can be used for addons to the input like a calculator, datepicker or addressbook. In these cases a button with an icon is used.
  - **before**: does not have an active use case yet, but the option is in place.
  - **after**: can be used to show a currency or percentage.
- Delegates attributes like `type`, `disabled`, `placeholder` and `read-only` to the native input.
- Can make us of [validation](?path=/docs/forms-validation-overview--main#validate)

## How to use

### Installation

```bash
npm i --save @lion/input
```

```js
import '@lion/input/lion-input.js';
```

## Examples

### Label

Can be provided via the `label` attribute, but the slot can be used to change the `html` and `CSS` of the label.
For example add an `u-sr-only` class to the label to make it (partially) visually hidden.
A label is always needed for accessibility reasons.

```js preview-story
export const label = () => html`
  <style>
    .u-sr-only {
      position: absolute;
      top: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(100%);
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
      border: 0;
      margin: 0;
      padding: 0;
    }
  </style>
  <lion-input>
    <label slot="label"
      >Label <span class="u-sr-only">partially only visible for screen-readers</span></label
    >
  </lion-input>
`;
```

### Help-text

A helper text shown below the label to give extra clarification.

Just like the `label`, a `help-text` can be provided via the `help-text` attribute, a slot can be used to change the `html` and `CSS` of the help-text.
For example add an anchor with further explanation.

```js preview-story
export const helpText = () => html`
  <lion-input>
    <label slot="label">Label</label>
    <div slot="help-text">
      Help text using <a href="https://example.com/" target="_blank">html</a>
    </div>
  </lion-input>
`;
```

### Prefilled

```js preview-story
export const prefilled = () => html`
  <lion-input .modelValue=${'Prefilled value'} label="Prefilled"></lion-input>
`;
```

### Read only

`readonly` attribute will be delegated to the native `<input>` to make it read-only.

This field **will still be included** in the parent fieldset or form's `serializedValue`.

```js preview-story
export const readOnly = () => html`
  <lion-input readonly .modelValue=${'This is read only'} label="Read only"></lion-input>
`;
```

### Disabled

`disabled` attribute will be delegated to the native `<input>` to make it disabled.

This field **will not be included** in the parent fieldset or form's `serializedValue`.

```js preview-story
export const disabled = () => html`
  <lion-input disabled .modelValue=${'This is disabled'} label="Disabled"></lion-input>
`;
```

### Prefix

> Prefix slot does not have an active use case yet.

```js preview-story
export const prefix = () => html`
  <lion-input label="Prefix">
    <div slot="prefix">[prefix]</div>
  </lion-input>
`;
```

### Suffix

The suffix can be used for addons to the input like a calculator, datepicker or addressbook.
In these cases a button with an icon is used.

```js preview-story
export const suffix = () => html`
  <lion-input label="Suffix">
    <div slot="suffix">[suffix]</div>
  </lion-input>
`;
```

### Before

> Before slot does not have an active use case yet.

```js preview-story
export const before = () => html`
  <lion-input label="Before">
    <div slot="before">[before]</div>
  </lion-input>
`;
```

### After

```js preview-story
export const after = () => html`
  <lion-input label="Amount">
    <div slot="after">EUR</div>
  </lion-input>
  <lion-input label="Percentage">
    <div slot="after">%</div>
  </lion-input>
`;
```

## Using validation

The input can be used with [validation](?path=/docs/forms-validation-overview--page).
On certain conditions, a feedback message can be shown if the input value is invalid.

You can change the locale with the buttons below the field.
Our default validators come with default translations already.

```js preview-story
export const validation = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input
      label="Value"
      .modelValue=${'Too long input'}
      .validators=${[new MaxLength(5)]}
    ></lion-input>
    <button @click=${() => (localize.locale = 'de-DE')}>DE</button>
    <button @click=${() => (localize.locale = 'en-GB')}>EN</button>
    <button @click=${() => (localize.locale = 'fr-FR')}>FR</button>
    <button @click=${() => (localize.locale = 'nl-NL')}>NL</button>
    <button @click=${() => (localize.locale = 'zh-CN')}>CN</button>
  `;
};
```
