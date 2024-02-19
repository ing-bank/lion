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
