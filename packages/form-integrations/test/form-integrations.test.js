import { expect, fixture, html } from '@open-wc/testing';
import { getAllTagNames } from './helpers/helpers.js';
import './helpers/umbrella-form.js';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 */

// Test umbrella form.
describe('Form Integrations', () => {
  it('".serializedValue" returns all non disabled fields based on form structure', async () => {
    const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
    await el.updateComplete;
    const formEl = el._lionFormNode;

    expect(formEl.serializedValue).to.eql({
      full_name: { first_name: '', last_name: '' },
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
      lyrics: '1',
      range: 2.3,
      terms: [],
      notifications: { value: '', checked: false },
      rsvp: '',
      comments: '',
    });
  });

  it('".formattedValue" returns all non disabled fields based on form structure', async () => {
    const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
    await el.updateComplete;
    const formEl = el._lionFormNode;

    expect(formEl.formattedValue).to.eql({
      full_name: { first_name: '', last_name: '' },
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
      lyrics: '1',
      range: 2.3,
      terms: [],
      notifications: '',
      rsvp: '',
      comments: '',
    });
  });

  describe('Form Integrations', () => {
    it('does not become dirty when elements are prefilled', async () => {
      const el = /** @type {UmbrellaForm} */ (await fixture(
        html`<umbrella-form
          .serializedValue="${{
            full_name: { first_name: '', last_name: '' },
            date: '2000-12-12',
            datepicker: '2020-12-12',
            bio: '',
            money: '',
            iban: '',
            email: '',
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
      ));

      await el._lionFormNode.initComplete;
      expect(el._lionFormNode.dirty).to.be.false;
    });
  });

  it('Successfully registers all form components', async () => {
    const el = /** @type {UmbrellaForm} */ await fixture(html`<umbrella-form></umbrella-form>`);
    // @ts-ignore
    const formEl = /** @type {LionForm} */ (el._lionFormNode);
    await formEl.registrationComplete;
    const registeredEls = getAllTagNames(formEl);

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
