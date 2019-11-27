import { expect, html, fixture, nextFrame } from '@open-wc/testing';

import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { Required } from '@lion/validate';

import '@lion/checkbox/lion-checkbox.js';
import '../lion-checkbox-group.js';

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-checkbox-group>', () => {
  it('can be required', async () => {
    const el = await fixture(html`
      <lion-checkbox-group .validators=${[new Required()]}>
        <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
        <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
      </lion-checkbox-group>
    `);
    await nextFrame();

    expect(el.hasFeedbackFor).to.deep.equal(['error']);
    expect(el.validationStates.error.Required).to.be.true;
    el.formElements['sports[]'][0].checked = true;
    expect(el.hasFeedbackFor).to.deep.equal([]);
  });

  describe('serializedValue', async () => {
    it('reflects the current checked state', async () => {
      const el = await fixture(html`
        <lion-checkbox-group>
          <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
          <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
        </lion-checkbox-group>
      `);
      await el.registrationReady;

      el.modelValue = {
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: true }],
      };
      expect(el.serializedValue).to.eql(['running', 'swimming']);

      el.modelValue = {
        'sports[]': [{ value: 'running', checked: false }, { value: 'swimming', checked: false }],
      };
      expect(el.serializedValue).to.eql([]);
    });

    it('can bet set programmatically', async () => {
      const el = await fixture(html`
        <lion-checkbox-group>
          <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
          <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
        </lion-checkbox-group>
      `);
      await el.registrationReady;

      el.serializedValue = ['running'];
      expect(el.modelValue).to.eql({
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: false }],
      });

      el.serializedValue = ['running', 'swimming'];
      expect(el.modelValue).to.eql({
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: true }],
      });
    });
  });

  describe('checkedValue', async () => {
    it('reflects the current checked state', async () => {
      const el = await fixture(html`
        <lion-checkbox-group>
          <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
          <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
        </lion-checkbox-group>
      `);
      await el.registrationReady;

      el.modelValue = {
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: true }],
      };
      expect(el.checkedValue).to.eql(['running', 'swimming']);

      el.modelValue = {
        'sports[]': [{ value: 'running', checked: false }, { value: 'swimming', checked: false }],
      };
      expect(el.checkedValue).to.eql([]);
    });

    it('can bet set programmatically', async () => {
      const el = await fixture(html`
        <lion-checkbox-group>
          <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
          <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
        </lion-checkbox-group>
      `);
      await el.registrationReady;

      el.checkedValue = ['running'];
      expect(el.modelValue).to.eql({
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: false }],
      });

      el.checkedValue = ['running', 'swimming'];
      expect(el.modelValue).to.eql({
        'sports[]': [{ value: 'running', checked: true }, { value: 'swimming', checked: true }],
      });
    });
  });
});
