# Validation System

```js script
export default {
  title: 'Forms/Validation/System',
};
```

## When validation happens

Validation happens on every change of `modelValue`. A change in modelValue can be originated from
either user interaction or an imperative action from an Application Developer.
We could therefore say validation happens 'realtime'. This is aligned with the platform.

## When validation feedback will be shown

Although validation happens realtime under the hood, displaying validity feedback in realtime may
not always lead to the desired User Experience.
Together with [interaction states](?path=/docs/forms-system-interaction-states--interaction-states),
validity states can determine whether a validation message should be shown along the input field.

## Assessing field validation state programmatically

When a field has validation feedback it can be accessed using the `hasFeedbackFor` and `showsFeedbackFor` properties.
This can be used if the validity of the field is needed in code.

`hasFeedbackFor` is the state of the field regardless of whether the feedback is shown or not.
`showsFeedbackFor` represents whether or not validation feedback is being shown. This takes into account
interaction state such as a field being `touched` and `dirty`, `prefilled` or `submitted`

```js
// Field is invalid and has not interacted with
const field = document.querySelector('#my-field');
field.hasFeedbackFor.includes('error'); // returns true
field.showsFeedbackFor.includes('error'); // returns false

// Field  invalid, dirty and touched
field.hasFeedbackFor.includes('error'); // returns true
field.showsFeedbackFor.includes('error'); // returns true
```

## Validators

All validators are extensions of the `Validator` class. They should be applied to the element implementing
`ValidateMixin` as follows:

```html
<validatable-el
  .validators="${[new MyValidator({ myParam: 'foo' }), { extra: 'options' } ]]}"
></validatable-el>
```

As you can see the 'validators' property expects a map (an array of arrays).
So, every Validator is a class consisting of:

- validator function
- validator parameters (optional)
- validator config (optional)

### Validator classes

All validators extend from the default `Validator` class. Below example is an example of a validator could look like:

```js
class MyValidator extends Validator {
  execute(modelValue, param) {
    const hasFeedback = false;
    if (modelValue === param) {
      hasFeedback = true;
    }
    return hasFeedback;
  }

  static get validatorName() {
    return 'Required';
  }

  static getMessage({ fieldName }) {
    return `Please fill in ${fieldName}`;
  }
}
```

```html
<validatable-el .validators="${[new MyValidator('foo')]}"></validatable-el>
```

### Default Validators

By default, the validate system ships with the following validators:

- Required
- IsString, EqualsLength, MinLength, MaxLength, MinMaxLength, IsEmail, Pattern
- IsNumber, MinNumber, MaxNumber, MinMaxNumber
- IsDate, MinDate, MaxDate, MinMaxDate, IsDateDisabled
- DefaultSuccess

All validators return `false` if the required validity state is met.

All validators are considered self explanatory due to their explicit namings.

You can implement your own custom message for a default validator. Pass a getMessage function via the options in the construtor.

```js
function getCustomMessage(data) {
  return `${data.validatorName} is a required field`;
}
```

```html
<validatable-el
  .validators="${[new Required({}, { getMessage: getCustomMessage })]}"
></validatable-el>
```

### Custom Validators

On top of default validators, application developers can write their own by extending the `Validator` class.

### Localization

The `ValidateMixin` supports localization out of the box via the [localize system](?path=/docs/localize-intro--page).
All default validation messages are translated in the following languages (depicted by iso code):
bg, cs, de, en, es, fr, hu, it, nl, pl, ro ,ru, sk, uk and zh.

## Asynchronous validation

By default, all validations are run synchronously. However, for instance when validation can only take place on server level, asynchronous validation will be needed

You can make your async validators as follows:

```js
class AsyncValidator extends Validator {
  async execute() {
    console.log('async pending...');
    await pause(2000);
    console.log('async done...');
    return true;
  }

  static get validatorName() {
    return 'AsyncValidator';
  }

  static get async() {
    return true;
  }

  static getMessage({ modelValue }) {
    return `Validated for modelValue: ${modelValue}`;
  }
}
```

## Types of validators

The most common use case for validation is the assessment of whether the input is in error state.
An error state would be considered blocking: it prevents a form from being submitted to the server.

However, the validation system also supports three non blocking validation feedback types. Summed
up, we have the following four types:

- **error**: blocking the field from being submitted to the server. For example:
  "Please enter an amount higher than 1000,00 euro."
- **warning**: something looks wrong, but it is not blocking. For example an optional email input:
  "Please enter a valid e-mail address in the format "name@example.com"."
- **info**: shows extra information. For example a message of a scheduled payment planner:
  "Ends on 15/05/2020 after 5 payments."
- **success**: will only be triggered if there was a Message from one of the above validation types
  and is now correct. For example: "Ok, correct."

The api for warning validators and info validators are as follows:

```html
<validatable-field
  .validators="${[new WarningExample(null, { type: 'warning' }), new InfoExample(null, { type: 'info' })]}"
></validatable-field>
```

### Success validators

Success validators work a bit differently. Their success state is defined by the lack of a previously existing erroneous state (which can be an error or warning state).

So, an error validator going from invalid (true) state to invalid(false) state, will trigger the success validator.

```html
<validatable-field .validators="${[new MinLength(10), new DefaultSuccess()]}"></validatable-field>
```

<!-- TODO (nice to have)

#### Random Ok

If we take a look at the translations file belonging to `Validators`:

```js
...
  success: {
    defaultOk: 'Okay',
    randomOk: 'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Correct',
    succeeded: 'Succeeded',
    ok: 'Ok!',
    thisIsRight: 'This is right.',
    changed: 'Changed!',
    okCorrect: 'Ok, correct.',
  },
...
```

You an see that the translation message of `randomOk` references the other success translation keys. Every time the randomOkValidator is triggered, one of those messages will be randomly displayed.

## Retrieving validity states imperatively

## Difference between errorState, error, errorShow etc

## Styling hooks

## Events

-->
