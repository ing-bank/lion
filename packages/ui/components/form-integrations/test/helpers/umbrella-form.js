import { LitElement, html } from 'lit';
import { Required, MinLength } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-input-datepicker.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-input-iban.js';
import '@lion/ui/define/lion-input-email.js';
import '@lion/ui/define/lion-input-tel.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-input-range.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define/lion-input-stepper.js';

export class UmbrellaForm extends LitElement {
  get _lionFormNode() {
    return /** @type {import('../../../form/src/LionForm.js').LionForm} */ (
      this.shadowRoot?.querySelector('lion-form')
    );
  }

  /**
   * @param {string} v
   */
  set serializedValue(v) {
    this.__serializedValue = v;
  }

  /**
   * Prevents errors outside test from being thrown
   */
  async waitForAllChildrenUpdates() {
    return Promise.all(this._lionFormNode.formElements.map(child => child.updateComplete));
  }

  render() {
    return html`
      <lion-form .serializedValue="${this.__serializedValue}">
        <form>
          <lion-fieldset name="fullName">
            <lion-input
              name="firstName"
              label="First Name"
              .validators="${[new Required()]}"
            ></lion-input>
            <lion-input
              name="lastName"
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
          <lion-input-tel name="tel" label="Telephone Number"></lion-input-tel>
          <lion-input-tel-dropdown
            name="tel-dropdown"
            label="Telephone Number with dropdown list"
          ></lion-input-tel-dropdown>
          <lion-checkbox-group
            label="What do you like?"
            name="checkers"
            .validators="${[new Required()]}"
          >
            <lion-checkbox .choiceValue=${'foo'} checked label="I like foo"></lion-checkbox>
            <lion-checkbox .choiceValue=${'bar'} checked label="I like bar"></lion-checkbox>
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
          <lion-listbox name="favoriteFruit" label="Favorite fruit">
            <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
            <lion-option checked .choiceValue=${'Banana'}>Banana</lion-option>
            <lion-option .choiceValue=${'Mango'}>Mango</lion-option>
          </lion-listbox>
          <lion-combobox
            .validators="${[new Required()]}"
            name="favoriteMovie"
            label="Favorite movie"
            autocomplete="both"
          >
            <lion-option checked .choiceValue=${'Rocky'}>Rocky</lion-option>
            <lion-option .choiceValue=${'Rocky II'}>Rocky II</lion-option>
            <lion-option .choiceValue=${'Rocky III'}>Rocky III</lion-option>
            <lion-option .choiceValue=${'Rocky IV'}>Rocky IV</lion-option>
            <lion-option .choiceValue=${'Rocky V'}>Rocky V</lion-option>
            <lion-option .choiceValue=${'Rocky Balboa'}>Rocky Balboa</lion-option>
          </lion-combobox>
          <lion-select-rich name="favoriteColor" label="Favorite color">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
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
            <lion-checkbox
              .choiceValue="agreed"
              label="I blindly accept all terms and conditions"
            ></lion-checkbox>
          </lion-checkbox-group>
          <lion-switch name="notifications" label="Notifications"></lion-switch>
          <lion-input-stepper max="5" min="0" name="rsvp">
            <label slot="label">RSVP</label>
            <div slot="help-text">Max. 5 guests</div>
          </lion-input-stepper>
          <lion-textarea name="comments" label="Comments"></lion-textarea>
          <div class="buttons">
            <lion-button-submit id="submit_button" raised>Submit</lion-button-submit>
            <lion-button-reset
              id="reset_button"
              type="button"
              raised
              @click="${() => {
                this._lionFormNode.resetGroup();
              }}"
              >Reset</lion-button-reset
            >
          </div>
        </form>
      </lion-form>
    `;
  }
}
customElements.define('umbrella-form', UmbrellaForm);
