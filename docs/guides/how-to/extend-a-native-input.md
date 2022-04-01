# How To >> Extend a native Input ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { LionInput } from '@lion/input';
import { LionInputDate } from '@lion/input-date';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import '@lion/input/define';
import '../../fundamentals/systems/form/assets/h-output.js';

loadDefaultFeedbackMessages();
```

Input fields can be created by extending [LionInput](../../components/input/overview.md).

> In case you want to wrap a custom form element, follow [Create a custom Field](./create-a-custom-field.md).

For this tutorial, we create an input that wraps native `input[type=datetime-local]`.
This is as simple as adding a type:

```js preview-story
export const extendLionInput = () => {
  class LionInputDatetime extends LionInput {
    constructor() {
      super();
      this.type = 'datetime-local';
    }
  }
  customElements.define('lion-input-datetime', LionInputDatetime);

  return html`<lion-input-datetime label="With Date string"></lion-input-datetime>
    <h-output .show="${['modelValue', 'touched', 'dirty', 'focused']}"></h-output>`;
};
```

However, we might want to have a more advanced modelValue. In the example above, our modelValue is
a serialized datetime string.
If we want our modelValue to be of type Date, we should do the following:

```js preview-story
export const extendLionInputDate = () => {
  function toIsoDatetime(d) {
    return d && new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('.')[0];
  }
  function fromIsoDatetime(value) {
    return new Date(value);
  }

  class LionInputDatetimeWithObject extends LionInputDate {
    constructor() {
      super();
      this.type = 'datetime-local';
      this.parser = fromIsoDatetime;
      this.deserializer = fromIsoDatetime;
      this.serializer = toIsoDatetime;
      this.formatter = toIsoDatetime;
    }
  }
  customElements.define('lion-input-datetime-with-object', LionInputDatetimeWithObject);

  return html`<lion-input-datetime-with-object
      label="With Date object"
    ></lion-input-datetime-with-object>
    <h-output .show="${['modelValue', 'touched', 'dirty', 'focused']}"></h-output>`;
};
```
