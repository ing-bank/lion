import { expect, fixture as _fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/radio-group/define';

/**
 * @typedef {import('../src/LionRadioGroup').LionRadioGroup} LionRadioGroup
 * @typedef {import('../src/LionRadio').LionRadio} LionRadio
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionRadioGroup>} */ (_fixture);

describe('<lion-radio-group>', () => {
  describe('resetGroup', () => {
    // TODO move to FormGroupMixin test suite and let CheckboxGroup make use of them
    it('restores to empty modelValue if changes were made', async () => {
      const el = await fixture(html`
        <lion-radio-group name="gender" label="Gender">
          <lion-radio label="Male" .choiceValue=${'male'}></lion-radio>
          <lion-radio label="Female" .choiceValue=${'female'}></lion-radio>
        </lion-radio-group>
      `);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.deep.equal('male');

      el.resetGroup();
      expect(el.modelValue).to.deep.equal('');
    });

    it('restores default values if changes were made', async () => {
      const el = await fixture(html`
        <lion-radio-group name="gender" label="Gender">
          <lion-radio label="Male" .choiceValue=${'male'}></lion-radio>
          <lion-radio label="Female" .modelValue=${{ value: 'female', checked: true }}></lion-radio>
          <lion-radio label="Other" .choiceValue=${'other'}></lion-radio>
        </lion-radio-group>
      `);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.deep.equal('male');

      el.resetGroup();
      expect(el.modelValue).to.deep.equal('female');

      el.formElements[2].checked = true;
      expect(el.modelValue).to.deep.equal('other');

      el.resetGroup();
      await el.formElements[1].updateComplete;
      await el.updateComplete;
      expect(el.modelValue).to.deep.equal('female');
    });
  });

  it('should have role = radiogroup', async () => {
    const el = await fixture(html`
      <lion-radio-group label="Gender" name="gender">
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    expect(el.getAttribute('role')).to.equal('radiogroup');
  });

  it(`becomes "touched" once a single element of the group changes`, async () => {
    const el = await fixture(html`
      <lion-radio-group name="myGroup">
        <lion-radio></lion-radio>
        <lion-radio></lion-radio>
      </lion-radio-group>
    `);

    el.formElements[1].focus();
    expect(el.touched).to.equal(false, 'initially, touched state is false');
    /** @type {LionRadio} */ (el.children[1]).checked = true;
    expect(el.touched, `focused via a mouse click, group should be touched`).to.be.true;
  });

  it('allows selection of only one radio in a named group', async () => {
    const el = await fixture(html`
      <lion-radio-group name="gender">
        <lion-radio .modelValue="${{ value: 'male', checked: false }}"></lion-radio>
        <lion-radio .modelValue="${{ value: 'female', checked: false }}"></lion-radio>
      </lion-radio-group>
    `);
    const male = el.formElements[0];
    const maleInput = male.querySelector('input');
    const female = el.formElements[1];
    const femaleInput = female.querySelector('input');

    expect(male.checked).to.equal(false);
    expect(female.checked).to.equal(false);

    maleInput.focus();
    maleInput.click();
    expect(male.checked).to.equal(true);
    expect(female.checked).to.equal(false);

    femaleInput.focus();
    femaleInput.click();
    expect(male.checked).to.equal(false);
    expect(female.checked).to.equal(true);
  });

  it('is accessible', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender">
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when the group is disabled', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender" disabled>
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when an option is disabled', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender">
        <lion-radio label="male" value="male" disabled></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await expect(el).to.be.accessible();
  });
});
