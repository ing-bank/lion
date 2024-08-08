# Select >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-select.js';
loadDefaultFeedbackMessages();
```

## Pre-select

You can preselect an option by setting the property modelValue.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color" .modelValue="${'hotpink'}">
  <select slot="input">
    <option selected hidden value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

## Disabled

You can disable an option by adding the `disabled` attribute to an option.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected hidden value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink" disabled>Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

Or by setting the `disabled` attribute on the entire `lion-select` field.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color" disabled>
  <select slot="input">
    <option selected hidden value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

## Validation

A validator can be used to make it e.g. `required`. If you want to know how to do that, please take a look at our [validation examples](../../fundamentals/systems/form/validate.md).
