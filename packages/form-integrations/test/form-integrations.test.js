import { expect, fixture, html } from '@open-wc/testing';
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
});
