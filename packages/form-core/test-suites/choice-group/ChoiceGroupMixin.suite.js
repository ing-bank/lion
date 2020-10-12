import { LitElement } from '@lion/core';
import { LionInput } from '@lion/input';
import '@lion/fieldset/lion-fieldset.js';
import { FormGroupMixin, Required } from '@lion/form-core';
import { expect, html, fixture, unsafeStatic } from '@open-wc/testing';
import { ChoiceGroupMixin } from '../../src/choice-group/ChoiceGroupMixin.js';
import { ChoiceInputMixin } from '../../src/choice-group/ChoiceInputMixin.js';

class ChoiceInput extends ChoiceInputMixin(LionInput) {}
customElements.define('choice-group-input', ChoiceInput);
// @ts-expect-error
class ChoiceGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {}
customElements.define('choice-group', ChoiceGroup);

/**
 * @param {{ parentTagString?:string, childTagString?: string}} [config]
 */
export function runChoiceGroupMixinSuite({ parentTagString, childTagString } = {}) {
  const cfg = {
    parentTagString: parentTagString || 'choice-group',
    childTagString: childTagString || 'choice-group-input',
  };

  const parentTag = unsafeStatic(cfg.parentTagString);
  const childTag = unsafeStatic(cfg.childTagString);

  describe('ChoiceGroupMixin', () => {
    it('has a single modelValue representing the currently checked radio value', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'} checked></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));
      expect(el.modelValue).to.equal('female');
      el.formElements[0].checked = true;
      expect(el.modelValue).to.equal('male');
      el.formElements[2].checked = true;
      expect(el.modelValue).to.equal('other');
    });

    it('has a single formattedValue representing the currently checked radio value', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'} checked></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));
      expect(el.formattedValue).to.equal('female');
      el.formElements[0].checked = true;
      expect(el.formattedValue).to.equal('male');
      el.formElements[2].checked = true;
      expect(el.formattedValue).to.equal('other');
    });

    it('throws if a child element without a modelValue like { value: "foo", checked: false } tries to register', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'} checked></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));
      const invalidChild = /** @type {ChoiceGroup} */ (await fixture(html`
        <${childTag} .modelValue=${'Lara'}></${childTag}>
      `));

      expect(() => {
        el.addFormElement(invalidChild);
      }).to.throw(
        'The choice-group name="gender" does not allow to register choice-group-input with .modelValue="Lara" - The modelValue should represent an Object { value: "foo", checked: false }',
      );
    });

    it('automatically sets the name property of child fields to its own name', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'female'} checked></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      expect(el.formElements[0].name).to.equal('gender');
      expect(el.formElements[1].name).to.equal('gender');

      const validChild = /** @type {ChoiceGroup} */ (await fixture(html`
        <${childTag} .choiceValue=${'male'}></${childTag}>
      `));
      el.appendChild(validChild);

      expect(el.formElements[2].name).to.equal('gender');
    });

    it('automatically updates the name property of child fields to its own name', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag}></${childTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `));

      expect(el.formElements[0].name).to.equal('gender');
      expect(el.formElements[1].name).to.equal('gender');

      el.name = 'gender2';

      await el.updateComplete;

      expect(el.formElements[0].name).to.equal('gender2');
      expect(el.formElements[1].name).to.equal('gender2');
    });

    it('prevents updating the name property of a child if it is different from its parent', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag}></${childTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `));

      expect(el.formElements[0].name).to.equal('gender');
      expect(el.formElements[1].name).to.equal('gender');

      el.formElements[0].name = 'gender2';

      await el.formElements[0].updateComplete;
      expect(el.formElements[0].name).to.equal('gender');
    });

    it('adjusts the name of a child element if it has a different name than the group', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'female'} checked></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      const invalidChild = /** @type {ChoiceGroup} */ (await fixture(html`
        <${childTag} name="foo" .choiceValue=${'male'}></${childTag}>
      `));
      el.addFormElement(invalidChild);
      await invalidChild.updateComplete;
      expect(invalidChild.name).to.equal('gender');
    });

    it('can set initial modelValue on creation', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender" .modelValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      expect(el.modelValue).to.equal('other');
      expect(el.formElements[2].checked).to.be.true;
    });

    it('can set initial serializedValue on creation', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender" .serializedValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      expect(el.serializedValue).to.equal('other');
      expect(el.formElements[2].checked).to.be.true;
    });

    it('can set initial formattedValue on creation', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender" .formattedValue=${'other'}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      expect(el.formattedValue).to.equal('other');
      expect(el.formElements[2].checked).to.be.true;
    });

    it('can handle complex data via choiceValue', async () => {
      const date = new Date(2018, 11, 24, 10, 33, 30, 0);

      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="data">
          <${childTag} .choiceValue=${{ some: 'data' }}></${childTag}>
          <${childTag} .choiceValue=${date} checked></${childTag}>
        </${parentTag}>
      `));

      expect(el.modelValue).to.equal(date);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.deep.equal({ some: 'data' });
    });

    it('can handle 0 and empty string as valid values', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="data">
          <${childTag} .choiceValue=${0} checked></${childTag}>
          <${childTag} .choiceValue=${''}></${childTag}>
        </${parentTag}>
      `));

      expect(el.modelValue).to.equal(0);
      el.formElements[1].checked = true;
      expect(el.modelValue).to.equal('');
    });

    it('can check a radio by supplying an available modelValue', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag}
            .modelValue="${{ value: 'male', checked: false }}"
          ></${childTag}>
          <${childTag}
            .modelValue="${{ value: 'female', checked: true }}"
          ></${childTag}>
          <${childTag}
            .modelValue="${{ value: 'other', checked: false }}"
          ></${childTag}>
        </${parentTag}>
      `));

      expect(el.modelValue).to.equal('female');
      el.modelValue = 'other';
      expect(el.formElements[2].checked).to.be.true;
    });

    it('expect child nodes to only fire one model-value-changed event per instance', async () => {
      let counter = 0;
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag}
          name="gender"
          @model-value-changed=${() => {
            counter += 1;
          }}
        >
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag}
            .modelValue=${{ value: 'female', checked: true }}
          ></${childTag}>
          <${childTag} .choiceValue=${'other'}></${childTag}>
        </${parentTag}>
      `));

      counter = 0; // reset after setup which may result in different results

      el.formElements[0].checked = true;
      expect(counter).to.equal(1); // male becomes checked, female becomes unchecked

      // not changed values trigger no event
      el.formElements[0].checked = true;
      expect(counter).to.equal(1);

      el.formElements[2].checked = true;
      expect(counter).to.equal(2); // other becomes checked, male becomes unchecked

      // not found values trigger no event
      el.modelValue = 'foo';
      expect(counter).to.equal(2);

      el.modelValue = 'male';
      expect(counter).to.equal(3); // male becomes checked, other becomes unchecked
    });

    it('can be required', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender" .validators=${[new Required()]}>
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag}
            .choiceValue=${{ subObject: 'satisfies required' }}
          ></${childTag}>
        </${parentTag}>
      `));
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.exist;

      el.formElements[0].checked = true;
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.not.exist;

      el.formElements[1].checked = true;
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.not.exist;
    });

    it('returns serialized value', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `));
      el.formElements[0].checked = true;
      expect(el.serializedValue).to.deep.equal('male');
    });

    it('returns serialized value on unchecked state', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <${parentTag} name="gender">
          <${childTag} .choiceValue=${'male'}></${childTag}>
          <${childTag} .choiceValue=${'female'}></${childTag}>
        </${parentTag}>
      `));

      expect(el.serializedValue).to.deep.equal('');
    });

    describe('multipleChoice', () => {
      it('has a single modelValue representing all currently checked values', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <${parentTag} multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
            <${childTag} .choiceValue=${'other'}></${childTag}>
          </${parentTag}>
        `));

        expect(el.modelValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.modelValue).to.eql(['male', 'female', 'other']);
      });

      it('has a single serializedValue representing all currently checked values', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <${parentTag} multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
            <${childTag} .choiceValue=${'other'}></${childTag}>
          </${parentTag}>
        `));

        expect(el.serializedValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.serializedValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.serializedValue).to.eql(['male', 'female', 'other']);
      });

      it('has a single formattedValue representing all currently checked values', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <${parentTag} multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'} checked></${childTag}>
            <${childTag} .choiceValue=${'other'}></${childTag}>
          </${parentTag}>
        `));

        expect(el.formattedValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.formattedValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.formattedValue).to.eql(['male', 'female', 'other']);
      });

      it('can check multiple checkboxes by setting the modelValue', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <${parentTag} multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'}></${childTag}>
            <${childTag} .choiceValue=${'female'}></${childTag}>
            <${childTag} .choiceValue=${'other'}></${childTag}>
          </${parentTag}>
        `));

        el.modelValue = ['male', 'other'];
        expect(el.modelValue).to.eql(['male', 'other']);
        expect(el.formElements[0].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.true;
      });

      it('unchecks non-matching checkboxes when setting the modelValue', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <${parentTag} multiple-choice name="gender[]">
            <${childTag} .choiceValue=${'male'} checked></${childTag}>
            <${childTag} .choiceValue=${'female'}></${childTag}>
            <${childTag} .choiceValue=${'other'} checked></${childTag}>
          </${parentTag}>
        `));

        expect(el.modelValue).to.eql(['male', 'other']);
        expect(el.formElements[0].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.true;

        el.modelValue = ['female'];
        expect(el.formElements[0].checked).to.be.false;
        expect(el.formElements[1].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.false;
      });
    });

    describe('Integration with a parent form/fieldset', () => {
      it('will serialize all children with their serializedValue', async () => {
        const el = /** @type {ChoiceGroup} */ (await fixture(html`
          <lion-fieldset>
            <${parentTag} name="gender">
              <${childTag} .choiceValue=${'male'} checked disabled></${childTag}>
              <${childTag} .choiceValue=${'female'} checked></${childTag}>
              <${childTag} .choiceValue=${'other'}></${childTag}>
            </${parentTag}>
          </lion-fieldset>
        `));

        expect(el.serializedValue).to.eql({
          gender: 'female',
        });

        const choiceGroupEl = /** @type {ChoiceGroup} */ (el.querySelector('[name="gender"]'));
        choiceGroupEl.multipleChoice = true;
        expect(el.serializedValue).to.eql({
          gender: ['female'],
        });
      });
    });
  });
}
