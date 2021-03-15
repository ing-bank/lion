# Inputs >> Input Range >> Features ||20

```js script
import { html } from '@lion/core';
import '@lion/input-range/define';
```

## Units

```js preview-story
export const units = () => html`
  <style>
    lion-input-range {
      max-width: 400px;
    }
  </style>
  <lion-input-range
    min="0"
    max="100"
    .modelValue="${50}"
    unit="%"
    label="Percentage"
  ></lion-input-range>
`;
```

## Steps

```js preview-story
export const steps = () => html`
  <lion-input-range
    style="max-width: 400px;"
    min="200"
    max="500"
    step="50"
    .modelValue="${300}"
    label="Input range"
    help-text="This slider uses increments of 50"
  ></lion-input-range>
`;
```

## Without Min Max Labels

```js preview-story
export const noMinMaxLabels = () => html`
  <lion-input-range
    style="max-width: 400px;"
    no-min-max-labels
    min="0"
    max="100"
    label="Input range"
  ></lion-input-range>
`;
```

## Disabled

```js preview-story
export const disabled = () => html`
  <lion-input-range
    style="max-width: 400px;"
    disabled
    min="200"
    max="500"
    .modelValue="${300}"
    label="Input range"
  ></lion-input-range>
`;
```
