import { html } from '@lion/core';
import { LionFieldset } from '@lion/fieldset';
import { LionInput } from '@lion/input';
import { Required } from '@lion/validate';
import { expect, fixture, nextFrame } from '@open-wc/testing';
import { ChoiceGroupMixin } from '../src/ChoiceGroupMixin.js';
import { ChoiceInputMixin } from '../src/ChoiceInputMixin.js';

describe('ChoiceGroupMixin', () => {
  before(() => {
    class ChoiceInput extends ChoiceInputMixin(LionInput) {}
    customElements.define('choice-group-input', ChoiceInput);

    class ChoiceGroup extends ChoiceGroupMixin(LionFieldset) {}
    customElements.define('choice-group', ChoiceGroup);

    class ChoiceGroupMultiple extends ChoiceGroupMixin(LionFieldset) {
      constructor() {
        super();
        this.multipleChoice = true;
      }
    }
    customElements.define('choice-group-multiple', ChoiceGroupMultiple);
  });

  it('has a single modelValue representing the currently checked radio value', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();
    expect(el.modelValue).to.equal('female');
    el.formElementsArray[0].checked = true;
    expect(el.modelValue).to.equal('male');
    el.formElementsArray[2].checked = true;
    expect(el.modelValue).to.equal('other');
  });

  it('throws if a child element without a modelValue like { value: "foo", checked: false } tries to register', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();
    const invalidChild = await fixture(html`
      <choice-group-input .modelValue=${'Lara'}></choice-group-input>
    `);

    expect(() => {
      el.addFormElement(invalidChild);
    }).to.throw(
      'The choice-group name="gender" does not allow to register choice-group-input with .modelValue="Lara" - The modelValue should represent an Object { value: "foo", checked: false }',
    );
  });

  it('automatically sets the name property of child radios to its own name', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();

    expect(el.formElementsArray[0].name).to.equal('gender');
    expect(el.formElementsArray[1].name).to.equal('gender');

    const validChild = await fixture(html`
      <choice-group-input .choiceValue=${'male'}></choice-group-input>
    `);
    el.appendChild(validChild);

    expect(el.formElementsArray[2].name).to.equal('gender');
  });

  it('throws if a child element with a different name than the group tries to register', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();
    const invalidChild = await fixture(html`
      <choice-group-input name="foo" .choiceValue=${'male'}></choice-group-input>
    `);

    expect(() => {
      el.addFormElement(invalidChild);
    }).to.throw(
      'The choice-group name="gender" does not allow to register choice-group-input with custom names (name="foo" given)',
    );
  });

  it('can set initial modelValue on creation', async () => {
    const el = await fixture(html`
      <choice-group name="gender" .modelValue=${'other'}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
        <choice-group-input .choiceValue=${'other'}></choice-group-input>
      </choice-group>
    `);

    await nextFrame();
    await el.registrationReady;
    await el.updateComplete;

    expect(el.modelValue).to.equal('other');
    expect(el.formElementsArray[2].checked).to.be.true;
  });

  it('can handle complex data via choiceValue', async () => {
    const date = new Date(2018, 11, 24, 10, 33, 30, 0);

    const el = await fixture(html`
      <choice-group name="data">
        <choice-group-input .choiceValue=${{ some: 'data' }}></choice-group-input>
        <choice-group-input .choiceValue=${date} checked></choice-group-input>
      </choice-group>
    `);
    await nextFrame();

    expect(el.modelValue).to.equal(date);
    el.formElementsArray[0].checked = true;
    expect(el.modelValue).to.deep.equal({ some: 'data' });
  });

  it('can handle 0 and empty string as valid values', async () => {
    const el = await fixture(html`
      <choice-group name="data">
        <choice-group-input .choiceValue=${0} checked></choice-group-input>
        <choice-group-input .choiceValue=${''}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();

    expect(el.modelValue).to.equal(0);
    el.formElementsArray[1].checked = true;
    expect(el.modelValue).to.equal('');
  });

  it('can check a radio by supplying an available modelValue', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .modelValue="${{ value: 'male', checked: false }}"></choice-group-input>
        <choice-group-input
          .modelValue="${{ value: 'female', checked: true }}"
        ></choice-group-input>
        <choice-group-input
          .modelValue="${{ value: 'other', checked: false }}"
        ></choice-group-input>
      </choice-group>
    `);
    await nextFrame();
    expect(el.modelValue).to.equal('female');
    el.modelValue = 'other';
    expect(el.formElementsArray[2].checked).to.be.true;
  });

  it('expect child nodes to only fire one model-value-changed event per instance', async () => {
    let counter = 0;
    const el = await fixture(html`
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
    `);
    await nextFrame();
    counter = 0; // reset after setup which may result in different results

    el.formElementsArray[0].checked = true;
    expect(counter).to.equal(2); // male becomes checked, female becomes unchecked

    // not changed values trigger no event
    el.formElementsArray[0].checked = true;
    expect(counter).to.equal(2);

    el.formElementsArray[2].checked = true;
    expect(counter).to.equal(4); // other becomes checked, male becomes unchecked

    // not found values trigger no event
    el.modelValue = 'foo';
    expect(counter).to.equal(4);

    el.modelValue = 'male';
    expect(counter).to.equal(6); // male becomes checked, other becomes unchecked
  });

  it('can be required', async () => {
    const el = await fixture(html`
      <choice-group name="gender" .validators=${[new Required()]}>
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input
          .choiceValue=${{ subObject: 'satisfies required' }}
        ></choice-group-input>
      </choice-group>
    `);
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.a.property('error');
    expect(el.validationStates.error).to.have.a.property('Required');

    el.formElementsArray[0].checked = true;
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.a.property('error');
    expect(el.validationStates.error).not.to.have.a.property('Required');

    el.formElementsArray[1].checked = true;
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.a.property('error');
    expect(el.validationStates.error).not.to.have.a.property('Required');
  });

  it('returns serialized value', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
      </choice-group>
    `);
    el.formElementsArray[0].checked = true;
    expect(el.serializedValue).to.deep.equal({ checked: true, value: 'male' });
  });

  it('returns serialized value on unchecked state', async () => {
    const el = await fixture(html`
      <choice-group name="gender">
        <choice-group-input .choiceValue=${'male'}></choice-group-input>
        <choice-group-input .choiceValue=${'female'}></choice-group-input>
      </choice-group>
    `);
    await nextFrame();

    expect(el.serializedValue).to.deep.equal('');
  });

  describe('multipleChoice', () => {
    it('has a single modelValue representing all currently checked values', async () => {
      const el = await fixture(html`
        <choice-group-multiple name="gender[]">
          <choice-group-input .choiceValue=${'male'}></choice-group-input>
          <choice-group-input .choiceValue=${'female'} checked></choice-group-input>
          <choice-group-input .choiceValue=${'other'}></choice-group-input>
        </choice-group-multiple>
      `);
      await nextFrame();
      expect(el.modelValue).to.eql(['female']);
      el.formElementsArray[0].checked = true;
      expect(el.modelValue).to.eql(['male', 'female']);
      el.formElementsArray[2].checked = true;
      expect(el.modelValue).to.eql(['male', 'female', 'other']);
    });

    it('can check multiple checkboxes by setting the modelValue', async () => {
      const el = await fixture(html`
        <lion-checkbox-group name="gender[]">
          <lion-checkbox .choiceValue=${'male'}></lion-checkbox>
          <lion-checkbox .choiceValue=${'female'}></lion-checkbox>
          <lion-checkbox .choiceValue=${'other'}></lion-checkbox>
        </lion-checkbox-group>
      `);

      await nextFrame();
      await el.registrationReady;
      await el.updateComplete;
      el.modelValue = ['male', 'other'];
      expect(el.modelValue).to.eql(['male', 'other']);
      expect(el.formElementsArray[0].checked).to.be.true;
      expect(el.formElementsArray[2].checked).to.be.true;
    });

    it('unchecks non-matching checkboxes when setting the modelValue', async () => {
      const el = await fixture(html`
        <lion-checkbox-group name="gender[]">
          <lion-checkbox .choiceValue=${'male'} checked></lion-checkbox>
          <lion-checkbox .choiceValue=${'female'}></lion-checkbox>
          <lion-checkbox .choiceValue=${'other'} checked></lion-checkbox>
        </lion-checkbox-group>
      `);

      await nextFrame();
      await el.registrationReady;
      await el.updateComplete;
      expect(el.modelValue).to.eql(['male', 'other']);
      expect(el.formElementsArray[0].checked).to.be.true;
      expect(el.formElementsArray[2].checked).to.be.true;

      el.modelValue = ['female'];
      expect(el.formElementsArray[0].checked).to.be.false;
      expect(el.formElementsArray[1].checked).to.be.true;
      expect(el.formElementsArray[2].checked).to.be.false;
    });
  });
});
