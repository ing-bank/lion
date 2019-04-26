import { storiesOf, html, action } from '@open-wc/storybook';

import '../lion-form.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/input-iban/lion-input-iban.js';
import '@lion/textarea/lion-textarea.js';

import { maxLengthValidator } from '@lion/validate';

storiesOf('Forms|<lion-form>', module)
  .add(
    'Basic form result',
    () => html`
      <lion-form id="form"
        ><form>
          <lion-fieldset label="Personal data" name="personalData">
            <lion-fieldset label="Full Name" name="fullName">
              <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
              <lion-input name="lastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
            </lion-fieldset>
            <lion-fieldset label="Location" name="location">
              <lion-input name="country" label="Country" .modelValue=${'Netherlands'}></lion-input>
              <lion-input name="city" label="City" .modelValue=${'Amsterdam'}></lion-input>
            </lion-fieldset>
            <lion-input name="birthdate" label="Birthdate" .modelValue=${'23-04-1991'}></lion-input>
          </lion-fieldset>
          <lion-textarea
            name="comments"
            help-text="If none, leave empty"
            label="Comments"
          ></lion-textarea>
          <button
            @click=${() =>
              action('serializeGroup')(document.querySelector('#form').serializeGroup())}
          >
            Log to Action Logger
          </button>
        </form></lion-form
      >
    `,
  )
  .add('Form Submit/Reset', () => {
    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        action('serializeGroup')(form.serializeGroup());
      }
    };
    return html`
      <lion-form id="form" @submit="${submit}"
        ><form>
          <lion-fieldset label="Name" name="name">
            <lion-input
              name="firstName"
              label="First Name"
              .errorValidators=${['required', maxLengthValidator(15)]}
            >
            </lion-input>
            <lion-input
              name="lastName"
              label="Last Name"
              .errorValidators=${['required', maxLengthValidator(15)]}
            >
            </lion-input>
          </lion-fieldset>
          <button type="submit">Submit</button>
          <button type="button" @click=${() => document.querySelector('#form').resetGroup()}>
            Reset
          </button>
          <p>
            A reset button should never be offered to users. This button is only used here to
            demonstrate the functionality.
          </p>
        </form></lion-form
      >
    `;
  });
