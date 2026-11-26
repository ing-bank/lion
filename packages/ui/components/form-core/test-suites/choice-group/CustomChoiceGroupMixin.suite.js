import { expect, fixture, fixtureSync, html, unsafeStatic } from '@open-wc/testing';
import { ChoiceInputMixin, FormGroupMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { LitElement } from 'lit';
import { CustomChoiceGroupMixin } from '../../src/choice-group/CustomChoiceGroupMixin.js';
import { resolveSuiteTag } from '../../../core/test-helpers/resolveSuiteTag.js';

/**
 *
 * @typedef {import('../../test/choice-group/CustomChoiceGroupMixin.test.js').CustomChoiceGroup} CustomChoiceGroup
 */

/**
 * Both elements are built here rather than taken from Lion, so `host` and `child` are the only roles
 * and anything the caller leaves out keeps the class this suite builds.
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement; child: SuiteElement}, {choiceType?: string}>} [customConfig]
 */
export function runCustomChoiceGroupMixinSuite({ classes = {}, choiceType = 'single' } = {}) {
  class CustomChoiceGroup extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {}
  class ChoiceInput extends ChoiceInputMixin(LionInput) {}
  const parentTagString = resolveSuiteTag(classes?.host, undefined, CustomChoiceGroup);
  const childTagString = resolveSuiteTag(classes?.child, undefined, ChoiceInput);
  const parentTag = unsafeStatic(parentTagString);
  const childTag = unsafeStatic(childTagString);

  describe(`CustomChoiceGroupMixin: ${parentTagString}`, () => {
    if (choiceType === 'single') {
      it('has a single modelValue representing a custom value', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} checked .choiceValue=${'female'}></${childTag}>
          </${parentTag}>
        `)
        );

        await el.registrationComplete;

        expect(el.modelValue).to.equal('female');
        el.modelValue = 'male';
        expect(el.modelValue).to.equal('male');

        el.modelValue = 'other';
        expect(el.modelValue).to.equal('other');

        expect(el.formElements[0].checked).to.be.false;
        expect(el.formElements[1].checked).to.be.false;
      });

      it('has a single formattedValue representing a custom value', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice name="gender">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

        el.modelValue = 'other';
        expect(el.formattedValue).to.equal('other');
      });
    }

    it('can set initial custom modelValue on creation', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} allow-custom-choice name="gender[]" .modelValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );

      if (choiceType === 'single') {
        expect(el.modelValue).to.equal('other');
      } else {
        expect(el.modelValue).to.deep.equal(['other']);
      }
      expect(el.formElements[0].checked).to.be.false;
      expect(el.formElements[1].checked).to.be.false;
    });

    it('can set initial custom serializedValue on creation', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} allow-custom-choice name="gender[]" .serializedValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );

      if (choiceType === 'single') {
        expect(el.serializedValue).to.equal('other');
      } else {
        expect(el.serializedValue).to.deep.equal(['other']);
      }
      expect(el.formElements[0].checked).to.be.false;
      expect(el.formElements[1].checked).to.be.false;
    });

    it('can set initial custom formattedValue on creation', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} allow-custom-choice name="gender[]" .formattedValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );

      if (choiceType === 'single') {
        expect(el.formattedValue).to.equal('other');
      } else {
        expect(el.formattedValue).to.deep.equal(['other']);
      }
      expect(el.formElements[0].checked).to.be.false;
      expect(el.formElements[1].checked).to.be.false;
    });

    it('correctly handles custom modelValue being set before registrationComplete', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        fixtureSync(html`
        <${parentTag} allow-custom-choice name="gender[]" .modelValue=${null}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );

      if (choiceType === 'single') {
        el.modelValue = 'other';
        await el.registrationComplete;
        expect(el.modelValue).to.equal('other');
      } else {
        el.modelValue = ['other'];
        await el.registrationComplete;
        expect(el.modelValue).to.deep.equal(['other']);
      }
    });

    it('correctly handles custom serializedValue being set before registrationComplete', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        fixtureSync(html`
        <${parentTag} allow-custom-choice name="gender[]" .serializedValue=${null}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );

      if (choiceType === 'single') {
        // @ts-expect-error
        el.serializedValue = 'other';
        await el.registrationComplete;
        expect(el.serializedValue).to.equal('other');
      } else {
        // @ts-expect-error
        el.serializedValue = ['other'];
        await el.registrationComplete;
        expect(el.serializedValue).to.deep.equal(['other']);
      }
    });

    it('can be cleared, even when a custom value is selected', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} allow-custom-choice name="gender[]">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );
      if (choiceType === 'single') {
        el.modelValue = 'other';
      } else {
        el.modelValue = ['other'];
      }

      el.clear();

      if (choiceType === 'single') {
        expect(el.serializedValue).to.deep.equal('');
      } else {
        expect(el.serializedValue).to.deep.equal([]);
      }
    });

    it('drops its custom choices when formattedValue is set to null', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} allow-custom-choice name="gender[]" .formattedValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );
      // @ts-ignore [allow-private] in test
      expect(el.customChoices).to.deep.equal(['other']);

      // @ts-ignore null is allowed to clear
      el.formattedValue = null;
      // @ts-ignore [allow-private] in test
      expect(el.customChoices).to.deep.equal([]);
      // Hosts like lion-combobox derive modelValue from their text input as well, so only the
      // group's own state is asserted here: no option stays checked.
      expect(el.formElements.filter(child => child.checked)).to.have.length(0);
    });

    it('has no custom choices when allowCustomChoice is false', async () => {
      const el = /** @type {CustomChoiceGroup} */ (
        await fixture(html`
        <${parentTag} name="gender[]">
          <${childTag} .choiceValue=${'male'} checked></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `)
      );
      // @ts-ignore [allow-private] in test
      expect(el.customChoices).to.deep.equal([]);
    });

    describe('multipleChoice', () => {
      it('has a single modelValue representing all currently checked values, including custom values', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

        expect(el.modelValue).to.eql(['female']);

        el.modelValue = ['female', 'male'];
        expect(el.modelValue).to.eql(['male', 'female']);

        el.modelValue = ['female', 'male', 'other'];
        expect(el.modelValue).to.eql(['male', 'female', 'other']);
      });

      it('has a single serializedValue representing all currently checked values, including custom values', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

        expect(el.serializedValue).to.eql(['female']);

        el.modelValue = ['female', 'male', 'other'];
        expect(el.serializedValue).to.eql(['male', 'female', 'other']);
      });

      it('has a single formattedValue representing all currently checked values', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

        expect(el.formattedValue).to.eql(['female']);

        el.modelValue = ['female', 'male', 'other'];
        expect(el.formattedValue).to.eql(['male', 'female', 'other']);
      });

      it('unchecks non-matching checkboxes when setting the modelValue', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'} checked></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

        expect(el.modelValue).to.eql(['male', 'female']);
        expect(el.formElements[0].checked).to.be.true;
        expect(el.formElements[1].checked).to.be.true;

        el.modelValue = ['other'];
        expect(el.formElements[0].checked).to.be.false;
        expect(el.formElements[1].checked).to.be.false;
      });
    });
  });
}
