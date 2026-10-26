import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, fixture as _fixture } from '@open-wc/testing';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionRadioGroup.js').LionRadioGroup} LionRadioGroup
 * @typedef {import('../src/LionRadio.js').LionRadio} LionRadio
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionRadioGroup>} */ (_fixture);

/**
 * Runs the `lion-radio-group` behavioural suite, moved out of `test/lion-radio-group.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass your own tag names to point it at them
 * (see docs/guides/principles/test-suites.md).
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {{ classes?: Record<string, CustomElementConstructor>, tagString?: string, childTagString?: string }} [customConfig]
 */
export function runRadioGroupSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-radio-group',
    childTagString: 'lion-radio',
    ...customConfig,
  };
  cfg.tagString = resolveSuiteTag(cfg.classes.host, cfg.tagString, 'lion-radio-group');
  const tag = unsafeStatic(cfg.tagString);
  const childTag = unsafeStatic(
    resolveSuiteTag(cfg.classes.radio, cfg.childTagString, 'lion-radio'),
  );

  describe('<lion-radio-group>', () => {
    describe('resetGroup', () => {
      // TODO move to FormGroupMixin test suite and let CheckboxGroup make use of them
      it('restores to empty modelValue if changes were made', async () => {
        const el = await fixture(html`
          <${tag} name="gender" label="Gender">
            <${childTag} label="Male" .choiceValue=${'male'}></${childTag}>
            <${childTag} label="Female" .choiceValue=${'female'}></${childTag}>
          </${tag}>
        `);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.deep.equal('male');

        el.resetGroup();
        expect(el.modelValue).to.deep.equal('');
      });

      it('restores default values if changes were made', async () => {
        const el = await fixture(html`
          <${tag} name="gender" label="Gender">
            <${childTag} label="Male" .choiceValue=${'male'}></${childTag}>
            <${childTag} label="Female" .modelValue=${{ value: 'female', checked: true }}></${childTag}>
            <${childTag} label="Other" .choiceValue=${'other'}></${childTag}>
          </${tag}>
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
        const formatter = /** @type {(modelValue: { value: string}) => string} */ modelValue =>
          modelValue.value.charAt(0);
        const el = await fixture(html`
          <${tag} name="gender" label="Gender">
            <${childTag} label="Male" .formatter=${formatter} .choiceValue=${'male'}></${childTag}>
            <${childTag}
              label="Female"
              .formatter=${formatter}
              .modelValue=${{ value: 'female', checked: true }}
            ></${childTag}>
            <${childTag} label="Other" .formatter=${formatter} .choiceValue=${'other'}></${childTag}>
          </${tag}>
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
        <${tag} label="Gender" name="gender">
          <${childTag} label="male" value="male"></${childTag}>
          <${childTag} label="female" value="female" checked></${childTag}>
        </${tag}>
      `);
      expect(el.getAttribute('role')).to.equal('radiogroup');
    });

    it(`becomes "touched" once a single element of the group changes`, async () => {
      const el = await fixture(html`
        <${tag} name="myGroup">
          <${childTag}></${childTag}>
          <${childTag}></${childTag}>
        </${tag}>
      `);

      el.formElements[1].focus();
      expect(el.touched).to.equal(false, 'initially, touched state is false');
      /** @type {LionRadio} */ (el.children[1]).checked = true;
      expect(el.touched, `focused via a mouse click, group should be touched`).to.be.true;
    });

    it('allows selection of only one radio in a named group', async () => {
      const el = await fixture(html`
        <${tag} name="gender">
          <${childTag} .modelValue="${{ value: 'male', checked: false }}"></${childTag}>
          <${childTag} .modelValue="${{ value: 'female', checked: false }}"></${childTag}>
        </${tag}>
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
        <${tag} label="My group" name="gender">
          <${childTag} label="male" value="male"></${childTag}>
          <${childTag} label="female" value="female" checked></${childTag}>
        </${tag}>
      `);
      await expect(el).to.be.accessible();
    });

    it('is accessible when the group is disabled', async () => {
      const el = await fixture(html`
        <${tag} label="My group" name="gender" disabled>
          <${childTag} label="male" value="male"></${childTag}>
          <${childTag} label="female" value="female" checked></${childTag}>
        </${tag}>
      `);
      await expect(el).to.be.accessible();
    });

    it('is accessible when an option is disabled', async () => {
      const el = await fixture(html`
        <${tag} label="My group" name="gender">
          <${childTag} label="male" value="male" disabled></${childTag}>
          <${childTag} label="female" value="female" checked></${childTag}>
        </${tag}>
      `);
      await expect(el).to.be.accessible();
    });
  });
}
