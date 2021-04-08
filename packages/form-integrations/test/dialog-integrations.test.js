import { expect, fixture, html } from '@open-wc/testing';
import { getAllTagNames } from './helpers/helpers.js';
import './helpers/umbrella-form.js';
import '@lion/dialog/define';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 * @typedef {import('@lion/dialog').LionDialog} LionDialog
 * @typedef {import('@lion/form').LionForm} LionForm
 */

// Test umbrella form inside dialog
describe('Form inside dialog Integrations', () => {
  it('Successfully registers all form components inside a dialog', async () => {
    const el = /** @type {LionDialog} */ await fixture(html` <lion-dialog>
      <button slot="invoker">Open Dialog</button>
      <umbrella-form slot="content"></umbrella-form>
    </lion-dialog>`);

    // @ts-ignore
    const formEl = /** @type {LionForm} */ (el._overlayCtrl.contentNode._lionFormNode);
    await formEl.registrationComplete;
    const registeredEls = getAllTagNames(formEl);

    expect(registeredEls).to.eql([
      // [1] In a dialog, these are registered before the rest (which is in chronological dom order)
      // Ideally, this should be the same. It would be once the platform allows to create dialogs
      // that don't need to move content to the body
      'lion-checkbox-group',
      '  lion-checkbox',
      'lion-switch',
      // [2] 'the rest' (chronologically ordered registrations)
      'lion-fieldset',
      '  lion-input',
      '  lion-input',
      'lion-input-date',
      'lion-input-datepicker',
      'lion-textarea',
      'lion-input-amount',
      'lion-input-iban',
      'lion-input-email',
      'lion-checkbox-group',
      '  lion-checkbox',
      '  lion-checkbox',
      '  lion-checkbox',
      'lion-radio-group',
      '  lion-radio',
      '  lion-radio',
      '  lion-radio',
      'lion-listbox',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      'lion-combobox',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      'lion-select-rich',
      '  lion-option',
      '  lion-option',
      '  lion-option',
      'lion-select',
      'lion-input-range',
      // [3] this is where [1] should have been inserted
      // [4] more of 'the rest' (chronologically ordered registrations)
      'lion-input-stepper',
      'lion-textarea',
    ]);
  });
});
