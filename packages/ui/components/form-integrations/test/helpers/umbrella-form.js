import '@lion/ui/define/lion-button-reset.js';
import '@lion/ui/define/lion-button-submit.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-input-datepicker.js';
import '@lion/ui/define/lion-input-email.js';
import '@lion/ui/define/lion-input-file.js';
import '@lion/ui/define/lion-input-iban.js';
import '@lion/ui/define/lion-input-range.js';
import '@lion/ui/define/lion-input-stepper.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '@lion/ui/define/lion-input-tel.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define/lion-textarea.js';
import { html, LitElement } from 'lit';

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
      <lion-listbox name="favoriteFruit" label="Favorite fruit">
        <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
        <lion-option checked .choiceValue=${'Banana'}>Banana</lion-option>
        <lion-option .choiceValue=${'Mango'}>Mango</lion-option>
      </lion-listbox>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-option .choiceValue=${'red'}>Red</lion-option>
        <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
        <lion-option .choiceValue=${'teal'}>Teal</lion-option>
      </lion-select-rich>
    `;
  }
}
customElements.define('umbrella-form', UmbrellaForm);
