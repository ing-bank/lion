/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf, html } from '@open-wc/demoing-storybook';

import '@lion/radio/lion-radio.js';
import '../lion-radio-group.js';
import { Required, Validator, loadDefaultFeedbackMessages } from '@lion/validate';

loadDefaultFeedbackMessages();

storiesOf('Forms|Radio Group', module)
  .add(
    'Default',
    () => html`
      <lion-radio-group name="dinosGroup" label="Favourite dinosaur">
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
      </lion-radio-group>
    `,
  )
  .add(
    'Pre Select',
    () => html`
      <lion-radio-group name="dinosGroup" label="Favourite dinosaur">
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio
          name="dinos[]"
          label="diplodocus"
          .modelValue=${{ value: 'diplodocus', checked: true }}
        ></lion-radio>
      </lion-radio-group>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-radio-group name="dinosGroup" label="Favourite dinosaur" disabled>
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio
          name="dinos[]"
          label="diplodocus"
          .modelValue=${{ value: 'diplodocus', checked: true }}
        ></lion-radio>
      </lion-radio-group>
    `,
  )
  .add('Validation', () => {
    const validate = () => {
      const radioGroup = document.querySelector('#dinosGroup');
      radioGroup.submitted = !radioGroup.submitted;
    };
    return html`
      <lion-radio-group
        id="dinosGroup"
        name="dinosGroup"
        label="Favourite dinosaur"
        .validators=${[new Required()]}
      >
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
      </lion-radio-group>
      <button @click="${() => validate()}">Validate</button>
    `;
  })
  .add('Validation Item', () => {
    class IsBrontosaurus extends Validator {
      constructor() {
        super();
        this.name = 'IsBrontosaurus';
      }

      execute(value) {
        const selectedValue = value['dinos[]'].find(v => v.checked === true);
        const hasError = selectedValue ? selectedValue.value !== 'brontosaurus' : false;
        return hasError;
      }

      static async getMessage() {
        return 'You need to select "brontosaurus"';
      }
    }

    const validate = () => {
      const radioGroup = document.querySelector('#dinosGroup');
      radioGroup.submitted = !radioGroup.submitted;
    };

    return html`
      <lion-radio-group
        id="dinosGroup"
        name="dinosGroup"
        label="Favourite dinosaur"
        .validators=${[new Required(), new IsBrontosaurus()]}
      >
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
      </lion-radio-group>
      <button @click="${() => validate()}">Validate</button>
    `;
  });
