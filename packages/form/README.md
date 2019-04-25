# Form

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`lion-form` is a webcomponent that enhances the functionality of the native `form` component. It is designed to interact with (instances of) the [form controls](../field/docs/FormFundaments.md).

## Features

- data synchronization with models
- easy retrieval of form data based on field names
- advanced validation possibilities
- advanced user interaction scenarios via [interaction states](../field/docs/InteractionStates.md)
- registration mechanism for [form controls](../field/).
- accessible out of the box

## How to use

### Installation

```sh
npm i --save @lion/form
```

```js
import '@lion/form/lion-form.js';
```

### Example

```html
<lion-form><form>
  <lion-fieldset name="fullName">
    <lion-input label="First Name" name="firstName" .modelValue=${model.firstName}></lion-input>
    <lion-input label="Last Name" name="lastName" .modelValue=${model.lastName}></lion-input>
  </lion-fieldset>
  <lion-textarea label="Description" name="description" .modelValue=${model.description}></lion-textarea>
</form></lion-form>
```

Note that the example above is rendered using [lit-html](https://github.com/Polymer/lit-html)

For more information about fields that are designed for lion-form, please read
[Forms](../../docs/forms.md).
