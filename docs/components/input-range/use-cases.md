---
title: 'Use Cases'
parts:
  - Input Range
  - Use Cases
eleventyNavigation:
  key: 'Input Range: Use Cases'
  order: 20
  parent: Input Range
  title: Use Cases
---

# Use Cases

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-range.js';
```

## Units

```html preview-story
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
```

## Steps

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  min="200"
  max="500"
  step="50"
  .modelValue="${300}"
  label="Input range"
  help-text="This slider uses increments of 50"
></lion-input-range>
```

## Without Min Max Labels

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  no-min-max-labels
  min="0"
  max="100"
  label="Input range"
></lion-input-range>
```

## Custom Min Max Labels

```html preview-story
<lion-input-range
  min="0"
  max="11"
  min-label="less than 1 item"
  max-label="more than 10 items"
  .modelValue="${4}"
  unit="Items"
  label="Items"
></lion-input-range>
```

## Disabled

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  disabled
  min="200"
  max="500"
  .modelValue="${300}"
  label="Input range"
></lion-input-range>
```
