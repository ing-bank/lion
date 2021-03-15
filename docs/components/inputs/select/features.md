# Inputs >> Select >> Features ||20

```js script
import { html } from '@lion/core';
import '@lion/select/define';
```

## Pre-select

You can preselect an option by setting the property modelValue.

```js preview-story
export const preSelect = () => html`
  <lion-select name="favoriteColor" label="Favorite color" .modelValue=${'hotpink'}>
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink">Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

## Disabled

You can disable an option by adding the `disabled` attribute to an option.

```js preview-story
export const disabledOption = () => html`
  <lion-select name="favoriteColor" label="Favorite color">
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink" disabled>Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

Or by setting the `disabled` attribute on the entire `lion-select` field.

```js preview-story
export const disabledSelect = () => html`
  <lion-select name="favoriteColor" label="Favorite color" disabled>
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink">Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```
