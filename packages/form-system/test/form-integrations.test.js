import { expect, fixture, html } from '@open-wc/testing';
import './helpers/umbrella-form.js';

// Test umbrella form
describe('Form Integrations', () => {
  it('".serializedValue" returns all non disabled fields based on form structure', async () => {
    const el = await fixture(
      html`
        <umbrella-form></umbrella-form>
      `,
    );
    const formEl = el._lionFormNode;
    expect(formEl.serializedValue).to.eql({
      bio: '',
      'checkers[]': [[]],
      comments: '',
      date: '2000-12-12',
      datepicker: '2020-12-12',
      dinosaurs: '',
      email: '',
      favoriteColor: 'hotpink',
      full_name: {
        first_name: '',
        last_name: '',
      },
      iban: '',
      lyrics: '1',
      money: '',
      range: 2.3,
      terms: [],
    });
  });
});
