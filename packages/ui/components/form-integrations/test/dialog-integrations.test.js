/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture } from '@open-wc/testing';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-radio.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';

import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
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

  it('sets focus on first focusable element with autofocus', async () => {
    const el = /** @type {LionDialog} */ await fixture(html`
      <lion-dialog>
        <button slot="invoker">invoker button</button>
        <div slot="content">
          <lion-input label="label" name="input" autofocus></lion-input>
          <lion-textarea label="label" name="textarea" autofocus></lion-textarea>
        </div>
      </lion-dialog>
    `);

    // @ts-expect-error [allow-protected-in-tests]
    el._overlayInvokerNode.click();
    const lionInput = el.querySelector('[name="input"]');
    // @ts-expect-error [allow-protected-in-tests]
    expect(isActiveElement(lionInput._focusableNode)).to.be.true;
  });

  // #2555, the test is the one from #2556
  it('does not reopen when a form submit closes it and a lion-button is the invoker', async () => {
    const el = /** @type {LionDialog} */ (
      await fixture(html`
        <lion-dialog opened>
          <div slot="content">
            <lion-form @submit="${() => el.close()}">
              <form @submit="${(/** @type {Event} */ e) => e.preventDefault()}">
                <input type="text" name="name" />
                <button type="submit">Submit</button>
              </form>
            </lion-form>
          </div>
          <lion-button slot="invoker">Invoker</lion-button>
        </lion-dialog>
      `)
    );
    // @ts-expect-error [allow-protected-in-tests]
    const dialogEl = /** @type {HTMLDialogElement} */ (el._overlayCtrl.__wrappingDialogNode);
    expect(dialogEl.checkVisibility()).to.be.true;

    /** @type {HTMLInputElement} */ (el.querySelector('input[type="text"]')).focus();
    await sendKeys({ press: 'Enter' });
    await el.updateComplete;
    await el.updateComplete;

    expect(dialogEl.checkVisibility()).to.be.false;
  });
});
