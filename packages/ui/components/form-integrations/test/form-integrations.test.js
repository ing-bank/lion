import sinon from 'sinon';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import { getAllTagNames } from './helpers/helpers.js';
import './helpers/umbrella-form.js';

import '@lion/ui/define/lion-input-tel-dropdown.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio.js';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 * @typedef {import('../../input-tel-dropdown/src/LionInputTelDropdown.js').LionInputTelDropdown} LionInputTelDropdown
 */

// Test umbrella form.
describe('Form Integrations', () => {
  beforeEach(async () => {
    // Wait till PhoneUtilManager has been loaded
    await PhoneUtilManager.loadComplete;
  });

  it('".serializedValue" returns all non disabled fields based on form structure', async () => {
    const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
    await el.updateComplete;
    await el.waitForAllChildrenUpdates();
    const formEl = el._lionFormNode;

    expect(formEl.serializedValue).to.eql({
      fullName: { firstName: '', lastName: '' },
      date: '2000-12-12',
      datepicker: '2020-12-12',
      bio: '',
      money: '',
      iban: '',
      email: '',
      checkers: ['foo', 'bar'],
      dinosaurs: '',
      favoriteFruit: 'Banana',
      favoriteMovie: 'Rocky',
      favoriteColor: 'hotpink',
      file: [],
      lyrics: '1',
      range: 2.3,
      terms: [],
      notifications: { value: '', checked: false },
      rsvp: '',
      tel: '',
      'tel-dropdown': '+44',
      comments: '',
    });
  });

  it('".formattedValue" returns all non disabled fields based on form structure', async () => {
    const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
    await el.updateComplete;
    const formEl = el._lionFormNode;
    const inputTelDropdownEl = /** @type {LionInputTelDropdown} */ (
      formEl.querySelector('lion-input-tel-dropdown')
    );
    await inputTelDropdownEl?.updateComplete;

    expect(formEl.formattedValue).to.eql({
      fullName: { firstName: '', lastName: '' },
      date: '12/12/2000',
      datepicker: '12/12/2020',
      bio: '',
      money: '',
      iban: '',
      email: '',
      checkers: ['foo', 'bar'],
      dinosaurs: '',
      favoriteFruit: 'Banana',
      favoriteMovie: 'Rocky',
      favoriteColor: 'hotpink',
      file: '',
      lyrics: 'Fire up that loud',
      range: 2.3,
      terms: [],
      notifications: '',
      rsvp: '',
      tel: '',
      'tel-dropdown': '+44',
      comments: '',
    });
  });

  describe('Form Integrations', () => {
    it('does not become dirty when elements are prefilled', async () => {
      const el = /** @type {UmbrellaForm} */ (
        await fixture(
          html`<umbrella-form
            .serializedValue="${{
              fullName: { firstName: '', lastName: '' },
              date: '2000-12-12',
              datepicker: '2020-12-12',
              bio: '',
              money: '',
              iban: '',
              email: '',
              file: [],
              checkers: ['foo', 'bar'],
              dinosaurs: 'brontosaurus',
              favoriteFruit: 'Banana',
              favoriteMovie: 'Rocky',
              favoriteColor: 'hotpink',
              lyrics: '1',
              range: 2.3,
              terms: [],
              comments: '',
            }}"
          ></umbrella-form>`,
        )
      );
      await el.waitForAllChildrenUpdates();

      await el._lionFormNode.initComplete;
      expect(el._lionFormNode.dirty).to.be.false;
    });
  });

  describe('Registering', () => {
    const registerTagsResult = [
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
    ];

    it('successfully registers all form components', async () => {
      const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
      await el.waitForAllChildrenUpdates();

      const formEl = el._lionFormNode;
      await formEl.registrationComplete;
      const registeredEls = getAllTagNames(formEl);

      expect(registeredEls).to.eql(registerTagsResult);
    });

    it('successfully unregisters all form components', async () => {
      const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
      const offlineContainer = document.createElement('div');
      await el.waitForAllChildrenUpdates();

      // @ts-ignore
      const formEl = /** @type {LionForm} */ (el._lionFormNode);
      await formEl.registrationComplete;

      for (const child of formEl.formElements) {
        const spy = sinon.spy(child, '__unregisterFormElement');
        offlineContainer.appendChild(child);
        await child.updateComplete;
        expect(spy).to.have.been.called;
      }
    });
  });
});
