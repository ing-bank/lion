import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './helpers/umbrella-form.js';
import { getAllFieldsAndFormGroups } from './helpers/helpers.js';

/**
 * @typedef {import('@lion/form-core').LionField} LionField
 * @typedef {import('@lion/button').LionButton} LionButton
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 */

const fullyPrefilledSerializedValue = {
  full_name: { first_name: 'Lorem', last_name: 'Ipsum' },
  date: '2000-12-12',
  datepicker: '2020-12-12',
  bio: 'Lorem',
  money: '12313.12',
  iban: '123456',
  email: 'a@b.com',
  checkers: ['foo', 'bar'],
  dinosaurs: 'brontosaurus',
  favoriteFruit: 'Banana',
  favoriteMovie: 'Rocky',
  favoriteColor: 'hotpink',
  lyrics: '1',
  notifications: {
    checked: true,
    value: 'Lorem',
  },
  range: 2.3,
  rsvp: 'Lorem',
  terms: ['agreed'],
  comments: 'Lorem',
};

const fullyChangedSerializedValue = {
  full_name: { first_name: 'LoremChanged', last_name: 'IpsumChanged' },
  date: '1999-12-12',
  datepicker: '1986-12-12',
  bio: 'LoremChanged',
  money: '9912313.12',
  iban: '99123456',
  email: 'aChanged@b.com',
  checkers: ['foo'],
  dinosaurs: '',
  favoriteFruit: '',
  favoriteMovie: '',
  favoriteColor: '',
  lyrics: '2',
  notifications: {
    checked: false,
    value: 'Lorem',
  },
  range: 3.3,
  rsvp: 'LoremChanged',
  terms: [],
  comments: 'LoremChanged',
};

describe(`Submitting/Resetting/Clearing Form`, async () => {
  it('pressing submit button of a form should make submitted true for all fields', async () => {
    const el = /** @type {UmbrellaForm} */ (await fixture(html`<umbrella-form></umbrella-form>`));
    await el.updateComplete;
    const formEl = el._lionFormNode;

    const allElements = getAllFieldsAndFormGroups(formEl);

    allElements.forEach((/** @type {LionField} */ field) => {
      if (field.tagName === 'LION-SWITCH') {
        // TODO: remove this when this is fixed: https://github.com/ing-bank/lion/issues/1204
        return;
      }
      // TODO: prefer submitted 'false' over 'undefined'
      expect(Boolean(field.submitted)).to.be.false;
    });
    /** @type {LionButton} */ (formEl.querySelector('#submit_button')).click();
    await elementUpdated(formEl);
    await el.updateComplete;
    allElements.forEach((/** @type {LionField} */ field) => {
      expect(field.submitted).to.be.true;
    });
  });

  it('calling resetGroup() should reset all metadata (interaction states and initial values)', async () => {
    const el = /** @type {UmbrellaForm} */ (
      await fixture(
        html`<umbrella-form .serializedValue="${fullyPrefilledSerializedValue}"></umbrella-form>`,
      )
    );
    await el.updateComplete;
    const formEl = el._lionFormNode;

    /** @type {LionButton} */ (formEl.querySelector('#submit_button')).click();
    await elementUpdated(formEl);
    await formEl.updateComplete;

    const allElements = getAllFieldsAndFormGroups(formEl);

    allElements.forEach((/** @type {LionField} */ field) => {
      // eslint-disable-next-line no-param-reassign
      field.touched = true;
      // eslint-disable-next-line no-param-reassign
      field.dirty = true;
    });

    formEl.serializedValue = fullyChangedSerializedValue;

    allElements.forEach((/** @type {LionField} */ field) => {
      expect(field.submitted).to.be.true;
      expect(field.touched).to.be.true;
      expect(field.dirty).to.be.true;
    });

    /** @type {LionButton} */ (formEl.querySelector('#reset_button')).click();
    await elementUpdated(formEl);
    await formEl.updateComplete;
    expect(formEl.submitted).to.be.false;

    allElements.forEach((/** @type {LionField} */ field) => {
      expect(field.submitted).to.be.false;
      expect(field.touched).to.be.false;
      expect(field.dirty).to.be.false;
    });

    // TODO: investigate why this doesn't work
    // expect(formEl.serializedValue).to.eql(fullyPrefilledSerializedValue);
  });

  // Wait till ListboxMixin properly clears
  it('calling clearGroup() should clear all fields', async () => {
    const el = /** @type {UmbrellaForm} */ (
      await fixture(
        html`<umbrella-form .serializedValue="${fullyPrefilledSerializedValue}"></umbrella-form>`,
      )
    );
    await el.updateComplete;
    const formEl = el._lionFormNode;

    formEl.clearGroup();
    await elementUpdated(formEl);
    await formEl.updateComplete;
    expect(formEl.serializedValue).to.eql({
      full_name: { first_name: '', last_name: '' },
      date: '',
      datepicker: '',
      bio: '',
      money: '',
      iban: '',
      email: '',
      checkers: [],
      dinosaurs: '',
      favoriteFruit: '',
      favoriteMovie: '',
      favoriteColor: '',
      lyrics: '',
      notifications: {
        checked: false,
        value: 'Lorem',
      },
      range: '',
      rsvp: '',
      tel: '',
      terms: [],
      comments: '',
    });
  });
});
