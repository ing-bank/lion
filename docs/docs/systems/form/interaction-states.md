# Systems >> Form >> Interaction States ||22

```js script
import { html, render } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import '@lion/input/define';
import '@lion/input-date/define';
import { Validator, Unparseable, MinDate, Required } from '@lion/form-core';
import './assets/h-output.js';
```

`InteractionStateMixin` saves meta information about interaction states.
It allows for creating advanced UX scenarios.

Examples of such scenarios already in our fields:

- Show the validation message of an input only after the user has blurred the input field
- Hide the validation message when an invalid value becomes valid

Something our subclassers can implement:

- Show a red border around the input right after the input became invalid

The meta information that InteractionStateMixin collects, is stored in the Boolean properties on our fields:

- `touched`, the user blurred the field.
- `dirty`, the value in the field has changed.
- `prefilled`, a prepopulated field is not empty.

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
  // 1. Initialize variables
  // properties we want to check conditions for
  const props = ['touched', 'dirty', 'prefilled', 'focused', 'filled', 'submitted'];

  // 2. Create a validator
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
  // 3. Create field that applies the validator and store the node reference
  const fieldElement = renderLitAsNode(html`
    <lion-input
      name="interactionField"
      label="Only an odd amount of characters allowed"
      help-text="Change feedback condition"
      .modelValue="${'notodd'}"
      .validators="${[new OddValidator()]}"
    ></lion-input>
  `);

  // 4. When checkboxes change, set the feedbackCondition method to a new method that checks
  // whether every condition that is checked, is true on the field. Otherwise, don't show the feedback.
  const fetchConditionsAndReevaluate = ({ currentTarget: { modelValue } }) => {
    fieldElement._showFeedbackConditionFor = type => {
      return modelValue.every(condition => fieldElement[condition]);
    };
    fieldElement.validate();
  };

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

### Changing the feedback show condition (Application Developers)

In some situations, the default condition for showing feedback messages might not apply.
The conditions as described in 'When is feedback shown to the user' can be overidden via
the `feedbackCondition` method.
In this example, we want to implement the following situation:

- for an `input-date`, we have a MinDate condition
- we want to send feedback as soon as we know the user intentionally typed a full Date
  (we know if modelValue is not Unparseable)

```js preview-story
export const feedbackVisibility = () => html`
  <lion-input-date
    .validators="${[
      new Required(),
      new MinDate(new Date('2000/10/10'), {
        getMessage: () => `You provided a correctly formatted date, but it's below MinData`,
      }),
    ]}"
    .feedbackCondition="${(type, meta, originalCondition) => {
      if (meta.modelValue && !(meta.modelValue instanceof Unparseable)) {
        return true;
      }
      return originalCondition(type, meta);
    }}"
    help-text="Error appears as soon as a Parseable date before 10/10/2000 is typed"
    label="Custom feedback visibility"
  ></lion-input-date>
`;
```
