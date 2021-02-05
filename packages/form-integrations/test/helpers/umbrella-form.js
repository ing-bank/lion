import { LitElement, html } from '@lion/core';
import { Required, MinLength } from '@lion/form-core';
import '@lion/form/lion-form';
import '@lion/fieldset/lion-fieldset';
import '@lion/input/lion-input';
import '@lion/input-date/lion-input-date';
import '@lion/input-datepicker/lion-input-datepicker';
import '@lion/input-amount/lion-input-amount';
import '@lion/input-iban/lion-input-iban';
import '@lion/input-email/lion-input-email';
import '@lion/checkbox-group/lion-checkbox-group';
import '@lion/checkbox-group/lion-checkbox';
import '@lion/radio-group/lion-radio-group';
import '@lion/radio-group/lion-radio';
import '@lion/select/lion-select';
import '@lion/select-rich/lion-select-rich';
import '@lion/select-rich/lion-options';
import '@lion/select-rich/lion-option';
import '@lion/input-range/lion-input-range';
import '@lion/textarea/lion-textarea';
import '@lion/button/lion-button';

export class UmbrellaForm extends LitElement {
  get _lionFormNode() {
    return /** @type {import('@lion/form').LionForm} */ (this.shadowRoot?.querySelector(
      'lion-form',
    ));
  }

  render() {
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
            .modelValue="${new Date('2000/12/12')}"
            .validators="${[new Required()]}"
          ></lion-input-date>
          <lion-input-datepicker
            name="datepicker"
            label="Date to be picked"
            .modelValue="${new Date('2020/12/12')}"
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
            <lion-radio .choiceValue=${'brontosaurus'} checked label="brontosaurus"></lion-radio>
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
          >
          </lion-input-range>
          <lion-checkbox-group name="terms" .validators="${[new Required()]}">
            <lion-checkbox label="I blindly accept all terms and conditions"></lion-checkbox>
          </lion-checkbox-group>
          <lion-textarea name="comments" label="Comments"></lion-textarea>
          <div class="buttons">
            <lion-button raised>Submit</lion-button>
            <lion-button
              type="button"
              raised
              @click=${() => {
                const lionForm = this._lionFormNode;
                lionForm.resetGroup();
              }}
              >Reset</lion-button
            >
          </div>
        </form>
      </lion-form>
    `;
  }
}
customElements.define('umbrella-form', UmbrellaForm);
