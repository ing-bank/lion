import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture } from '@open-wc/testing';
import { LionRadio, LionRadioGroup } from '@lion/ui/radio-group.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionRadioGroup>} */ _fixture;

/**
 * Runs the `lion-radio-group` behavioural suite, moved out of `test/lion-radio-group.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass your own tag names to point it at them
 * (see docs/guides/principles/test-suites.md).
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement; radio: SuiteElement}, {childTagString?: any}>} [customConfig]
 */
export function runRadioGroupSuite({
  classes: { host: hostEl = LionRadioGroup, radio: radioEl = LionRadio } = {},
  tagString: legacyTagString,
  childTagString: legacyChildTagString,
} = {}) {
  const tags = {
    host: unsafeStatic(resolveSuiteTag(hostEl, legacyTagString)),
    radio: unsafeStatic(resolveSuiteTag(radioEl, legacyChildTagString)),
  };
  describe('<lion-radio-group>', () => {
    describe('resetGroup', () => {
      // TODO move to FormGroupMixin test suite and let CheckboxGroup make use of them
      it('restores to empty modelValue if changes were made', async () => {
        const el = await fixture(html`
          <${tags.host} name="gender" label="Gender">
            <${tags.radio} label="Male" .choiceValue=${'male'}></${tags.radio}>
            <${tags.radio} label="Female" .choiceValue=${'female'}></${tags.radio}>
          </${tags.host}>
        `);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.deep.equal('male');
        el.resetGroup();
        expect(el.modelValue).to.deep.equal('');
      });
      it('restores default values if changes were made', async () => {
        const el = await fixture(html`
          <${tags.host} name="gender" label="Gender">
            <${tags.radio} label="Male" .choiceValue=${'male'}></${tags.radio}>
            <${tags.radio} label="Female" .modelValue=${{
              value: 'female',
              checked: true,
            }}></${tags.radio}>
            <${tags.radio} label="Other" .choiceValue=${'other'}></${tags.radio}>
          </${tags.host}>
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
      it('restores default values if changes were made to a group containing options with formatters', async () => {
        const formatter = /** @type {(modelValue: { value: string}) => string} */ (modelValue) =>
          modelValue.value.charAt(0);
        const el = await fixture(html`
          <${tags.host} name="gender" label="Gender">
            <${tags.radio} label="Male" .formatter=${formatter} .choiceValue=${'male'}></${tags.radio}>
            <${tags.radio}
              label="Female"
              .formatter=${formatter}
              .modelValue=${{
                value: 'female',
                checked: true,
              }}
            ></${tags.radio}>
            <${tags.radio} label="Other" .formatter=${formatter} .choiceValue=${'other'}></${tags.radio}>
          </${tags.host}>
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
        <${tags.host} label="Gender" name="gender">
          <${tags.radio} label="male" value="male"></${tags.radio}>
          <${tags.radio} label="female" value="female" checked></${tags.radio}>
        </${tags.host}>
      `);
      expect(el.getAttribute('role')).to.equal('radiogroup');
    });
    it(`becomes "touched" once a single element of the group changes`, async () => {
      const el = await fixture(html`
        <${tags.host} name="myGroup">
          <${tags.radio}></${tags.radio}>
          <${tags.radio}></${tags.radio}>
        </${tags.host}>
      `);
      el.formElements[1].focus();
      expect(el.touched).to.equal(false, 'initially, touched state is false');
      /** @type {LionRadio} */
      el.children[1].checked = true;
      expect(el.touched, `focused via a mouse click, group should be touched`).to.be.true;
    });
    it('allows selection of only one radio in a named group', async () => {
      const el = await fixture(html`
        <${tags.host} name="gender">
          <${tags.radio} .modelValue="${{
            value: 'male',
            checked: false,
          }}"></${tags.radio}>
          <${tags.radio} .modelValue="${{
            value: 'female',
            checked: false,
          }}"></${tags.radio}>
        </${tags.host}>
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
        <${tags.host} label="My group" name="gender">
          <${tags.radio} label="male" value="male"></${tags.radio}>
          <${tags.radio} label="female" value="female" checked></${tags.radio}>
        </${tags.host}>
      `);
      await expect(el).to.be.accessible();
    });
    it('is accessible when the group is disabled', async () => {
      const el = await fixture(html`
        <${tags.host} label="My group" name="gender" disabled>
          <${tags.radio} label="male" value="male"></${tags.radio}>
          <${tags.radio} label="female" value="female" checked></${tags.radio}>
        </${tags.host}>
      `);
      await expect(el).to.be.accessible();
    });
    it('is accessible when an option is disabled', async () => {
      const el = await fixture(html`
        <${tags.host} label="My group" name="gender">
          <${tags.radio} label="male" value="male" disabled></${tags.radio}>
          <${tags.radio} label="female" value="female" checked></${tags.radio}>
        </${tags.host}>
      `);
      await expect(el).to.be.accessible();
    });
  });
}
