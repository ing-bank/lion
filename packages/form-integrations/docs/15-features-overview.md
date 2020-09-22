[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Features Overview

This is a meta package to show interaction between various form elements.
For usage and installation please see the appropriate packages.

```js script
import { html } from 'lit-html';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/form/lion-form.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-datepicker/lion-input-datepicker.js';
import '@lion/input-email/lion-input-email.js';
import '@lion/input-iban/lion-input-iban.js';
import '@lion/input-range/lion-input-range.js';
import '@lion/input-stepper/lion-input-stepper.js';
import '@lion/input/lion-input.js';
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
import '@lion/select/lion-select.js';
import '@lion/select-rich/lion-option.js';
import '@lion/select-rich/lion-options.js';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/textarea/lion-textarea.js';
import { MinLength, Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

export default {
  title: 'Forms/Features Overview',
};
```

## Umbrella Form

```js story
export const main = () => {
  loadDefaultFeedbackMessages();
  Required.getMessage = () => 'Please enter a value';
  return html`
    <lion-form>
      <form>
        <lion-fieldset name="full_name">
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
        </lion-fieldset>
        <lion-input-date
          name="date"
          label="Date of application"
          .modelValue="${new Date('2000-12-12')}"
          .validators="${[new Required()]}"
        ></lion-input-date>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .modelValue="${new Date('2020-12-12')}"
          .validators="${[new Required()]}"
        ></lion-input-datepicker>
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
          <lion-checkbox .choiceValue=${'foo'} label="I like foo"></lion-checkbox>
          <lion-checkbox .choiceValue=${'bar'} label="I like bar"></lion-checkbox>
          <lion-checkbox .choiceValue=${'baz'} label="I like baz"></lion-checkbox>
        </lion-checkbox-group>
        <lion-radio-group
          name="dinosaurs"
          label="Favorite dinosaur"
          .validators="${[new Required()]}"
        >
          <lion-radio .choiceValue=${'allosaurus'} label="allosaurus"></lion-radio>
          <lion-radio .choiceValue=${'brontosaurus'} label="brontosaurus"></lion-radio>
          <lion-radio .choiceValue=${'diplodocus'} label="diplodocus"></lion-radio>
        </lion-radio-group>
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
        <lion-select label="Lyrics" name="lyrics" .validators="${[new Required()]}">
          <select slot="input">
            <option value="1">Fire up that loud</option>
            <option value="2">Another round of shots...</option>
            <option value="3">Drop down for what?</option>
          </select>
        </lion-select>
        <lion-input-range
          name="range"
          min="1"
          max="5"
          .modelValue="${2.3}"
          unit="%"
          step="0.1"
          label="Input range"
        ></lion-input-range>
        <lion-checkbox-group
          .mulipleChoice="${false}"
          name="terms"
          .validators="${[new Required()]}"
        >
          <lion-checkbox label="I blindly accept all terms and conditions"></lion-checkbox>
        </lion-checkbox-group>
        <lion-input-stepper max="5" min="0" name="rsvp">
          <label slot="label">RSVP</label>
          <div slot="help-text">
            Max. 5 guests
          </div>
        </lion-input-stepper>
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
      </form>
    </lion-form>
  `;
};
```
