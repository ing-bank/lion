# Checkbox Group

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-checkbox-group` component enhances the functionality of the native `<input type="checkbox">` element. Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

You should use [lion-checkbox](../checkbox/)'s inside this element.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-checkbox-group--default-story) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/checkbox @lion/checkbox-group
```

```js
import '@lion/checkbox/lion-checkbox.js';
import '@lion/checkbox-group/lion-checkbox-group.js';
```

### Example

```html
<lion-checkbox-group
  name="scientists[]"
  label="Favorite scientists"
>
  <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
</lion-checkbox-group>
```
