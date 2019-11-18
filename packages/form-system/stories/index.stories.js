import { storiesOf, html } from '@open-wc/demoing-storybook';

import '@lion/form/lion-form.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/textarea/lion-textarea.js';
import '@lion/input/lion-input.js';
import '@lion/checkbox/lion-checkbox.js';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/radio/lion-radio.js';
import '@lion/radio-group/lion-radio-group.js';

import '@lion/input-iban/lion-input-iban.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-email/lion-input-email.js';
import { Required, MinLength } from '@lion/validate';

storiesOf('Forms|Form', module).add(
  'Umbrella form',
  () => html`
    <lion-form
      ><form>
        <lion-input
          name="first_name"
          label="First Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <lion-input
          name="last_name"
          label="Last Name"
          .validators="${[new Required()]}"
        ></lion-input>

        <!-- TODO: lion-input-birthdate -->

        <lion-input-date
          name="date"
          label="Date of application"
          .modelValue="${'2000-12-12'}"
          .validators="${[new Required()]}"
        ></lion-input-date>

        <lion-textarea
          name="bio"
          label="Biography"
          .validators="${[new Required(), new MinLength(10)]}"
          help-text="Please enter at least 10 characters"
        ></lion-textarea>

        <lion-input-amount name="money" label="Money"></lion-input-amount>
        <lion-input-iban name="iban" label="Iban"></lion-input-iban>
        <lion-input-email name="email" label="Email"></lion-input-email>

        <lion-checkbox-group
          label="What do you like?"
          name="checkers"
          .validators="${[new Required()]}"
        >
          <lion-checkbox name="checkers[]" value="foo" label="I like foo"></lion-checkbox>
          <lion-checkbox name="checkers[]" value="bar" label="I like bar"></lion-checkbox>
          <lion-checkbox name="checkers[]" value="baz" label="I like baz"></lion-checkbox>
        </lion-checkbox-group>

        <lion-radio-group
          class="vertical"
          name="dinosaurs"
          label="Favorite dinosaur"
          .validators="${[new Required()]}"
          error-message="Dinosaurs error message"
        >
          <lion-radio name="dinosaurs[]" value="allosaurus" label="allosaurus"></lion-radio>
          <lion-radio name="dinosaurs[]" value="brontosaurus" label="brontosaurus"></lion-radio>
          <lion-radio name="dinosaurs[]" value="diplodocus" label="diplodocus"></lion-radio>
        </lion-radio-group>

        <!-- TODO: rich select -->

        <lion-select
          label="Make a selection (rich select)"
          name="lyrics"
          .validators="${[new Required()]}"
        >
          <select slot="input">
            <option value="1">Fire up that loud</option>
            <option value="2">Another round of shots...</option>
            <option value="3">Drop down for what?</option>
          </select>
        </lion-select>

        <lion-checkbox-group name="terms" .validators="${[new Required()]}">
          <lion-checkbox
            name="terms[]"
            label="I blindly accept all terms and conditions"
          ></lion-checkbox>
        </lion-checkbox-group>

        <!-- TODO: slider -->

        <lion-textarea name="comments" label="Comments"></lion-textarea>

        <div class="buttons">
          <lion-button raised>Submit</lion-button>
          <lion-button
            type="button"
            raised
            @click=${ev => ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}
            >Reset</lion-button
          >
        </div>
      </form></lion-form
    >
  `,
);
