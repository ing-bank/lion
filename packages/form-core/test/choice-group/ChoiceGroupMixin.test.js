import { html, LitElement } from '@lion/core';
// @ts-expect-error
import { LionInput } from '@lion/input';
import '@lion/fieldset/lion-fieldset.js';
import { FormGroupMixin, Required } from '@lion/form-core';
import { expect, fixture } from '@open-wc/testing';
import { ChoiceGroupMixin } from '../../src/choice-group/ChoiceGroupMixin.js';
import { ChoiceInputMixin } from '../../src/choice-group/ChoiceInputMixin.js';
// import { LionField } from '../../src/LionField.js';

// class InputField extends LionField {
//   get slots() {
//     return {
//       ...super.slots,
//       input: () => document.createElement('input'),
//     };
//   }
// }

describe('ChoiceGroupMixin', () => {
  class ChoiceInput extends ChoiceInputMixin(LionInput) {}
  // @ts-expect-error base constructors same return type
  customElements.define('choice-group-input', ChoiceInput);
  // @ts-expect-error
  class ChoiceGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {}
  customElements.define('choice-group', ChoiceGroup);
  // @ts-expect-error
  class ChoiceGroupMultiple extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
    constructor() {
      super();
      this.multipleChoice = true;
    }
  }
  customElements.define('choice-group-multiple', ChoiceGroupMultiple);

  it('has a single modelValue representing the currently checked radio value', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));
    expect(el.modelValue).to.equal('female');
    el.formElements[0].checked = true;
    expect(el.modelValue).to.equal('male');
    el.formElements[2].checked = true;
    expect(el.modelValue).to.equal('other');
  });

  it('has a single formattedValue representing the currently checked radio value', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));
    expect(el.formattedValue).to.equal('female');
    el.formElements[0].checked = true;
    expect(el.formattedValue).to.equal('male');
    el.formElements[2].checked = true;
    expect(el.formattedValue).to.equal('other');
  });

  it('throws if a child element without a modelValue like { value: "foo", checked: false } tries to register', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));
    const invalidChild = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group-input .modelValue=${'Lara'}></choice-group-input>
    `));

    expect(() => {
      el.addFormElement(invalidChild);
    }).to.throw(
      'The choice-group name="gender" does not allow to register choice-group-input with .modelValue="Lara" - The modelValue should represent an Object { value: "foo", checked: false }',
    );
  });

  it('automatically sets the name property of child radios to its own name', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));

    expect(el.formElements[0].name).to.equal('gender');
    expect(el.formElements[1].name).to.equal('gender');

    const validChild = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group-input .choiceValue=${'male'}></choice-group-input>
    `));
    el.appendChild(validChild);

    expect(el.formElements[2].name).to.equal('gender');
  });

  it('throws if a child element with a different name than the group tries to register', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));

    const invalidChild = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group-input name="foo" .choiceValue=${'male'}></choice-group-input>
    `));

    expect(() => {
      el.addFormElement(invalidChild);
    }).to.throw(
      'The choice-group name="gender" does not allow to register choice-group-input with custom names (name="foo" given)',
    );
  });

  it('can set initial modelValue on creation', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender" .modelValue=${'other'}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));

    expect(el.modelValue).to.equal('other');
    expect(el.formElements[2].checked).to.be.true;
  });

  it('can set initial serializedValue on creation', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender" .serializedValue=${'other'}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));

    expect(el.serializedValue).to.equal('other');
    expect(el.formElements[2].checked).to.be.true;
  });

  it('can set initial formattedValue on creation', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender" .formattedValue=${'other'}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `));

    expect(el.formattedValue).to.equal('other');
    expect(el.formElements[2].checked).to.be.true;
  });

  it('can handle complex data via choiceValue', async () => {
    const date = new Date(2018, 11, 24, 10, 33, 30, 0);

    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="data">
        <choice-group-input .choiceValue=${{ some: 'data' }}></choice-group-input>
        <choice-group-input .choiceValue=${date} checked></choice-group-input>
      </choice-group>
    `));

    expect(el.modelValue).to.equal(date);
    el.formElements[0].checked = true;
    expect(el.modelValue).to.deep.equal({ some: 'data' });
  });

  it('can handle 0 and empty string as valid values', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="data">
        <choice-group-input .choiceValue=${0} checked></choice-group-input>
        <choice-group-input .choiceValue=${''}></choice-group-input>
      </choice-group>
    `));

    expect(el.modelValue).to.equal(0);
    el.formElements[1].checked = true;
    expect(el.modelValue).to.equal('');
  });

  it('can check a radio by supplying an available modelValue', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .modelValue="${{ value: 'male', checked: false }}"></choice-group-input>
        <choice-group-input
          .modelValue="${{ value: 'female', checked: true }}"
        ></choice-group-input>
        <choice-group-input
          .modelValue="${{ value: 'other', checked: false }}"
        ></choice-group-input>
      </choice-group>
    `));

    expect(el.modelValue).to.equal('female');
    el.modelValue = 'other';
    expect(el.formElements[2].checked).to.be.true;
  });

  it('expect child nodes to only fire one model-value-changed event per instance', async () => {
    let counter = 0;
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group
        name="gender"
        @model-value-changed=${() => {
          counter += 1;
        }}
      >
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .modelValue=${{ value: 'female', checked: true }}></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
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
      <choice-group name="gender" .validators=${[new Required()]}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input
          .choiceValue=${{ subObject: 'satisfies required' }}
        ></choice-group-input>
      </choice-group>
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
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
      </choice-group>
    `));
    el.formElements[0].checked = true;
    expect(el.serializedValue).to.deep.equal('male');
  });

  it('returns serialized value on unchecked state', async () => {
    const el = /** @type {ChoiceGroup} */ (await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
      </choice-group>
    `));

    expect(el.serializedValue).to.deep.equal('');
  });

  describe('multipleChoice', () => {
    it('has a single modelValue representing all currently checked values', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'}></choice-group-input>
          <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
          <choice-group-input .choiceValue=${'other'}></choice-group-input>
        </choice-group-multiple>
      `));

      expect(el.modelValue).to.eql(['female']);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.eql(['male', 'female']);
      el.formElements[2].checked = true;
      expect(el.modelValue).to.eql(['male', 'female', 'other']);
    });

    it('has a single serializedValue representing all currently checked values', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'}></choice-group-input>
          <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
          <choice-group-input .choiceValue=${'other'}></choice-group-input>
        </choice-group-multiple>
      `));

      expect(el.serializedValue).to.eql(['female']);
      el.formElements[0].checked = true;
      expect(el.serializedValue).to.eql(['male', 'female']);
      el.formElements[2].checked = true;
      expect(el.serializedValue).to.eql(['male', 'female', 'other']);
    });

    it('has a single formattedValue representing all currently checked values', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'}></choice-group-input>
          <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
          <choice-group-input .choiceValue=${'other'}></choice-group-input>
        </choice-group-multiple>
      `));

      expect(el.formattedValue).to.eql(['female']);
      el.formElements[0].checked = true;
      expect(el.formattedValue).to.eql(['male', 'female']);
      el.formElements[2].checked = true;
      expect(el.formattedValue).to.eql(['male', 'female', 'other']);
    });

    it('can check multiple checkboxes by setting the modelValue', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'}></choice-group-input>
          <choice-group-input .choiceValue=${'female'}></choice-group-input>
          <choice-group-input .choiceValue=${'other'}></choice-group-input>
        </choice-group-multiple>
      `));

      el.modelValue = ['male', 'other'];
      expect(el.modelValue).to.eql(['male', 'other']);
      expect(el.formElements[0].checked).to.be.true;
      expect(el.formElements[2].checked).to.be.true;
    });

    it('unchecks non-matching checkboxes when setting the modelValue', async () => {
      const el = /** @type {ChoiceGroup} */ (await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'} checked></choice-group-input>
          <choice-group-input .choiceValue=${'female'}></choice-group-input>
          <choice-group-input .choiceValue=${'other'} checked></choice-group-input>
        </choice-group-multiple>
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
          <choice-group name="gender">
            <choice-group-input .choiceValue=${'male'} checked disabled></choice-group-input>
            <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
            <choice-group-input .choiceValue=${'other'}></choice-group-input>
          </choice-group>
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
