---
title: 'Input: Use Cases'
parts:
  - Input
  - Use Cases
eleventyNavigation:
  key: 'Input: Use Cases'
  order: 20
  parent: Input
  title: Use Cases
---

# Input: Use Cases

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
```

## Label

Can be provided via the `label` attribute or via the `slot="label"`.

```html preview-story
<lion-input label="Input" name="input"></lion-input>
```

## Label sr-only (a11y)

Can be provided via the `label-sr-only` boolean attribute.

The label will be hidden, but still readable by screen readers.

```html preview-story
<lion-input label-sr-only label="Input" name="input"></lion-input>
```

> Note: Once we support the ElementInternals API, the equivalent will be `<lion-input aria-label="Input" name="input"></lion-input>`

## Help-text

A helper text shown below the label to give extra clarification.

Just like the `label`, a `help-text` can be provided via the `help-text` attribute, a slot can be used to change the `html` and `CSS` of the help-text.

```html preview-story
<lion-input>
  <label slot="label">Label</label>
  <div slot="help-text">Help text using <strong>html</strong></div>
</lion-input>
```

## Prefilled

```html preview-story
<lion-input .modelValue="${'Prefilled value'}" label="Prefilled"></lion-input>
```

## Read only

`readonly` attribute will be delegated to the native `<input>` to make it read-only.

This field **will still be included** in the parent fieldset or form's `serializedValue`.

```html preview-story
<lion-input readonly .modelValue="${'This is read only'}" label="Read only"></lion-input>
```

## Disabled

`disabled` attribute will be delegated to the native `<input>` to make it disabled.

This field **will not be included** in the parent fieldset or form's `serializedValue`.

```html preview-story
<lion-input disabled .modelValue="${'This is disabled'}" label="Disabled"></lion-input>
```

## With clear button

A button to clear the content can be added to the input by extending it with the `ClearButtonMixin`.

```js preview-story
import { html, LitElement } from 'lit';
import { ClearButtonMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';

class MyInput extends ClearButtonMixin(LionInput) {}

customElements.define('my-input', MyInput);

export const clearButton = () =>
  previewHtml`<my-input label="Input with clear button" name="input"></my-input>`;
```
