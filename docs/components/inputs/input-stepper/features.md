# Inputs >> Input Stepper >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/input-stepper/define';
```

## Default with no specification

When no range or step is defined, it can go infinite with default step value as `1`. You can also specify prefix content using `after` slot.

```js preview-story
export const defaultMode = () => html`
  <label>How old is the existence?</label>
  <lion-input-stepper name="year">
    <div slot="after">In Billion Years</div>
  </lion-input-stepper>
`;
```

## Step and Value

Use `step` attribute to specify the incrementor or decrementor difference and `value` to set the default value.

```js preview-story
export const steps = () => html`
  <p><strong>Min:</strong> 100, <strong>Value:</strong> 200, <strong>Step:</strong> 100</p>
  <lion-input-stepper min="100" step="100" name="value" value="200"></lion-input-stepper>
`;
```

## Range

Use `min` and `max` attribute to specify range.

```js preview-story
export const range = () => html`
  <p><strong>Min:</strong> 200, <strong>Max:</strong> 500, <strong>Step:</strong> 100</p>
  <lion-input-stepper min="200" max="500" name="value" step="100" value="200"></lion-input-stepper>
`;
```
