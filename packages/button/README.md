# Button

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-button` provides a component that is easily stylable and is accessible in all contexts.

## Features

### Disabled

You can also set a button as disabled with the `disabled` property.

## How to use

### Installation

```sh
npm i --save @lion/button
```

```js
import '@lion/button/lion-button.js';
```

### Example

```html
<lion-button>Button Text</lion-button>
```

## Considerations

### Why a Web Component?

There are multiple reasons why we used a Web Component as opposed to a CSS component.

- **Target size**: The minimum target size is 40 pixels, which makes even the small buttons easy to activate. A container element was needed to make this size possible.
- **Accessibility**: Our button is accessible because it uses the native button element. Having this native button element available in the light dom, preserves all platform accessibility features, like having it recognized by a native form.
- **Advanced styling**: There are advanced styling options regarding icons in buttons, where it is a lot more maintainable to handle icons in our button using slots. An example is that a sticky icon-only buttons may looks different from buttons which have both icons and text.

### Event target

We want to ensure that the event target returned to the user is `lion-button`, not `button`. Therefore, simply delegating the click to the native button immediately, is not desired. Instead, we catch the click event in the `lion-button`, and ensure delegation inside of there.

### Flashing a native button click as a direct child of form

By delegating the `click()` to the native button, it will bubble back up to `lion-button` which would cause duplicate actions. We have to simulate the full `.click()` however, otherwise form submission is not triggered. So this bubbling cannot be prevented.
Therefore, on click, we flash a `<button>` to the form as a direct child and fire the click on that button. We then immediately remove that button. This is a fully synchronous process; users or developers will not notice this, it should not cause problems.

### Native button & implicit form submission

Flashing the button in the way we do solves almost all issues except for one.
One of the specs of W3C is that when you have a form with multiple inputs, pressing enter while inside one of the inputs only triggers a form submit if that form has a button of type submit.

To get this particular implicit form submission to work, having a native button in our `lion-button` is a hard requirement. Therefore, not only do we flash a native button on the form to delegate `lion-button` trigger to `button` and thereby trigger form submission, we **also** add a native `button` inside the `lion-button` which `type` property is synchronized with the type of the `lion-button`.

### Preventing full page reloads

To prevent form submission full page reloads, add a **submit handler on the form** like so:

```html
<form @submit=${ev => ev.preventDefault()} >
```

Putting this on the `@click` of the `lion-button` is not enough.
