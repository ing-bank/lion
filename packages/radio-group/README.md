# Radio-group

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-radio-group` component is webcomponent that enhances the functionality of the native `<input type="radio">` element. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

You should use [lion-radio](../radio/)'s inside this element.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-radio-group--default-story) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/radio @lion/radio-group
```

```js
import '@lion/radio/lion-radio.js';
import '@lion/radio-group/lion-radio-group.js';
```

### Example

```html
<lion-radio-group name="dinos" label="What are your favourite dinosaurs?">
  <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
  <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
  <lion-radio label="diplodocus" .choiceValue=${'diplodocus'} checked></lion-radio>
</lion-radio-group>
```

- Make sure that to use a name attribute as it is necessary for the [lion-form](../form)'s serialization result.
- If you have many options for a user to pick from, consider using [`lion-select`](../select) instead

### Model value

The `modelValue` of a `lion-radio-group` is string equal to the `choiceValue` of the `lion-radio` element that has been checked.

Given the dinosaur example above, say that we were to select the last option (diplodocus).

Then the `modelValue` of the `lion-radio-group` will look as follows:

```js
const groupElement = [parent].querySelector('lion-radio-group');
groupElement.modelValue;
  => "diplodocus";
```

### The `name` attribute

The `name` attribute of a `lion-radio-group` automatically gets assigned to its `lion-radio` children. You can also specify names for the `lion-radio` elements, but if this name is different from the name assigned to `lion-radio-group`, then an exception will be thrown.

Our recommendation would be to set the `name` attribute only on the `lion-radio-group` and not on the `lion-checkbox` elements.
