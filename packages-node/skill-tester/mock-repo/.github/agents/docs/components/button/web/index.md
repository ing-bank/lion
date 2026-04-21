

# Button: Web

## Features

* Clickable area that is bigger than visual size
* A special `button-reset` and `button-submit` works with native form / inputs
* `button-submit` has integration for implicit form submission similar to how native `<form>`, `<input>` and `<button>` work together.

## Variants

There are three variants of the button: primary (default), secondary and tertiary. Each of the variants has three sizes: small, medium and large (default).

## Primary Button

### Purpose

```
<lion-button variation="primary-large">Primary Large</lion-button>

<lion-button variation="primary-medium">
  <lion-icon slot="icon-before" icon-id="ing:arrows:chevronLeftFilled"></lion-icon>
  Primary Medium
</lion-button>
```

## Secondary Button

### Purpose

```
<lion-button variation="secondary-large">Secondary Large</lion-button>

<lion-button variation="secondary-medium">
  <lion-icon slot="icon-before" icon-id="ing:arrows:chevronLeftFilled"></lion-icon>
  Secondary Medium
</lion-button>
```

## Tertiary buttons

### Purpose

```
<lion-button variation="tertiary-large">Tertiary Large</lion-button>

<lion-button variation="tertiary-medium">
  <lion-icon slot="icon-before" icon-id="ing:arrows:chevronLeftFilled"></lion-icon>
  Tertiary Medium
</lion-button>
```

## With click handler

```
export const handler = () => html`
  <lion-button @click="${ev => console.log('clicked/spaced/entered', ev)}">
    Click | Space | Enter me and see log
  </lion-button>
`;
```

## Disabled button

```
export const disabled = () => html`<lion-button disabled>Disabled</lion-button>`;
```

## Icon Position

Icons can be positioned in before or after the text of the button. This counts for Text, Outline, Filled and Sticky buttons. You can use the `icon-before` and `icon-after` slots to place the icon.
Common examples for buttons with icons are:

* previous/next
* download

### Guidelines

* The standard position is `after`, only make us of `before` when you have a solid use case.
* Please only use filledin icons in buttons

```
export const iconPosition = () => {
  return html`
    <style>
      ${buttonDemoStyle.cssText}
    </style>

    <div class="demo-box">
      <div class="demo-box__column">
        <lion-button variation="secondary-medium">
          <lion-icon slot="icon-before" icon-id="ing:arrows:arrowLeftFilled"></lion-icon>
          Previous
        </lion-button>
      </div>

      <div class="demo-box__column">
        <lion-button variation="secondary-medium">
          Next
          <lion-icon slot="icon-after" icon-id="ing:arrows:arrowRightFilled"></lion-icon>
        </lion-button>
      </div>
    </div>

    <div class="demo-box">
      <div class="demo-box__column">
        <lion-button variation="primary-accent-large">
          Download
          <lion-icon slot="icon-after" icon-id="ing:functionalities:downloadFilled"></lion-icon>
        </lion-button>
      </div>
    </div>
  `;
};
```

## Usage with native web form

`<lion-button>` supports the following use cases:

* Submit on button click
* Submit on button enter or space keypress
* Submit on enter keypress inside an input
* Reset native form fields when using type="reset"

