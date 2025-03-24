# Systems >> Form >> Styling ||40

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-button.js';
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

## Input additions

When using an addition to the input you could add `data-label` to add the content connected to the input via `aria-labelledby` or add `data-description` to connect it via the `aria-describedby` when the content is relevant for the screen-reader user to fill in the form field. This won't be necessary for a search icon, since that should already be clear via the label, but it is relevant in case a unit is added behind the input field.

### Prefix

The prefix is used for addons to the input like a minus button in the `input-stepper`.

```html preview-story
<lion-input label="Prefix">
  <div slot="prefix" data-description>[prefix]</div>
</lion-input>
```

### Suffix

The suffix can be used for addons to the input like a calculator, datepicker or addressbook.
In these cases a button with an icon is used.

```html preview-story
<lion-input label="Suffix">
  <div slot="suffix" data-description>[suffix]</div>
</lion-input>
```

### Before

> Before slot does not have an active use case yet.

```html preview-story
<lion-input label="Before">
  <div slot="before" data-description>[before]</div>
</lion-input>
```

### After

The after is mostly used to add a unit to the input field, such as a currency or percentage.

```html preview-story
<lion-input label="Amount">
  <div slot="after" data-description>EUR</div>
</lion-input>
<lion-input label="Percentage">
  <div slot="after" data-description>%</div>
</lion-input>
```

### Examples

Due to our custom inputs being Web Components, it is possible to put HTML content inside an input. For example if you want to add a button as a prefix or suffix.

```html preview-story
<lion-input label="Prefix and suffix">
  <lion-button slot="prefix">prefix</lion-button>
  <lion-button slot="suffix">suffix</lion-button>
</lion-input>
```
