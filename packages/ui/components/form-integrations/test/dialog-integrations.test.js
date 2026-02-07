/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture } from '@open-wc/testing';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-radio.js';
import { html } from 'lit';
import { getAllTagNames } from './helpers/helpers.js';
import './helpers/umbrella-form.js';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 * @typedef {import('../../dialog/src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('../../form/src/LionForm.js').LionForm} LionForm
 */

// Test umbrella form inside dialog
describe('Form inside dialog Integrations', () => {
  it('Successfully registers all form components inside a dialog', async () => {
    const el = /** @type {LionDialog} */ await fixture(
      html` <lion-dialog>
        <button slot="invoker">Open Dialog</button>
        <umbrella-form slot="content"></umbrella-form>
      </lion-dialog>`,
    );

    // @ts-expect-error [allow-protected-in-tests]
    const umbrellaEl = el._overlayCtrl.contentNode;
    const formEl = /** @type {LionForm} */ (umbrellaEl._lionFormNode);
    await formEl.registrationComplete;
    const registeredEls = getAllTagNames(formEl);
    await umbrellaEl.waitForAllChildrenUpdates();

    expect(registeredEls).to.eql([
      'lion-fieldset',
      '  lion-input',
      '  lion-input',
      'lion-input-date',
      'lion-input-datepicker',
      'lion-textarea',
      'lion-input-amount',
      'lion-input-iban',
      'lion-input-email',
      'lion-input-file',
      'lion-input-tel',
      'lion-input-tel-dropdown',
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
      'lion-checkbox-group',
      '  lion-checkbox',
      'lion-switch',
      'lion-input-stepper',
      'lion-textarea',
    ]);
  });
});