```
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

    <lion-button type="submit" @click=${ev => console.log('click submit handler', ev.target)}>
      Submit
    </lion-button>
  </form>
`;
```

Important notes:

* A `<lion-button type="submit">` is mandatory for the last use case, if you have multiple inputs. This is native behaviour.
* `@click` on `<lion-button type="submit">` and `@submit` on `<form>` are triggered by these use cases. We strongly encourage you to listen to the submit handler if your goal is to do something on form-submit.
* To prevent form submission full page reloads, add a **submit handler on the form** `@submit` with `event.preventDefault()`. Adding it on the `<lion-button type="submit">` is not enough.

## Web considerations

### Why a Web Component?

There are multiple reasons why we used a Web Component as opposed to a CSS component.

* **Target size**: The minimum target size is 40 pixels, which makes even the small buttons easy to activate. A container element was needed to make this size possible.
* **Advanced styling**: There are advanced styling options regarding icons in buttons, where it is a lot more maintainable to handle icons in our button using slots. An example is that a sticky icon-only buttons may looks different from buttons which have both icons and text.
* **Native form integration**: The `<lion-button-submit>` works with native `<form>` submission, and even implicit form submission on-enter. A lot of delegation logic had to be created for this to work.

### Event target

We want to ensure that the event target returned to the user is `<lion-button>`, not `<button>`. Therefore, simply delegating the click to the native button immediately, is not desired. Instead, we catch the click event in the `<lion-button>`, and ensure delegation inside of there.

### Flashing a native button click as a direct child of form

By delegating the `click()` to the native button, it will bubble back up to `<lion-button-reset>` and `<lion-button-submit>` which would cause duplicate actions. We have to simulate the full `.click()` however, otherwise form submission is not triggered. So this bubbling cannot be prevented.
Therefore, on click, we flash a `<button>` to the form as a direct child and fire the click on that button. We then immediately remove that button. This is a fully synchronous process; users or developers will not notice this, it should not cause problems.

### Native button & implicit form submission

Flashing the button in the way we do solves almost all issues except for one.
One of the specs of W3C is that when you have a form with multiple inputs,
pressing enter while inside one of the inputs only triggers a form submit if that form has a button of type submit.

To get this particular implicit form submission to work, having a native button in our `<lion-button-submit>` is a hard requirement.
Therefore, not only do we flash a native button on the form to delegate `<lion-button-submit>` trigger to `<button>`
and thereby trigger form submission, we **also** add a native `button` inside the `<lion-button-submit>`
whose `type` property is synchronized with the type of the `<lion-button-submit>`.

## How to use

```
npm i --save @lion/ui
```

```
import { LionButton } from '@lion/ui/button.js';
```

## Api

### class: `LionButton`, `lion-button`

#### Fields

| Name | Privacy | Type | Default | Description | Inherited From |
| --- | --- | --- | --- | --- | --- |
| `active` | public | `boolean` | `false` |  | LionButton |
| `disabled` | public | `boolean` | `false` |  | DisabledMixin |
| `tabIndex` | public | `number` |  |  | DisabledWithTabIndexMixin |
| `type` | public | `string` | `'submit'` |  | LionButton |
| `validVariations` | public | `array` | `validButtonVariations` |  | LionButtonMixin |
| `variation` | public | `ValidButtonVariation` |  |  | LionButtonMixin |
| `_nativeButtonNode` | protected | `HTMLButtonElement|null` |  |  | LionButtonSubmit |
| `_requestedToBeDisabled` | protected | `boolean` | `false` |  | DisabledMixin |

#### Methods

| Name | Privacy | Description | Parameters | Return | Inherited From |
| --- | --- | --- | --- | --- | --- |
| `click` | public |  |  |  | DisabledMixin |
| `makeRequestToBeDisabled` | public |  |  |  | DisabledMixin |
| `retractRequestToBeDisabled` | public |  |  |  | DisabledMixin |
| `_afterTemplate` | protected |  |  |  |  |
| `_beforeTemplate` | protected |  |  |  |  |
| `_buttonContentTemplate` | protected |  |  |  | LionButtonMixin |
| `_setupSubmitAndResetHelperOnConnected` | protected |  |  |  | LionButtonReset |
| `_teardownSubmitAndResetHelperOnDisconnected` | protected |  |  |  | LionButtonReset |

#### Attributes

| Name | Field | Inherited From |
| --- | --- | --- |
| `variation` | variation | LionButtonMixin |
| `tabindex` | tabIndex | DisabledWithTabIndexMixin |
| `disabled` | disabled | DisabledMixin |
| `active` | active | LionButton |
| `type` | type | LionButton |

---

