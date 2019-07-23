# Button

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-button` provides a component that is easily stylable and is accessible in all contexts.

## Features

### Disabled
You can also set a button as disabled with the `disabled` property.

## How to use

### Installation
```
npm i --save @lion/button
```

```js
import '@lion/button/lion-button.js';
```

### Example

```html
<lion-button>Button Text</lion-button>
```

- Don't use a button when you want a user to navigate. Use a link instead.
- Not all color and font size combinations are available because some do not meet accessibility contrast requirements

## Considerations

### Why a webcomponent?

There are multiple reasons why we used a web component as opposed to a CSS component.

- **Target size**: The minimum target size is 40 pixels, which makes even the small buttons easy to activate. A container element was needed to make this size possible.
- **Accessibility**: Our button is accessible because it uses the native button element. Having this native button element available in the light dom, preserves all platform accessibility features, like having it recognized by a native form.
- **Advanced styling**: There are advanced styling options regarding icons in buttons, where it is a lot more maintainable to handle icons in our button using slots. An example is that a sticky icon-only buttons may looks different from buttons which have both icons and text.
