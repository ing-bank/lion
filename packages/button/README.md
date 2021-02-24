[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Button

`lion-button` provides a button component that is easily styleable and is accessible.

```js script
import { html } from '@lion/core';

import '@lion/button/define';
import iconSvg from './docs/assets/icon.svg.js';

export default {
  title: 'Buttons/Button',
};
```

```js preview-story
export const main = () => html`<lion-button>Default</lion-button>`;
```

## Features

- Clickable area that is bigger than visual size
- Works with native form / inputs
- Has integration for implicit form submission similar to how native `<form>`, `<input>` and `<button>` work together.

## How to use

### Installation

```bash
npm i --save @lion/button
```

```js
import { LionButton } from '@lion/button';
// or
import '@lion/button/define';
```

### Example

```html
<lion-button>Button Text</lion-button>
```

## Buttons

### With click handler

```js preview-story
export const handler = () => html`
  <lion-button @click="${ev => console.log('clicked/spaced/entered', ev)}">
    Click | Space | Enter me and see log
  </lion-button>
`;
```

### Icon button

```js preview-story
export const iconButton = () => html`<lion-button>${iconSvg(html)}Bug</lion-button>`;
```

### Icon only button

```js preview-story
export const iconOnly = () => html`<lion-button aria-label="Bug">${iconSvg(html)}</lion-button>`;
```

### Disabled button

```js preview-story
export const disabled = () => html`<lion-button disabled>Disabled</lion-button>`;
```

### Multiple buttons inline

```js preview-story
export const mainAndIconButton = () => html`
  <lion-button>Default</lion-button>
  <lion-button>${iconSvg(html)} Bug</lion-button>
`;
```

### Small button (minimum click area showed)

```js preview-story
export const smallButton = () => html` <style>
    .small {
      padding: 4px;
      line-height: 1em;
    }
    .small::before {
      border: 1px dashed #000;
    }
  </style>
  <lion-button class="small">xs</lion-button>`;
```

### Usage with native form

Supports the following use cases:

- Submit on button click
- Reset native form fields when using type="reset"
- Submit on button enter or space keypress
- Submit on enter keypress inside an input

```js preview-story
export const withinForm = () => html`
  <form
    @submit=${ev => {
      ev.preventDefault();
      console.log('submit handler', ev.target);
    }}
  >
    <label for="firstNameId">First name</label>
    <input id="firstNameId" name="firstName" />
    <label for="lastNameId">Last name</label>
    <input id="lastNameId" name="lastName" />
    <lion-button @click=${ev => console.log('click handler', ev.target)}>Submit</lion-button>
  </form>
`;
```

Important notes:

- A (lion)-button of type submit is mandatory for the last use case, if you have multiple inputs. This is native behavior.
- `@click` on `<lion-button>` and `@submit` on `<form>` are triggered by these use cases. We strongly encourage you to listen to the submit handler if your goal is to do something on form-submit.
- To prevent form submission full page reloads, add a **submit handler on the form** `@submit` with `event.preventDefault()`. Adding it on the `<lion-button>` is not enough.

## Considerations

### Why a Web Component?

There are multiple reasons why we used a Web Component as opposed to a CSS component.

- **Target size**: The minimum target size is 40 pixels, which makes even the small buttons easy to activate. A container element was needed to make this size possible.
- **Advanced styling**: There are advanced styling options regarding icons in buttons, where it is a lot more maintainable to handle icons in our button using slots. An example is that a sticky icon-only buttons may looks different from buttons which have both icons and text.
- **Native form integration**: The lion button works with native `<form>` submission, and even implicit form submission on-enter. A lot of delegation logic had to be created for this to work.

### Event target

We want to ensure that the event target returned to the user is `<lion-button>`, not `button`. Therefore, simply delegating the click to the native button immediately, is not desired. Instead, we catch the click event in the `<lion-button>`, and ensure delegation inside of there.

### Flashing a native button click as a direct child of form

By delegating the `click()` to the native button, it will bubble back up to `<lion-button>` which would cause duplicate actions. We have to simulate the full `.click()` however, otherwise form submission is not triggered. So this bubbling cannot be prevented.
Therefore, on click, we flash a `<button>` to the form as a direct child and fire the click on that button. We then immediately remove that button. This is a fully synchronous process; users or developers will not notice this, it should not cause problems.

### Native button & implicit form submission

Flashing the button in the way we do solves almost all issues except for one.
One of the specs of W3C is that when you have a form with multiple inputs,
pressing enter while inside one of the inputs only triggers a form submit if that form has a button of type submit.

To get this particular implicit form submission to work, having a native button in our `<lion-button>` is a hard requirement.
Therefore, not only do we flash a native button on the form to delegate `<lion-button>` trigger to `<button>`
and thereby trigger form submission, we **also** add a native `button` inside the `<lion-button>`
whose `type` property is synchronized with the type of the `<lion-button>`.
