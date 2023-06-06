import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { getAllFieldsAndFormGroups } from './helpers/helpers.js';
import './helpers/umbrella-form.js';
/**
 * @typedef {import('../../form-core/src/LionField.js').LionField} LionField
 * @typedef {import('../../input-file/types/index.js').InputFile} InputFile
 * @typedef {import('../../button/src/LionButton.js').LionButton} LionButton
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 */

const file = /** @type {InputFile} */ (
  new File(['foo'], 'foo.txt', {
    type: 'text/plain',
  })
);

const fullyPrefilledSerializedValue = {
  fullName: { firstName: 'Lorem', lastName: 'Ipsum' },
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
  file: [],
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
  fullName: { firstName: 'LoremChanged', lastName: 'IpsumChanged' },
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
  file: [file],
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
    await el.waitForAllChildrenUpdates();

    const formEl = el._lionFormNode;

    const allElements = getAllFieldsAndFormGroups(formEl);

    allElements.forEach((/** @type {LionField} */ field) => {
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
    await el.waitForAllChildrenUpdates();

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
    await el.waitForAllChildrenUpdates();

    await el.updateComplete;
    const formEl = el._lionFormNode;

    formEl.clearGroup();
    await elementUpdated(formEl);
    await formEl.updateComplete;
    expect(formEl.serializedValue).to.eql({
      fullName: { firstName: '', lastName: '' },
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
      file: [],
      lyrics: '',
      notifications: {
        checked: false,
        value: 'Lorem',
      },
      range: '',
      rsvp: '',
      tel: '',
      'tel-dropdown': '',
      terms: [],
      comments: '',
    });
  });
});
