import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-checkbox-group.js';
import '@lion/checkbox/lion-checkbox.js';
import { Required, Validator } from '@lion/validate';

storiesOf('Forms|Checkbox Group', module)
  .add(
    'Default',
    () => html`
      <lion-checkbox-group name="scientistsGroup" label="Favorite scientists">
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
    `,
  )
  .add(
    'Pre Select',
    () => html`
      <lion-checkbox-group name="scientistsGroup" label="Favorite scientists">
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
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-checkbox-group name="scientistsGroup" label="Favorite scientists" disabled>
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
    `,
  )
  .add('Validation', () => {
    const validate = () => {
      const checkboxGroup = document.querySelector('#scientistsGroup');
      checkboxGroup.submitted = !checkboxGroup.submitted;
    };
    return html`
      <lion-checkbox-group
        id="scientistsGroup"
        name="scientistsGroup"
        label="Favorite scientists"
        .validators=${[new Required()]}
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
      <button @click="${() => validate()}">Validate</button>
    `;
  })
  .add('Validation 2 checked', () => {
    class HasMinTwoChecked extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'HasMinTwoChecked';
      }

      execute(value) {
        console.log('execute');
        let hasError = false;
        const selectedValues = value['scientists[]'].filter(v => v.checked === true);
        if (!(selectedValues.length >= 2)) {
          hasError = true;
        }
        return hasError;
      }

      static async getMessage() {
        return 'You need to select at least 2 values.';
      }
    }

    const validate = () => {
      const checkboxGroup = document.querySelector('#scientistsGroup');
      checkboxGroup.submitted = !checkboxGroup.submitted;
    };
    return html`
      <lion-checkbox-group
        id="scientistsGroup"
        name="scientistsGroup"
        label="Favorite scientists"
        help-text="You should have at least 2 of those"
        .validators=${[new Required(), new HasMinTwoChecked()]}
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
      <button @click="${() => validate()}">Validate</button>
    `;
  });
