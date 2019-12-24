# Form

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-form` is a webcomponent that enhances the functionality of the native `form` component.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-form) for a live demo and documentation

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
<lion-form>
  <form>
    <lion-fieldset name="fullName">
      <lion-input label="First Name" name="firstName"></lion-input>
    </lion-fieldset>
  </form>
</lion-form>
```
