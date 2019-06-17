import { storiesOf, html } from '@open-wc/demoing-storybook';
import { Unparseable } from '@lion/validate';

import '../lion-field.js';

function newDateValid(d) {
  const result = d ? new Date(d) : new Date();
  return !isNaN(result.getTime()) ? result : null; // eslint-disable-line no-restricted-globals
}

storiesOf('Form Fundaments|Formatting and Parsing', module)
  .add(
    'model value',
    () => html`
      <lion-field
        help-text="Uses model value for data synchronisation"
        .modelValue="${'myValue'}"
        @model-value-changed="${({ target }) => {
          console.log(target);
        }}"
      >
        <input slot="input" />
      </lion-field>
    `,
  )
  .add(
    'parser',
    () => html`
      <lion-field
        label="Number Example"
        help-text="Uses .parser to create model values from view values"
        .parser="${viewValue => Number(viewValue)}"
        .modelValue="${2.22}"
      >
        <input slot="input" />
      </lion-field>
    `,
  )
  .add(
    'formatter',
    () => html`
      <lion-field
        label="Number Example"
        help-text="Uses .formatter to create view value"
        .parser="${viewValue => Number(viewValue)}"
        .formatter="${modelValue => new Intl.NumberFormat('en-GB').format(modelValue)}"
        .modelValue="${2.22}"
      >
        <input slot="input" />
      </lion-field>
    `,
  )
  .add(
    'preprocessor',
    () => html`
      <lion-field
        label="Date Example"
        help-text="Uses .preprocessor to enhance user experience"
        .parser="${viewValue => newDateValid(viewValue) || undefined}"
        .formatter="${modelValue => new Intl.DateTimeFormat('en-GB').format(modelValue)}"
        .preprocessor="${viewValue => viewValue.replace('/', '-')}"
        .modelValue="${new Date()}"
      >
        <input slot="input" />
      </lion-field>
    `,
  )
  .add(
    '(de)serializer',
    () => html`
      <lion-field
        label="Date Example"
        help-text="Uses .(de)serializer to restore serialized modelValues"
        .parser="${viewValue => newDateValid(viewValue) || undefined}"
        .formatter="${modelValue => new Intl.DateTimeFormat('en-GB').format(modelValue)}"
        .serializer="${modelValue => modelValue.toISOString().slice(0, 10)}"
        .deserializer="${serializedMv => newDateValid(serializedMv) || undefined}"
        .modelValue="${'2000-12-30'}"
      >
        <input slot="input" />
      </lion-field>
    `,
  )
  .add(
    'Unparseable',
    () => html`
      <div
        @model-value-changed="${({ target: { modelValue, errorState } }) => {
          if (modelValue instanceof Unparseable) {
            console.log(`End user attempted to create a valid entry and most likely is in
        the process of doing so. We can retrieve the intermediate state via modelValue.viewValue`);
          } else if (errorState) {
            console.log(`We know now end user entered a valid type, but some constraints
        (for instance min date) were not met`);
          } else {
            console.log(`Now we know end user entered a valid input: the field is valid
        and modelValue can be used in Application context for further processing`);
          }
        }}"
      >
        <lion-field
          label="Date Example"
          help-text="Creates modelValue of 'Unparseable' when modelValue can't be created"
          .parser="${viewValue => newDateValid(viewValue) || undefined}"
          .formatter="${modelValue => new Intl.DateTimeFormat('en-GB').format(modelValue)}"
          .deserializer="${serializedMv => newDateValid(serializedMv) || undefined}"
          .modelValue="${'2000/12f'}"
        >
          <input slot="input" />
        </lion-field>
      </div>
    `,
  )
  .add(
    'Unparseable restore',
    () => html`
      <lion-field
        label="Date Example"
        help-text="Restored 'Unparseable' state"
        .parser="${viewValue => new Date(viewValue)}"
        .formatter="${modelValue => new Intl.DateTimeFormat('en-GB').format(modelValue)}"
        .modelValue="${new Unparseable('2000/12')}"
      >
        <input slot="input" />
      </lion-field>
    `,
  );
