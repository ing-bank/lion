import { storiesOf, html, action } from '@open-wc/storybook';

import '../lion-radio-group.js';
import '@lion/radio/lion-radio.js';
import '@lion/form/lion-form.js';

storiesOf('Forms|<lion-radio-group>', module)
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
        action('serializeGroup')(form.serializeGroup());
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
  });
