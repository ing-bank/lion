import { expect, fixture, html } from '@open-wc/testing';
import './helpers/umbrella-form.js';
import '@lion/dialog/define';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 * @typedef {import('@lion/dialog').LionDialog} LionDialog
 * @typedef {import('@lion/form').LionForm} LionForm
 */

// Test umbrella form inside dialog
describe('Form inside dialog Integrations', () => {
  it('"Successfully registers all form components inside a dialog', async () => {
    const el = /** @type {LionDialog} */ await fixture(html` <lion-dialog>
      <button slot="invoker">Open Dialog</button>
      <umbrella-form slot="content"></umbrella-form>
    </lion-dialog>`);

    // @ts-ignore
    const formEl = /** @type {LionForm} */ (el._overlayCtrl.contentNode._lionFormNode);
    const getTagNames = (/** @type {HTMLElement} */ elm) => [
      elm.tagName.toLowerCase(),
      // @ts-ignore
      ...(elm.formElements ? elm.formElements.map(getTagNames).flat() : []),
    ];

    // @ts-ignore
    const registeredEls = formEl.formElements.map(getTagNames).flat();

    // TODO: fix registration of lion-switch and lion-input-stepper
    expect(registeredEls).to.eql([
      'lion-fieldset',
      'lion-input',
      'lion-input',

      'lion-input-date',

      'lion-input-datepicker',

      'lion-textarea',

      'lion-input-amount',

      'lion-input-iban',

      'lion-input-email',

      'lion-checkbox-group',
      'lion-checkbox',
      'lion-checkbox',
      'lion-checkbox',

      'lion-radio-group',
      'lion-radio',
      'lion-radio',
      'lion-radio',

      'lion-listbox',
      'lion-option',
      'lion-option',
      'lion-option',

      'lion-combobox',
      'lion-option',
      'lion-option',
      'lion-option',
      'lion-option',
      'lion-option',
      'lion-option',

      'lion-select-rich',
      'lion-option',
      'lion-option',
      'lion-option',
      'lion-select',

      'lion-input-range',

      'lion-checkbox-group',
      'lion-checkbox',
      // 'lion-switch',
      // 'lion-input-stepper',
      'lion-textarea',
    ]);
  });
});
