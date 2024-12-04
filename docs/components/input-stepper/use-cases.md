# Input Stepper >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-input-stepper.js';
loadDefaultFeedbackMessages();
```

## Default

When no range or step is defined, it can go infinite with default step value as `1`. You can also specify prefix content using `after` slot.

```html preview-story
<lion-input-stepper name="year">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>
```

## Attributes & Properties

### Step and Value

Use `step` attribute to specify the incrementor or decrementor difference and `value` to set the default value.

```html preview-story
<lion-input-stepper
  label="Amount of oranges"
  min="100"
  step="100"
  name="value"
  value="200"
></lion-input-stepper>
```

### Range

Use `min` and `max` attribute to specify a range.

```html preview-story
<lion-input-stepper
  label="Amount of oranges"
  min="200"
  max="500"
  name="value"
  step="100"
  value="200"
></lion-input-stepper>
```

### Value text

Use the `.valueText` property to override the value with a text.

```js preview-story
export const valueText = () => {
  const values = {
    1: 'first',
    2: 'second',
    3: 'third',
    4: 'fourth',
    5: 'fifth',
    6: 'sixth',
    7: 'seventh',
    8: 'eighth',
    9: 'ninth',
    10: 'tenth',
  };
  return html`
    <lion-input-stepper
      label="Order"
      min="1"
      max="10"
      name="value"
      .valueText="${values}"
    ></lion-input-stepper>
  `;
};
```

### Formatting

Just like with the `input-amount` you can add the `formatOptions` to format the numbers to your preferences, to a different locale or adjust the amount of fractions.

```js preview-story
export const formatting = () => {
  const format = { locale: 'nl-NL' };
  return html`
    <lion-input-stepper
      label="Amount of oranges"
      min="0"
      max="5000"
      step="100"
      name="value"
      .formatOptions="${format}"
      .modelValue="${1200}"
    ></lion-input-stepper>
  `;
};
```
