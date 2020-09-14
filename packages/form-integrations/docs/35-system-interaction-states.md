[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Interaction States

```js script
import { html } from 'lit-html';
import { render } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import '@lion/input/lion-input.js';
import { Validator } from '@lion/form-core';
import '../docs/helper-wc/h-output.js';

export default {
  title: 'Forms/System/Interaction States',
};
```

`InteractionStateMixin` saves meta information about interaction states.
It allows for creating advanced UX scenarios.

Examples of such scenarios already in our fields:

- Show the validation message of an input only after the user has blurred the input field
- Hide the validation message when an invalid value becomes valid

Something our subclassers can implement:

- Show a red border around the input right after the input became invalid

The meta information that InteractionStateMixin collects, is stored in the Boolean properties on our fields:

- `touched`, the user blurred the field
- `dirty`, the value in the field has changed
- `prefilled`, a prepopulated field is not empty

> You can listen to the events `touched-changed` and `dirty-changed`.

```js preview-story
export const interactionStates = () => html`
  <lion-input
    label="Interaction States"
    help-text="Interact with this field to see how dirty, touched and prefilled change"
    .modelValue="${'myValue'}"
  ></lion-input>
  <h-output .show="${['touched', 'dirty', 'prefilled', 'focused', 'submitted']}"></h-output>
`;
```

## Advanced use cases

### Overriding interaction states

When creating an extension of LionField or LionInput, it can be needed to override the way prefilled values are 'computed'.

The example below shows how this is done for checkboxes/radio-inputs.

```js
/**
 * @override
 */
static _isPrefilled(modelValue) {
  return modelValue.checked;
}
```

## When is feedback shown to the user

We show the validity feedback when one of the following conditions is met:

- **prefilled**,
  the user already filled in something, or the value is prefilled
  when the form is initially rendered.

- **touched** && **dirty**

  - When a user starts typing for the first time in a field with for instance `required` validation,
    error message should not be shown until a field becomes `touched` (a user leaves(blurs) a field).
  - When a user enters a field without altering the value (making it `dirty` but not `touched`),
    an error message shouldn't be shown either.

- **submitted**,
  if the form is submitted, always show the error message.

### Changing the feedback show condition (Subclassers)

You can change the condition upon which feedback gets shown.

In order to override the feedback show conditions, you need to create a custom field and override `_showFeedbackConditionFor` method.
This method accepts the a `type` parameter which is a String representing the type of feedback (e.g. 'error').
Then, it returns true of false, depending on whether feedback for that type should be shown or not. That part, you can control.

In the following example we will demonstrate this with interaction states, the most common use case for feedback visibility conditions.

```js preview-story
export const feedbackCondition = () => {
  // 1. Initialize variables...
  // properties on InteractionStateMixin we want to check conditions for
  const props = ['touched', 'dirty', 'prefilled', 'focused', 'filled', 'submitted'];
  // Here we will store the conditions (trigger for validation feedback)
  // provided via the UI of the demo
  let conditions = [];
  // 2. Create a validator...
  // Define a demo validator that should only be visible on an odd amount of characters
  // const OddValidator = [modelValue => ({ odd: modelValue.length % 2 !== 0 })];
  class OddValidator extends Validator {
    static get validatorName() {
      return 'OddValidator';
    }
    // eslint-disable-next-line class-methods-use-this
    execute(value) {
      let hasError = false;
      if (!(value.length % 2 !== 0)) {
        hasError = true;
      }
      return hasError;
    }
    _getMessage() {
      return 'Add or remove one character';
    }
  }
  // 3. Create field overriding .showErrorCondition...
  // Here we will store a reference to the Field element that overrides the default condition
  // (function `showErrorCondition`) for triggering validation feedback of `.validators`
  const fieldElement = renderLitAsNode(html`
    <lion-input
      name="interactionField"
      label="Only an odd amount of characters allowed"
      help-text="Change feedback condition"
      .modelValue="${'notodd'}"
      .validators="${[new OddValidator()]}"
    >
      <input slot="input" />
    </lion-input>
  `);
  fieldElement._showFeedbackConditionFor = type => {
    return conditions.every(condition => {
      /**
       * This here shows bug for focused state.
       * Focused is set to true AFTER we already evaluate feedback conditions
       * Bug report: https://github.com/ing-bank/lion/issues/455
       */
      // setTimeout(() => console.log(fieldElement[condition])); //
      return fieldElement[condition];
    });
  };
  function fetchConditionsAndReevaluate({ currentTarget: { modelValue } }) {
    if (!modelValue['props[]']) {
      return;
    }
    // Create props list like: ['touched', 'submitted']
    conditions = modelValue['props[]'].filter(p => p.checked).map(p => p.value);
    // Reevaluate
    fieldElement.validate();
  }
  fieldElement.addEventListener('focus', () => {
    fieldElement.validate();
  });
  return html`
    <lion-form>
      <form>
        ${fieldElement}
        <button>Submit</button>
      </form>
    </lion-form>
    <h-output .field="${fieldElement}" .show="${[...props, 'hasFeedbackFor']}"> </h-output>
    <h3>Set conditions for validation feedback visibility</h3>
    <lion-checkbox-group name="props[]" @model-value-changed="${fetchConditionsAndReevaluate}">
      ${props.map(p => html` <lion-checkbox .label="${p}" .choiceValue="${p}"> </lion-checkbox> `)}
    </lion-checkbox-group>
  `;
};
```
