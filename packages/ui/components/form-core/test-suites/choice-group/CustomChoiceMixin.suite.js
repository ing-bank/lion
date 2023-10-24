import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { LitElement } from 'lit';
import {
  ChoiceInputMixin,
  CustomChoiceGroupMixin,
  FormGroupMixin,
  ChoiceGroupMixin,
} from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { expect, fixture, fixtureSync, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

class CustomChoiceGroup extends CustomChoiceGroupMixin(
  ChoiceGroupMixin(FormGroupMixin(LitElement)),
) {}
customElements.define('custom-choice-input-group', CustomChoiceGroup);

class ChoiceInput extends ChoiceInputMixin(LionInput) {}
customElements.define('custom-choice-input', ChoiceInput);

/**
 * @param {{ parentTagString?:string, childTagString?: string, choiceType?: string}} config
 */
export function runCustomChoiceGroupMixinSuite({
  parentTagString,
  childTagString,
  choiceType,
} = {}) {
  const cfg = {
    parentTagString: parentTagString || 'custom-choice-input-group',
    childTagString: childTagString || 'choice-input',
    choiceType: choiceType || 'single',
  };

  const parentTag = unsafeStatic(cfg.parentTagString);
  const childTag = unsafeStatic(cfg.childTagString);

  describe(`ChoiceGroupMixin: ${cfg.parentTagString}`, () => {
    if (cfg.choiceType === 'single') {
      it('has a single modelValue representing a custom value', async () => {
        const el = /** @type {CustomChoiceGroup} */ (
          await fixture(html`
          <${parentTag} allow-custom-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
          </${parentTag}>
        `)
        );

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

      if (cfg.choiceType === 'single') {
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

      if (cfg.choiceType === 'single') {
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

      if (cfg.choiceType === 'single') {
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

      if (cfg.choiceType === 'single') {
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

      if (cfg.choiceType === 'single') {
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
      if (cfg.choiceType === 'single') {
        el.modelValue = 'other';
      } else {
        el.modelValue = ['other'];
      }

      el.clear();

      if (cfg.choiceType === 'single') {
        expect(el.serializedValue).to.deep.equal('');
      } else {
        expect(el.serializedValue).to.deep.equal([]);
      }
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

    // TODO: Write test to when options change

    describe('Modelvalue event propagation', () => {
      it('sends one event when custom value is entered', async () => {
        const formSpy = sinon.spy();
        const choiceGroupSpy = sinon.spy();
        const formEl = await fixture(html`
        <lion-fieldset name="form">
          <${parentTag} allow-custom-choice name="choice-group">
            <${childTag} id="option1" .choiceValue="${'1'}" checked></${childTag}>
            <${childTag} id="option2" .choiceValue="${'2'}"></${childTag}>
          </${parentTag}>
        </lion-fieldset>
      `);

        const choiceGroupEl = /** @type {CustomChoiceGroup} */ (
          formEl.querySelector('[name=choice-group]')
        );

        if (choiceGroupEl.multipleChoice) {
          return;
        }

        formEl.addEventListener('model-value-changed', formSpy);
        choiceGroupEl?.addEventListener('model-value-changed', choiceGroupSpy);

        choiceGroupEl.modelValue = '2';
        choiceGroupEl.modelValue = '3';
        await choiceGroupEl.updateComplete;

        expect(choiceGroupSpy.callCount).to.equal(2);
        expect(formSpy.callCount).to.equal(2);
      });
    });
  });
}
