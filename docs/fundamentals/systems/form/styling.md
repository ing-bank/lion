# Systems >> Form >> Styling ||40

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/components/define/lion-input.js';
import '@lion/components/define/lion-button.js';
```

## Label

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

## Prefix

The prefix is used for addons to the input like a minus button in the `input-stepper`.

```js preview-story
export const prefix = () => html`
  <lion-input label="Prefix">
    <div slot="prefix">[prefix]</div>
  </lion-input>
`;
```

## Suffix

The suffix can be used for addons to the input like a calculator, datepicker or addressbook.
In these cases a button with an icon is used.

```js preview-story
export const suffix = () => html`
  <lion-input label="Suffix">
    <div slot="suffix">[suffix]</div>
  </lion-input>
`;
```

## Before

> Before slot does not have an active use case yet.

```js preview-story
export const before = () => html`
  <lion-input label="Before">
    <div slot="before">[before]</div>
  </lion-input>
`;
```

## After

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

### Examples

Due to our custom inputs being Web Components, it is possible to put HTML content inside an input. For example if you want to add a button as a prefix or suffix.

```js preview-story
export const ButtonsWithFields = () => html`
  <lion-input label="Prefix and suffix">
    <lion-button slot="prefix">prefix</lion-button>
    <lion-button slot="suffix">suffix</lion-button>
  </lion-input>
`;
```
