# Input Stepper

`lion-input-stepper` enables the user to increase and decrease a numeric value by predefined range. It is a combination of two buttons and a number input field with an optional slot `after` to suffix the extra information.

```js script
import { html } from '@lion/core';
import '@lion/input-stepper/define';

export default {
  title: 'Forms/Input Stepper',
};
```

```js preview-story
export const main = () => html`
  <lion-input-stepper max="5" min="0" name="count">
    <label slot="label">RSVP</label>
    <div slot="help-text">Max. 5 guests</div>
  </lion-input-stepper>
`;
```

## Features

- Based on [lion-input](?path=/docs/forms-input--main#input).
- Set `min` and `max` value to define the range.
- Set `step` value in integer or decimal to increase and decrease the value.
- Use `ArrowUp` or `ArrowDown` to update the value.

## How to use

### Installation

```bash
npm i --save @lion/input-stepper
```

```js
import { LionInputStepper } from '@lion/input-stepper';
// or
import '@lion/input-stepper/define';
```

### Usage

```html
<lion-input-stepper max="5" min="0" name="count">
  <label slot="label">RSVP</label>
  <div slot="help-text">Max. 5 guests</div>
</lion-input-stepper>
```

### Examples

#### Default with no specification

When no range or step is defined, it can go infinite with default step value as `1`. You can also specify prefix content using `after` slot.

```js preview-story
export const defaultMode = () => html`
  <label>How old is the existence?</label>
  <lion-input-stepper name="year">
    <div slot="after">In Billion Years</div>
  </lion-input-stepper>
`;
```

#### Step and Value

Use `step` attribute to specify the incrementor or decrementor difference and `value` to set the default value.

```js preview-story
export const steps = () => html`
  <p><strong>Min:</strong> 100, <strong>Value:</strong> 200, <strong>Step:</strong> 100</p>
  <lion-input-stepper min="100" step="100" name="value" value="200"></lion-input-stepper>
`;
```

#### Range

Use `min` and `max` attribute to specify range.

```js preview-story
export const range = () => html`
  <p><strong>Min:</strong> 200, <strong>Max:</strong> 500, <strong>Step:</strong> 100</p>
  <lion-input-stepper min="200" max="500" name="value" step="100" value="200"></lion-input-stepper>
`;
```
