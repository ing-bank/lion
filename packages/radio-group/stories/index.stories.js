/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf, html } from '@open-wc/demoing-storybook';
import { localize } from '@lion/localize';

import '@lion/radio/lion-radio.js';
import '@lion/form/lion-form.js';
import '../lion-radio-group.js';

storiesOf('Forms|Radio Group', module)
  .add(
    'Default',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?">
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
          </lion-radio-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Pre Select',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?">
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .modelValue=${{ value: 'diplodocus', checked: true }}
            ></lion-radio>
          </lion-radio-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?" disabled>
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .modelValue=${{ value: 'diplodocus', checked: true }}
            ></lion-radio>
          </lion-radio-group>
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
          <lion-radio-group
            name="dinosGroup"
            label="What are your favourite dinosaurs?"
            .errorValidators=${[['required']]}
          >
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .choiceValue="${'diplodocus'}}"
            ></lion-radio>
          </lion-radio-group>
          <button type="submit">Submit</button>
        </form></lion-form
      >
    `;
  })
  .add('Validation Item', () => {
    const isBrontosaurus = value => {
      const selectedValue = value['dinos[]'].find(v => v.checked === true);
      return {
        isBrontosaurus: selectedValue ? selectedValue.value === 'brontosaurus' : false,
      };
    };
    localize.locale = 'en-GB';
    try {
      localize.addData('en-GB', 'lion-validate+isBrontosaurus', {
        error: {
          isBrontosaurus: 'You need to select "brontosaurus"',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-radio-group
        name="dinosGroup"
        label="What are your favourite dinosaurs?"
        .errorValidators=${[['required'], [isBrontosaurus]]}
      >
        <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
        <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
      </lion-radio-group>
    `;
  });
