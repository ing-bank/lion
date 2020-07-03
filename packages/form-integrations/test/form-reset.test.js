import '@lion/button/lion-button';
import '@lion/checkbox-group/lion-checkbox';
import '@lion/checkbox-group/lion-checkbox-group';
import { MinLength, Required } from '@lion/form-core';
import '@lion/form/lion-form';
import '@lion/input-amount/lion-input-amount';
import '@lion/input-date/lion-input-date';
import '@lion/input-datepicker/lion-input-datepicker';
import '@lion/input-email/lion-input-email';
import '@lion/input-iban/lion-input-iban';
import '@lion/input-range/lion-input-range';
import '@lion/input/lion-input';
import '@lion/radio-group/lion-radio';
import '@lion/radio-group/lion-radio-group';
import '@lion/select/lion-select';
import '@lion/switch/lion-switch';
import '@lion/textarea/lion-textarea';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

describe(`Submitting/Resetting Form`, async () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`
      <lion-form id="form_test" responsive>
        <form>
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
          <lion-input-date
            name="start-date"
            label="Start date"
            .validators="${[new Required()]}"
          ></lion-input-date>
          <lion-input-datepicker
            name="end-date"
            label="End date"
            .validators="${[new Required()]}"
          ></lion-input-datepicker>
          <lion-textarea
            name="bio"
            label="Biography"
            .validators="${[new Required(), new MinLength(10)]}"
            help-text="Please enter at least 10 characters"
          ></lion-textarea>
          <lion-input-amount
            .validators="${[new Required()]}"
            name="money"
            label="Money"
          ></lion-input-amount>
          <lion-input-iban
            .validators="${[new Required()]}"
            name="iban"
            label="Iban"
          ></lion-input-iban>
          <lion-input-email
            .validators="${[new Required()]}"
            name="email"
            label="Email"
          ></lion-input-email>
          <lion-checkbox-group
            label="What do you like?"
            name="checkers[]"
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
          <lion-select label="Lyrics" name="lyrics" .validators="${[new Required()]}">
            <select slot="input">
              <option value="1">Fire up that loud</option>
              <option value="2">Another round of shots...</option>
              <option value="3">Drop down for what?</option>
            </select>
          </lion-select>
          <lion-input-range
            .validators="${[new Required()]}"
            name="range"
            min="1"
            max="5"
            unit="%"
            step="0.1"
            label="Input range"
          ></lion-input-range>
          <lion-checkbox-group
            name="terms[]"
            .validators="${[
              new Required(null, { getMessage: () => 'You are not allowed to read them' }),
            ]}"
          >
            <lion-checkbox label="I blindly accept all terms and conditions"></lion-checkbox>
          </lion-checkbox-group>
          <lion-textarea
            .validators="${[new Required()]}"
            name="comments"
            label="Comments"
          ></lion-textarea>
          <div class="buttons">
            <lion-button id="submit_button" type="submit" raised>Submit</lion-button>
            <lion-button id="reset_button" type="reset" raised>
              Reset
            </lion-button>
          </div>
        </form>
      </lion-form>
    `);
  });

  it('Submitting a form should make submitted true for all fields', async () => {
    el.querySelector('#submit_button').click();
    await elementUpdated(el);
    el.formElements.forEach(field => {
      expect(field.submitted).to.be.true;
    });
  });

  it('Resetting a form should reset metadata of all fields', async () => {
    el.querySelector('#submit_button').click();
    el.querySelector('#reset_button').click();
    await elementUpdated(el);
    expect(el.submitted).to.be.false;
    el.formElements.forEach(field => {
      expect(field.submitted).to.be.false;
      expect(field.touched).to.be.false;
      expect(field.dirty).to.be.false;
    });
  });
});
