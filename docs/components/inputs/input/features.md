# Inputs >> Input >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/input/define';
```

## Label

Can be provided via the `label` attribute or via the `slot="label"`.

```js preview-story
export const label = () => html` <lion-input label="Input" name="input"></lion-input> `;
```

## Help-text

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

## Prefilled

```js preview-story
export const prefilled = () => html`
  <lion-input .modelValue=${'Prefilled value'} label="Prefilled"></lion-input>
`;
```

## Read only

`readonly` attribute will be delegated to the native `<input>` to make it read-only.

This field **will still be included** in the parent fieldset or form's `serializedValue`.

```js preview-story
export const readOnly = () => html`
  <lion-input readonly .modelValue=${'This is read only'} label="Read only"></lion-input>
`;
```

## Disabled

`disabled` attribute will be delegated to the native `<input>` to make it disabled.

This field **will not be included** in the parent fieldset or form's `serializedValue`.

```js preview-story
export const disabled = () => html`
  <lion-input disabled .modelValue=${'This is disabled'} label="Disabled"></lion-input>
`;
```
