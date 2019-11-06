import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-checkbox-group.js';
import '@lion/checkbox/lion-checkbox.js';
import '@lion/form/lion-form.js';
import { localize } from '@lion/localize';

storiesOf('Forms|Checkbox Group', module)
  .add(
    'Default',
    () => html`
      <lion-form>
        <form>
          <lion-checkbox-group name="scientistsGroup" label="Who are your favorite scientists?">
            <lion-checkbox
              name="scientists[]"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Francis Bacon"
              .choiceValue=${'Francis Bacon'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Marie Curie"
              .choiceValue=${'Marie Curie'}
            ></lion-checkbox>
          </lion-checkbox-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Pre Select',
    () => html`
      <lion-form>
        <form>
          <lion-checkbox-group name="scientistsGroup" label="Who are your favorite scientists?">
            <lion-checkbox
              name="scientists[]"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Francis Bacon"
              .choiceValue=${'Francis Bacon'}
              checked
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Marie Curie"
              .modelValue=${{ value: 'Marie Curie', checked: true }}
            ></lion-checkbox>
          </lion-checkbox-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-form>
        <form>
          <lion-checkbox-group
            name="scientistsGroup"
            label="Who are your favorite scientists?"
            disabled
          >
            <lion-checkbox
              name="scientists[]"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Francis Bacon"
              .choiceValue=${'Francis Bacon'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Marie Curie"
              .modelValue=${{ value: 'Marie Curie', checked: true }}
            ></lion-checkbox>
          </lion-checkbox-group>
        </form>
      </lion-form>
    `,
  )
  .add('Validation', () => {
    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        console.log(form.serializeGroup());
      }
    };
    return html`
      <lion-form id="form" @submit="${submit}"
        ><form>
          <lion-checkbox-group
            name="scientistsGroup"
            label="Who are your favorite scientists?"
            .errorValidators=${[['required']]}
          >
            <lion-checkbox
              name="scientists[]"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Francis Bacon"
              .choiceValue=${'Francis Bacon'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Marie Curie"
              .choiceValue=${'Marie Curie'}
            ></lion-checkbox>
          </lion-checkbox-group>
          <button type="submit">Submit</button>
        </form></lion-form
      >
    `;
  })
  .add('Validation 2 checked', () => {
    const hasMinTwoChecked = value => {
      const selectedValues = value['scientists[]'].filter(v => v.checked === true);
      return {
        hasMinTwoChecked: selectedValues.length >= 2,
      };
    };
    localize.locale = 'en-GB';
    try {
      localize.addData('en-GB', 'lion-validate+hasMinTwoChecked', {
        error: {
          hasMinTwoChecked: 'You need to select at least 2 values',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        console.log(form.serializeGroup());
      }
    };
    return html`
      <lion-form id="form" @submit="${submit}"
        ><form>
          <lion-checkbox-group
            name="scientistsGroup"
            label="Who are your favorite scientists?"
            help-text="You should have at least 2 of those"
            .errorValidators=${[[hasMinTwoChecked]]}
          >
            <lion-checkbox
              name="scientists[]"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Francis Bacon"
              .choiceValue=${'Francis Bacon'}
            ></lion-checkbox>
            <lion-checkbox
              name="scientists[]"
              label="Marie Curie"
              .choiceValue=${'Marie Curie'}
            ></lion-checkbox>
          </lion-checkbox-group>
          <button type="submit">Submit</button>
        </form></lion-form
      >
    `;
  });
