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
