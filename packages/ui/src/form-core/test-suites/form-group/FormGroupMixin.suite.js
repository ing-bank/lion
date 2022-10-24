import { LitElement } from 'lit';
import { IsNumber, LionField, Validator, FormGroupMixin } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-field.js';
import '@lion/ui/define/lion-validation-feedback.js';

import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';
import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  html,
  triggerFocusFor,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

/**
 * @param {{ tagString?: string, childTagString?:string }} [cfg]
 */
export function runFormGroupMixinSuite(cfg = {}) {
  class FormChild extends LionField {
    // @ts-ignore
    get slots() {
      return {
        ...super.slots,
        input: () => document.createElement('input'),
      };
    }
  }

  const childTagString = cfg.childTagString || defineCE(FormChild);

  class FormGroup extends FormGroupMixin(LitElement) {
    constructor() {
      super();
      /** @override from FormRegistrarMixin */
      this._isFormOrFieldset = true;
      /** @type {'child'|'choice-group'|'fieldset'} */
      this._repropagationRole = 'fieldset'; // configures FormControlMixin
    }
  }

  const tagString = cfg.tagString || defineCE(FormGroup);
  const tag = unsafeStatic(tagString);
  const childTag = unsafeStatic(childTagString);
  const inputSlots = html`
  <${childTag} name="gender[]"></${childTag}>
  <${childTag} name="gender[]"></${childTag}>
  <${childTag} name="color"></${childTag}>
  <${childTag} name="hobbies[]"></${childTag}>
  <${childTag} name="hobbies[]"></${childTag}>
`;

  beforeEach(() => {
    localizeTearDown();
  });

  describe('FormGroupMixin', () => {
    // TODO: Tests below belong to FormControlMixin. Preferably run suite integration test
    it(`has a fieldName based on the label`, async () => {
      const el1 = /**  @type {FormGroup} */ (
        await fixture(html`<${tag} label="foo">${inputSlots}</${tag}>`)
      );
      const { _labelNode: _labelNode1 } = getFormControlMembers(el1);
      expect(el1.fieldName).to.equal(_labelNode1.textContent);

      const el2 = /**  @type {FormGroup} */ (
        await fixture(html`<${tag}><label slot="label">bar</label>${inputSlots}</${tag}>`)
      );
      const { _labelNode: _labelNode2 } = getFormControlMembers(el2);
      expect(el2.fieldName).to.equal(_labelNode2.textContent);
    });

    it(`has a fieldName based on the name if no label exists`, async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`<${tag} name="foo">${inputSlots}</${tag}>`)
      );
      expect(el.fieldName).to.equal(el.name);
    });

    it(`can override fieldName`, async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag} label="foo" .fieldName="${'bar'}">${inputSlots}</${tag}>
    `)
      );
      // @ts-ignore [allow-protected] in test
      expect(el.__fieldName).to.equal(el.fieldName);
    });

    // TODO: Tests below belong to FormRegistrarMixin. Preferably run suite integration test
    it(`${tagString} has an up to date list of every form element in .formElements`, async () => {
      const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}>${inputSlots}</${tag}>`));
      // @ts-ignore [allow-protected] in test
      expect(el.formElements._keys().length).to.equal(3);
      expect(el.formElements['hobbies[]'].length).to.equal(2);
      el.removeChild(el.formElements['hobbies[]'][0]);
      // @ts-ignore [allow-protected] in test
      expect(el.formElements._keys().length).to.equal(3);
      expect(el.formElements['hobbies[]'].length).to.equal(1);
    });

    it(`supports in html wrapped form elements`, async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag}>
        <div>
          <${childTag} name="foo"></${childTag}>
        </div>
      </${tag}>
    `)
      );
      expect(el.formElements.length).to.equal(1);
      el.children[0].removeChild(el.formElements.foo);
      expect(el.formElements.length).to.equal(0);
    });

    it('handles names with ending [] as an array', async () => {
      const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}>${inputSlots}</${tag}>`));
      el.formElements['gender[]'][0].modelValue = { value: 'male' };
      el.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      el.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };

      // @ts-ignore
      expect(el.formElements._keys().length).to.equal(3);
      expect(el.formElements['hobbies[]'].length).to.equal(2);
      expect(el.formElements['hobbies[]'][0].modelValue.value).to.equal('chess');
      expect(el.formElements['gender[]'][0].modelValue.value).to.equal('male');
      expect(el.modelValue['hobbies[]']).to.deep.equal([
        { checked: false, value: 'chess' },
        { checked: false, value: 'rugby' },
      ]);
    });

    it('throws if name is the same as its parent', async () => {
      const orig = console.info;
      console.info = () => {};

      let error;
      const el = /**  @type {FormGroup} */ (await fixture(html`<${tag} name="foo"></${tag}>`));
      try {
        // we test the api directly as errors thrown from a web component are in a
        // different context and we can not catch them here => register fake elements
        el.addFormElement(
          /**  @type {HTMLElement & import('../../types/FormControlMixinTypes').FormControlHost} */ ({
            name: 'foo',
          }),
        );
      } catch (err) {
        error = err;
      }
      expect(error).to.be.instanceOf(TypeError);
      expect(/** @type {TypeError} */ (error).message).to.equal(
        'You can not have the same name "foo" as your parent',
      );

      console.info = orig; // restore original console
    });

    it('throws if same name without ending [] is used', async () => {
      const orig = console.info;
      console.info = () => {};

      let error;
      const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}></${tag}>`));
      try {
        // we test the api directly as errors thrown from a web component are in a
        // different context and we can not catch them here => register fake elements
        el.addFormElement(
          /**  @type {HTMLElement & import('../../types/FormControlMixinTypes').FormControlHost} */ ({
            name: 'fooBar',
          }),
        );
        el.addFormElement(
          /**  @type {HTMLElement & import('../../types/FormControlMixinTypes').FormControlHost} */ ({
            name: 'fooBar',
          }),
        );
      } catch (err) {
        error = err;
      }
      expect(error).to.be.instanceOf(TypeError);
      expect(/** @type {TypeError} */ (error).message).to.equal(
        'Name "fooBar" is already registered - if you want an array add [] to the end',
      );

      console.info = orig; // restore original console
    });
    /* eslint-enable no-console */

    it('can dynamically add/remove elements', async () => {
      const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}>${inputSlots}</${tag}>`));
      const newField = /**  @type {FormGroup} */ (
        await fixture(html`<${childTag} name="lastName"></${childTag}>`)
      );
      const { _inputNode } = getFormControlMembers(el);

      // @ts-ignore [allow-protected] in test
      expect(el.formElements._keys().length).to.equal(3);

      el.appendChild(newField);
      // @ts-ignore [allow-protected] in test
      expect(el.formElements._keys().length).to.equal(4);

      _inputNode.removeChild(newField);
      // @ts-ignore [allow-protected] in test
      expect(el.formElements._keys().length).to.equal(3);
    });

    // TODO: Tests below belong to FormGroupMixin. Preferably run suite integration test

    it('can read/write all values (of every input) via this.modelValue', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag}>
        <${childTag} name="lastName"></${childTag}>
        <${tag} name="newfieldset">${inputSlots}</${tag}>
      </${tag}>
    `)
      );
      const newFieldset = /**  @type {FormGroup} */ (el.querySelector(tagString));
      el.formElements.lastName.modelValue = 'Bar';
      newFieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'chess' };
      newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'football' };
      newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };

      expect(el.modelValue).to.deep.equal({
        lastName: 'Bar',
        newfieldset: {
          'hobbies[]': [
            { checked: true, value: 'chess' },
            { checked: false, value: 'football' },
          ],
          'gender[]': [
            { checked: false, value: 'male' },
            { checked: false, value: 'female' },
          ],
          color: { checked: false, value: 'blue' },
        },
      });

      // make sure values are full settled before changing them
      await aTimeout(0);
      el.modelValue = {
        lastName: 2,
        newfieldset: {
          'hobbies[]': [
            { checked: true, value: 'chess' },
            { checked: false, value: 'baseball' },
          ],
          'gender[]': [
            { checked: false, value: 'male' },
            { checked: false, value: 'female' },
          ],
          color: { checked: false, value: 'blue' },
        },
      };

      expect(newFieldset.formElements['hobbies[]'][0].modelValue).to.deep.equal({
        checked: true,
        value: 'chess',
      });
      expect(newFieldset.formElements['hobbies[]'][1].modelValue).to.deep.equal({
        checked: false,
        value: 'baseball',
      });
      expect(el.formElements.lastName.modelValue).to.equal(2);
    });

    it('works with document.createElement', async () => {
      const el = /** @type {FormGroup} */ (document.createElement(tagString));
      const childEl = /** @type {FormChild} */ (document.createElement(childTagString));
      childEl.name = 'planet';
      childEl.modelValue = 'earth';
      expect(el.formElements.length).to.equal(0);

      const wrapper = await fixture('<div></div>');
      el.appendChild(childEl);
      wrapper.appendChild(el);

      expect(el.formElements.length).to.equal(1);

      await el.registrationComplete;
      expect(el.modelValue).to.deep.equal({ planet: 'earth' });
    });

    it('does not list disabled values in this.modelValue', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag}>
        <${childTag} name="a" disabled .modelValue="${'x'}"></${childTag}>
        <${childTag} name="b" .modelValue="${'x'}"></${childTag}>
        <${tag} name="newFieldset">
          <${childTag} name="c" .modelValue="${'x'}"></${childTag}>
          <${childTag} name="d" disabled .modelValue="${'x'}"></${childTag}>
        </${tag}>
        <${tag} name="disabledFieldset" disabled>
          <${childTag} name="e" .modelValue="${'x'}"></${childTag}>
        </${tag}>
      </${tag}>
    `)
      );
      expect(el.modelValue).to.deep.equal({
        b: 'x',
        newFieldset: {
          c: 'x',
        },
      });
    });

    it('allows overriding whether fields are included in when fetching modelValue/serializedValue etc.', async () => {
      class FormGroupSubclass extends FormGroupMixin(LitElement) {
        constructor() {
          super();
          /** @override from FormRegistrarMixin */
          this._isFormOrFieldset = true;
          /** @type {'child'|'choice-group'|'fieldset'} */
          this._repropagationRole = 'fieldset'; // configures FormControlMixin
        }

        /**
         *
         * @param {import('../../types/FormControlMixinTypes').FormControlHost & {disabled: boolean}} el
         * @param {string} type
         */
        _getFromAllFormElementsFilter(el, type) {
          if (type === 'serializedValue') {
            return !el.disabled;
          }
          return true;
        }
      }

      const tagStringSubclass = defineCE(FormGroupSubclass);
      const tagSubclass = unsafeStatic(tagStringSubclass);
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
          <${tagSubclass}>
            <${childTag} name="a" disabled .modelValue="${'x'}"></${childTag}>
            <${childTag} name="b" .modelValue="${'x'}"></${childTag}>
            <${tagSubclass} name="newFieldset">
              <${childTag} name="c" .modelValue="${'x'}"></${childTag}>
              <${childTag} name="d" disabled .modelValue="${'x'}"></${childTag}>
            </${tagSubclass}>
            <${tagSubclass} name="disabledFieldset" disabled>
              <${childTag} name="e" .modelValue="${'x'}"></${childTag}>
            </${tagSubclass}>
          </${tagSubclass}>
        `)
      );
      expect(el.modelValue).to.deep.equal({
        a: 'x',
        b: 'x',
        newFieldset: {
          c: 'x',
          d: 'x',
        },
        disabledFieldset: {
          e: 'x',
        },
      });

      expect(el.serializedValue).to.deep.equal({
        b: 'x',
        newFieldset: {
          c: 'x',
        },
      });
    });

    it('allows imperatively passing a filter function to _getFromAllFormElements', async () => {
      class FormGroupSubclass extends FormGroupMixin(LitElement) {
        constructor() {
          super();
          /** @override from FormRegistrarMixin */
          this._isFormOrFieldset = true;
          /** @type {'child'|'choice-group'|'fieldset'} */
          this._repropagationRole = 'fieldset'; // configures FormControlMixin
        }

        /**
         *
         * @param {import('../../types/FormControlMixinTypes').FormControlHost & {disabled: boolean}} el
         * @param {string} type
         */
        _getFromAllFormElementsFilter(el, type) {
          if (type === 'serializedValue') {
            return !el.disabled;
          }
          return true;
        }
      }

      const tagStringSubclass = defineCE(FormGroupSubclass);
      const tagSubclass = unsafeStatic(tagStringSubclass);
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
          <${tagSubclass}>
            <${childTag} name="a" disabled .modelValue="${'x'}"></${childTag}>
            <${childTag} name="b" .modelValue="${'x'}"></${childTag}>
            <${tagSubclass} name="newFieldset">
              <${childTag} name="c" .modelValue="${'x'}"></${childTag}>
              <${childTag} name="d" disabled .modelValue="${'x'}"></${childTag}>
            </${tagSubclass}>
            <${tagSubclass} name="disabledFieldset" disabled>
              <${childTag} name="e" .modelValue="${'x'}"></${childTag}>
            </${tagSubclass}>
          </${tagSubclass}>
        `)
      );

      // @ts-expect-error access protected method
      expect(el._getFromAllFormElements('serializedValue')).to.eql({
        b: 'x',
        newFieldset: {
          c: 'x',
        },
      });

      // @ts-expect-error access protected method
      expect(el._getFromAllFormElements('serializedValue', () => true)).to.eql({
        a: 'x',
        b: 'x',
        newFieldset: {
          c: 'x',
        },
        disabledFieldset: {},
      });
    });

    it('does not throw if setter data of this.modelValue can not be handled', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag}>
        <${childTag} name="firstName" .modelValue=${'foo'}></${childTag}>
        <${childTag} name="lastName" .modelValue=${'bar'}></${childTag}>
      </${tag}>
    `)
      );
      const initState = {
        firstName: 'foo',
        lastName: 'bar',
      };
      expect(el.modelValue).to.deep.equal(initState);

      el.modelValue = undefined;
      expect(el.modelValue).to.deep.equal(initState);

      el.modelValue = null;
      expect(el.modelValue).to.deep.equal(initState);
    });

    it('disables/enables all its formElements if it becomes disabled/enabled', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`<${tag} disabled>${inputSlots}</${tag}>`)
      );
      expect(el.formElements.color.disabled).to.be.true;
      expect(el.formElements['hobbies[]'][0].disabled).to.be.true;
      expect(el.formElements['hobbies[]'][1].disabled).to.be.true;

      el.disabled = false;
      await el.updateComplete;
      expect(el.formElements.color.disabled).to.equal(false);
      expect(el.formElements['hobbies[]'][0].disabled).to.equal(false);
      expect(el.formElements['hobbies[]'][1].disabled).to.equal(false);
    });

    it('does not propagate/override initial disabled value on nested form elements', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag}>
        <${tag} name="sub" disabled>${inputSlots}</${tag}>
      </${tag}>
    `)
      );

      expect(el.disabled).to.equal(false);
      expect(el.formElements.sub.disabled).to.be.true;
      expect(el.formElements.sub.formElements.color.disabled).to.be.true;
      expect(el.formElements.sub.formElements['hobbies[]'][0].disabled).to.be.true;
      expect(el.formElements.sub.formElements['hobbies[]'][1].disabled).to.be.true;
    });

    it('can set initial modelValue on creation', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag} .modelValue=${{ lastName: 'Bar' }}>
        <${childTag} name="lastName"></${childTag}>
      </${tag}>
    `)
      );

      expect(el.modelValue).to.eql({
        lastName: 'Bar',
      });
    });

    it('can set initial serializedValue on creation', async () => {
      const el = /**  @type {FormGroup} */ (
        await fixture(html`
      <${tag} .modelValue=${{ lastName: 'Bar' }}>
        <${childTag} name="lastName"></${childTag}>
      </${tag}>
    `)
      );

      expect(el.modelValue).to.eql({ lastName: 'Bar' });
    });

    describe('Validation', () => {
      it('validates on init', async () => {
        class IsCat extends Validator {
          static get validatorName() {
            return 'IsCat';
          }

          /**
           * @param {string} value
           */
          execute(value) {
            const hasError = value !== 'cat';
            return hasError;
          }
        }

        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="color" .validators=${[
            new IsCat(),
          ]} .modelValue=${'blue'}></${childTag}>
        </${tag}>
      `)
        );
        expect(el.formElements.color.validationStates.error.IsCat).to.be.true;
      });

      it('validates when a value changes', async () => {
        const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}>${inputSlots}</${tag}>`));

        const spy = sinon.spy(el, 'validate');
        el.formElements.color.modelValue = { checked: true, value: 'red' };
        expect(spy.callCount).to.equal(1);
      });

      it('has a special validator for all children - can be checked via this.error.FormElementsHaveNoError', async () => {
        class IsCat extends Validator {
          static get validatorName() {
            return 'IsCat';
          }

          /**
           * @param {string} value
           */
          execute(value) {
            const hasError = value !== 'cat';
            return hasError;
          }
        }

        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="color" .validators=${[
            new IsCat(),
          ]} .modelValue=${'blue'}></${childTag}>
        </${tag}>
      `)
        );

        expect(el.validationStates.error.FormElementsHaveNoError).to.be.true;
        expect(el.formElements.color.validationStates.error.IsCat).to.be.true;
        el.formElements.color.modelValue = 'cat';
        expect(el.validationStates.error).to.deep.equal({});
      });

      it('validates on children (de)registration', async () => {
        class HasEvenNumberOfChildren extends Validator {
          static get validatorName() {
            return 'HasEvenNumberOfChildren';
          }

          /**
           * @param {string} value
           */
          execute(value) {
            const hasError = Object.keys(value).length % 2 !== 0;
            return hasError;
          }
        }
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .validators=${[new HasEvenNumberOfChildren()]}>
          <${childTag} id="c1" name="c1"></${childTag}>
        </${tag}>
      `)
        );
        const child2 = /**  @type {FormGroup} */ (
          await fixture(html`
        <${childTag} name="c2"></${childTag}>
      `)
        );
        expect(el.validationStates.error.HasEvenNumberOfChildren).to.be.true;

        el.appendChild(child2);
        expect(el.validationStates.error.HasEvenNumberOfChildren).to.equal(undefined);

        el.removeChild(child2);
        expect(el.validationStates.error.HasEvenNumberOfChildren).to.be.true;

        // Edge case: remove all children
        el.removeChild(/**  @type {Node} */ (el.querySelector('[id=c1]')));

        expect(el.validationStates.error.HasEvenNumberOfChildren).to.equal(undefined);
      });
    });

    describe('Interaction states', () => {
      it('has false states (dirty, touched, prefilled) on init', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        expect(fieldset.dirty).to.equal(false, 'dirty');
        expect(fieldset.touched).to.equal(false, 'touched');
        expect(fieldset.prefilled).to.equal(false, 'prefilled');
      });

      it('sets dirty when value changed', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        fieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'football' };
        expect(fieldset.dirty).to.be.true;
      });

      it('sets touched when last field in fieldset left after focus', async () => {
        const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}>${inputSlots}</${tag}>`));
        const { _inputNode: hobbyInputNode } = getFormControlMembers(
          el.formElements['hobbies[]'][0],
        );
        const { _inputNode: genderInputNode } = getFormControlMembers(
          el.formElements['hobbies[]'][el.formElements['gender[]'].length - 1],
        );

        await triggerFocusFor(hobbyInputNode);
        await triggerFocusFor(genderInputNode);
        const button = /**  @type {FormGroup} */ (await fixture(html`<button></button>`));
        button.focus();

        expect(el.touched).to.be.true;
      });

      it('sets attributes [touched][dirty]', async () => {
        const el = /**  @type {FormGroup} */ (await fixture(html`<${tag}></${tag}>`));
        el.touched = true;
        await el.updateComplete;
        expect(el).to.have.attribute('touched');

        el.dirty = true;
        await el.updateComplete;
        expect(el).to.have.attribute('dirty');
      });

      it('becomes prefilled if all form elements are prefilled', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="input1" .modelValue="${'prefilled'}"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `)
        );
        expect(el.prefilled).to.be.false;

        const el2 = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="input1" .modelValue="${'prefilled'}"></${childTag}>
          <${childTag} name="input2" .modelValue="${'prefilled'}"></${childTag}>
        </${tag}>
      `)
        );
        expect(el2.prefilled).to.be.true;
      });

      it(`becomes "touched" once the last element of a group becomes blurred by keyboard
      interaction (e.g. tabbing through the checkbox-group)`, async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <label slot="label">My group</label>
          <${childTag} name="myGroup[]" label="Option 1" value="1"></${childTag}>
          <${childTag} name="myGroup[]" label="Option 2" value="2"></${childTag}>
        </${tag}>
      `)
        );

        const button = /**  @type {HTMLButtonElement} */ (await fixture(`<button>Blur</button>`));

        expect(el.touched).to.equal(false, 'initially, touched state is false');
        el.formElements[1].focus();
        expect(el.touched).to.equal(false, 'focus is on second checkbox');
        button.focus();
        expect(el.touched).to.equal(
          true,
          `focus is on element behind second checkbox (group has blurred)`,
        );
      });

      it(`becomes "touched" once the group as a whole becomes blurred via mouse interaction after
      keyboard interaction (e.g. focus is moved inside the group and user clicks somewhere outside
      the group)`, async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="input1"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `)
        );
        const el2 = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="input1"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `)
        );

        const outside = /**  @type {HTMLButtonElement} */ (
          await fixture(html`<button>outside</button>`)
        );

        outside.click();
        expect(el.touched, 'unfocused fieldset should stay untouched').to.be.false;

        el.formElements[0].focus();
        el.formElements[1].focus();
        expect(el.touched).to.be.false;

        outside.click(); // blur the group via a click
        outside.focus(); // a real mouse click moves focus as well
        expect(el.touched).to.be.true;
        expect(el2.touched).to.be.false;
      });

      it('potentially shows fieldset error message on interaction change', async () => {
        class Input1IsTen extends Validator {
          static get validatorName() {
            return 'Input1IsTen';
          }

          /**
           * @param {{ input1:number }} value
           */
          execute(value) {
            const hasError = value.input1 !== 10;
            return hasError;
          }
        }

        const outSideButton = /**  @type {FormGroup} */ (
          await fixture(html`<button>outside</button>`)
        );
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .validators=${[new Input1IsTen()]}>
          <${childTag} name="input1" .validators=${[new IsNumber()]}></${childTag}>
        </${tag}>
      `)
        );
        const input1 = /** @type {FormChild} */ (el.querySelector('[name=input1]'));
        input1.modelValue = 2;
        input1.focus();
        outSideButton.focus();

        await el.updateComplete;
        expect(el.validationStates.error.Input1IsTen).to.be.true;
        expect(el.showsFeedbackFor).to.deep.equal(['error']);
      });

      it('show error if tabbing "out" of last ', async () => {
        class Input1IsTen extends Validator {
          static get validatorName() {
            return 'Input1IsTen';
          }

          /** @param {?} value */
          execute(value) {
            const hasError = value.input1 !== 10;
            return hasError;
          }
        }
        const outSideButton = /**  @type {FormGroup} */ (
          await fixture(html`<button>outside</button>`)
        );
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .validators=${[new Input1IsTen()]}>
          <${childTag} name="input1" .validators=${[new IsNumber()]}></${childTag}>
          <${childTag} name="input2" .validators=${[new IsNumber()]}></${childTag}>
        </${tag}>
      `)
        );
        const inputs = /** @type {FormChild[]} */ (Array.from(el.querySelectorAll(childTagString)));
        inputs[1].modelValue = 2; // make it dirty
        inputs[1].focus();

        outSideButton.focus();

        expect(el.validationStates.error.Input1IsTen).to.be.true;
        expect(el.hasFeedbackFor).to.deep.equal(['error']);
      });

      it('does not become dirty when elements are prefilled', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .serializedValue="${{ input1: 'x', input2: 'y' }}">
          <${childTag} name="input1" ></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `)
        );
        expect(el.dirty).to.be.false;

        const el2 = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .modelValue="${{ input1: 'x', input2: 'y' }}">
          <${childTag} name="input1" ></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `)
        );
        expect(el2.dirty).to.be.false;
      });
    });

    // TODO: this should be tested in FormGroupMixin
    describe('serializedValue', () => {
      it('use form elements serializedValue', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        fieldset.formElements['hobbies[]'][0].serializer = /** @param {?} v */ v =>
          `${v.value}-serialized`;
        fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'Bar' };
        fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
        fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
        fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
        fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
        expect(fieldset.formElements['hobbies[]'][0].serializedValue).to.equal('Bar-serialized');
        expect(fieldset.serializedValue).to.deep.equal({
          'hobbies[]': ['Bar-serialized', { checked: false, value: 'rugby' }],
          'gender[]': [
            { checked: false, value: 'male' },
            { checked: false, value: 'female' },
          ],
          color: { checked: false, value: 'blue' },
        });
      });

      it('treats names with ending [] as arrays', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
        fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
        fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
        fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
        fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
        expect(fieldset.serializedValue).to.deep.equal({
          'hobbies[]': [
            { checked: false, value: 'chess' },
            { checked: false, value: 'rugby' },
          ],
          'gender[]': [
            { checked: false, value: 'male' },
            { checked: false, value: 'female' },
          ],
          color: { checked: false, value: 'blue' },
        });
      });

      it('0 is a valid value to be serialized', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`
      <${tag}>
        <${childTag} name="price"></${childTag}>
      </${tag}>`)
        );
        fieldset.formElements.price.modelValue = 0;
        expect(fieldset.serializedValue).to.deep.equal({ price: 0 });
      });

      it('allows for nested fieldsets', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} name="userData">
          <${childTag} name="comment"></${childTag}>
          <${tag} name="newfieldset">${inputSlots}</${tag}>
        </${tag}>
      `)
        );
        const newFieldset = /**  @type {FormGroup} */ (fieldset.querySelector(tagString));
        newFieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
        newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
        newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
        newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
        newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
        fieldset.formElements.comment.modelValue = 'Foo';
        // @ts-ignore
        expect(fieldset.formElements._keys().length).to.equal(2);
        // @ts-ignore
        expect(newFieldset.formElements._keys().length).to.equal(3);
        expect(fieldset.serializedValue).to.deep.equal({
          comment: 'Foo',
          newfieldset: {
            'hobbies[]': [
              { checked: false, value: 'chess' },
              { checked: false, value: 'rugby' },
            ],
            'gender[]': [
              { checked: false, value: 'male' },
              { checked: false, value: 'female' },
            ],
            color: { checked: false, value: 'blue' },
          },
        });
      });

      it('does not serialize disabled values', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="custom[]"></${childTag}>
          <${childTag} name="custom[]"></${childTag}>
        </${tag}>
      `)
        );
        fieldset.formElements['custom[]'][0].modelValue = 'custom 1';
        fieldset.formElements['custom[]'][1].disabled = true;

        expect(fieldset.serializedValue).to.deep.equal({
          'custom[]': ['custom 1'],
        });
      });

      it('will exclude form elements within a disabled fieldset', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} name="userData">
          <${childTag} name="comment"></${childTag}>
          <${tag} name="newfieldset">${inputSlots}</${tag}>
        </${tag}>
      `)
        );

        const newFieldset = /**  @type {FormGroup} */ (fieldset.querySelector(tagString));
        fieldset.formElements.comment.modelValue = 'Foo';
        newFieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
        newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
        newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
        newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
        newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
        newFieldset.formElements.color.disabled = true;

        expect(fieldset.serializedValue).to.deep.equal({
          comment: 'Foo',
          newfieldset: {
            'hobbies[]': [
              { checked: false, value: 'chess' },
              { checked: false, value: 'rugby' },
            ],
            'gender[]': [
              { checked: false, value: 'male' },
              { checked: false, value: 'female' },
            ],
          },
        });

        newFieldset.formElements.color.disabled = false;
        expect(fieldset.serializedValue).to.deep.equal({
          comment: 'Foo',
          newfieldset: {
            'hobbies[]': [
              { checked: false, value: 'chess' },
              { checked: false, value: 'rugby' },
            ],
            'gender[]': [
              { checked: false, value: 'male' },
              { checked: false, value: 'female' },
            ],
            color: { checked: false, value: 'blue' },
          },
        });
      });

      it('updates the formElements keys when a name attribute changes', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`
          <${tag}>
            <${childTag} name="foo" .modelValue=${'qux'}></${childTag}>
          </${tag}>
        `)
        );
        expect(fieldset.serializedValue.foo).to.equal('qux');
        fieldset.formElements[0].name = 'bar';
        await fieldset.updateComplete;
        await fieldset.formElements[0].updateComplete;
        expect(fieldset.serializedValue.bar).to.equal('qux');
      });
    });

    describe('Reset', () => {
      it('restores default values if changes were made', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} id="firstName" name="firstName" .modelValue="${'Foo'}"></${childTag}>
        </${tag}>
      `)
        );
        await /** @type {FormChild} */ (el.querySelector(childTagString)).updateComplete;

        const input = /** @type {FormChild} */ (el.querySelector('#firstName'));

        input.modelValue = 'Bar';
        expect(el.modelValue).to.deep.equal({ firstName: 'Bar' });
        expect(input.modelValue).to.equal('Bar');

        el.resetGroup();
        expect(el.modelValue).to.deep.equal({ firstName: 'Foo' });
        expect(input.modelValue).to.equal('Foo');
      });

      it('restores default values of arrays if changes were made', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} id="firstName" name="firstName[]" .modelValue="${'Foo'}"></${childTag}>
        </${tag}>
      `)
        );
        await /** @type {FormChild} */ (el.querySelector(childTagString)).updateComplete;

        const input = /**  @type {FormChild} */ (el.querySelector('#firstName'));

        input.modelValue = 'Bar';
        expect(el.modelValue).to.deep.equal({ 'firstName[]': ['Bar'] });
        expect(input.modelValue).to.equal('Bar');

        el.resetGroup();
        expect(el.modelValue).to.deep.equal({ 'firstName[]': ['Foo'] });
        expect(input.modelValue).to.equal('Foo');
      });

      it('restores default values of a nested fieldset if changes were made', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${tag} id="name" name="name[]">
            <${childTag} id="firstName" name="firstName" .modelValue="${'Foo'}"></${childTag}>
          </${tag}>
        </${tag}>
      `)
        );
        await Promise.all([
          /**  @type {FormChild} */ (el.querySelector(tagString)).updateComplete,
          /** @type {FormChild} */ (el.querySelector(childTagString)).updateComplete,
        ]);

        const input = /**  @type {FormChild} */ (el.querySelector('#firstName'));
        const nestedFieldset = /**  @type {FormGroup} */ (el.querySelector('#name'));

        input.modelValue = 'Bar';
        expect(el.modelValue).to.deep.equal({ 'name[]': [{ firstName: 'Bar' }] });
        expect(nestedFieldset.modelValue).to.deep.equal({ firstName: 'Bar' });
        expect(input.modelValue).to.equal('Bar');

        el.resetGroup();
        expect(el.modelValue).to.deep.equal({ 'name[]': [{ firstName: 'Foo' }] });
        expect(nestedFieldset.modelValue).to.deep.equal({ firstName: 'Foo' });
        expect(input.modelValue).to.equal('Foo');
      });

      it('clears interaction state', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`<${tag} touched dirty>${inputSlots}</${tag}>`)
        );
        // Safety check initially
        // @ts-ignore [allow-protected] in test
        el._setValueForAllFormElements('prefilled', true);
        expect(el.dirty).to.equal(true, '"dirty" initially');
        expect(el.touched).to.equal(true, '"touched" initially');
        expect(el.prefilled).to.equal(true, '"prefilled" initially');

        // Reset all children states, with prefilled false
        // @ts-ignore [allow-protected] in test
        el._setValueForAllFormElements('modelValue', {});
        el.resetInteractionState();
        expect(el.dirty).to.equal(false, 'not "dirty" after reset');
        expect(el.touched).to.equal(false, 'not "touched" after reset');
        expect(el.prefilled).to.equal(false, 'not "prefilled" after reset');

        // Reset all children states with prefilled true
        // @ts-ignore [allow-protected] in test
        el._setValueForAllFormElements('modelValue', { checked: true }); // not prefilled
        el.resetInteractionState();
        expect(el.dirty).to.equal(false, 'not "dirty" after 2nd reset');
        expect(el.touched).to.equal(false, 'not "touched" after 2nd reset');
        // prefilled state is dependant on value
        expect(el.prefilled).to.equal(true, '"prefilled" after 2nd reset');
      });

      it('clears submitted state', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        fieldset.submitted = true;
        fieldset.resetGroup();
        expect(fieldset.submitted).to.equal(false);
        fieldset.formElements.forEach(el => {
          expect(el.submitted).to.equal(false);
        });
      });

      it('has correct validation afterwards', async () => {
        class IsCat extends Validator {
          static get validatorName() {
            return 'IsCat';
          }

          /**
           * @param {string} value
           */
          execute(value) {
            const hasError = value !== 'cat';
            return hasError;
          }
        }
        class ColorContainsA extends Validator {
          static get validatorName() {
            return 'ColorContainsA';
          }

          /**
           * @param {{ [x:string]:any }} value
           */
          execute(value) {
            let hasError = true;
            if (value && value.color) {
              hasError = value.color.indexOf('a') === -1;
            }
            return hasError;
          }
        }

        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag} .validators=${[new ColorContainsA()]}>
          <${childTag} name="color" .validators=${[new IsCat()]}></${childTag}>
          <${childTag} name="color2"></${childTag}>
        </${tag}>
      `)
        );
        expect(el.hasFeedbackFor).to.deep.equal(['error']);
        expect(el.validationStates.error.ColorContainsA).to.be.true;
        expect(el.formElements.color.hasFeedbackFor).to.deep.equal([]);

        el.formElements.color.modelValue = 'onlyb';
        expect(el.hasFeedbackFor).to.deep.equal(['error']);
        expect(el.validationStates.error.ColorContainsA).to.be.true;
        expect(el.formElements.color.validationStates.error.IsCat).to.be.true;

        el.formElements.color.modelValue = 'cat';
        expect(el.hasFeedbackFor).to.deep.equal([]);

        el.resetGroup();
        expect(el.hasFeedbackFor).to.deep.equal(['error']);
        expect(el.validationStates.error.ColorContainsA).to.be.true;
        expect(el.formElements.color.hasFeedbackFor).to.deep.equal([]);
      });

      it('has access to `_initialModelValue` based on initial children states', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="child[]" .modelValue="${'foo1'}">
          </${childTag}>
          <${childTag} name="child[]" .modelValue="${'bar1'}">
          </${childTag}>
        </${tag}>
      `)
        );
        await el.updateComplete;
        el.modelValue['child[]'] = ['foo2', 'bar2'];
        // @ts-ignore [allow-protected] in test
        expect(el._initialModelValue['child[]']).to.eql(['foo1', 'bar1']);
      });

      it('does not wrongly recompute `_initialModelValue` after dynamic changes of children', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <${childTag} name="child[]" .modelValue="${'foo1'}">
          </${childTag}>
        </${tag}>
      `)
        );
        el.modelValue['child[]'] = ['foo2'];
        const childEl = /**  @type {FormGroup} */ (
          await fixture(html`
        <${childTag} name="child[]" .modelValue="${'bar1'}">
        </${childTag}>
      `)
        );
        el.appendChild(childEl);
        // @ts-ignore [allow-protected] in test
        expect(el._initialModelValue['child[]']).to.eql(['foo1', 'bar1']);
      });

      describe('resetGroup method', () => {
        it('calls resetGroup on children fieldsets', async () => {
          const el = /**  @type {FormGroup} */ (
            await fixture(html`
          <${tag} name="parentFieldset">
            <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `)
          );
          const childFieldsetEl = el.querySelector(tagString);
          // @ts-expect-error
          const resetGroupSpy = sinon.spy(childFieldsetEl, 'resetGroup');
          el.resetGroup();
          expect(resetGroupSpy.callCount).to.equal(1);
        });

        it('calls reset on children fields', async () => {
          const el = /**  @type {FormGroup} */ (
            await fixture(html`
          <${tag} name="parentFieldset">
            <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `)
          );
          const childFieldsetEl = /** @type {FormChild} */ (el.querySelector(childTagString));
          const resetSpy = sinon.spy(childFieldsetEl, 'reset');
          el.resetGroup();
          expect(resetSpy.callCount).to.equal(1);
        });
      });

      describe('clearGroup method', () => {
        it('calls clearGroup on children fieldset', async () => {
          const el = /**  @type {FormGroup} */ (
            await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `)
          );
          const childFieldsetEl = el.querySelector(tagString);
          // @ts-expect-error
          const clearGroupSpy = sinon.spy(childFieldsetEl, 'clearGroup');
          el.clearGroup();
          expect(clearGroupSpy.callCount).to.equal(1);
        });

        it('calls clear on children fields', async () => {
          const el = /**  @type {FormGroup} */ (
            await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `)
          );
          const childFieldsetEl = /** @type {FormChild} */ (el.querySelector(childTagString));
          const clearSpy = sinon.spy(childFieldsetEl, 'clear');
          el.clearGroup();
          expect(clearSpy.callCount).to.equal(1);
        });

        it('should clear the value of  fields', async () => {
          const el = /**  @type {FormGroup} */ (
            await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `)
          );
          el.clearGroup();
          expect(
            /**  @type {FormChild} */ (el.querySelector('[name="child"]')).modelValue,
          ).to.equal('');
        });
      });
    });

    describe('Accessibility', () => {
      it('has role="group" set', async () => {
        const fieldset = /**  @type {FormGroup} */ (
          await fixture(html`<${tag}>${inputSlots}</${tag}>`)
        );
        fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
        fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
        fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
        fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
        fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
        expect(fieldset.hasAttribute('role')).to.be.true;
        expect(fieldset.getAttribute('role')).to.contain('group');
      });

      it('has an aria-labelledby from element with slot="label"', async () => {
        const el = /**  @type {FormGroup} */ (
          await fixture(html`
        <${tag}>
          <label slot="label">My Label</label>
          ${inputSlots}
        </${tag}>
      `)
        );
        const label = /** @type {HTMLElement} */ (
          Array.from(el.children).find(child => child.slot === 'label')
        );
        expect(el.hasAttribute('aria-labelledby')).to.equal(true);
        expect(el.getAttribute('aria-labelledby')).contains(label.id);
      });
    });

    describe('Dynamically rendered children', () => {
      class DynamicCWrapper extends LitElement {
        static get properties() {
          return {
            fields: { type: Array },
          };
        }

        constructor() {
          super();
          /** @type {any[]} */
          this.fields = [];
          /** @type {object|undefined} */
          this.modelValue = undefined;
          /** @type {object|undefined} */
          this.serializedValue = undefined;
        }

        render() {
          return html`
              <${tag}
              .modelValue=${this.modelValue}
              .serializedValue=${this.serializedValue}>
                ${this.fields.map(field => {
                  if (typeof field === 'object') {
                    return html`<${childTag} name="${field.name}" .modelValue="${field.value}"></${childTag}>`;
                  }
                  return html`<${childTag} name="${field}"></${childTag}>`;
                })}
              </${tag}>
            `;
        }
      }
      const dynamicChildrenTagString = defineCE(DynamicCWrapper);
      const dynamicChildrenTag = unsafeStatic(dynamicChildrenTagString);

      it(`when rendering children right from the start, sets their values correctly
      based on prefilled model/seriazedValue`, async () => {
        const el = /** @type {DynamicCWrapper} */ (
          await fixture(html`
          <${dynamicChildrenTag}
            .fields="${['firstName', 'lastName']}"
            .modelValue="${{ firstName: 'foo', lastName: 'bar' }}"
            >
          </${dynamicChildrenTag}>
        `)
        );
        await el.updateComplete;
        const fieldset = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(tagString)
        );
        expect(fieldset.formElements[0].modelValue).to.equal('foo');
        expect(fieldset.formElements[1].modelValue).to.equal('bar');

        const el2 = /** @type {DynamicCWrapper} */ (
          await fixture(html`
          <${dynamicChildrenTag}
            .fields="${['firstName', 'lastName']}"
            .serializedValue="${{ firstName: 'foo', lastName: 'bar' }}"
            >
          </${dynamicChildrenTag}>
        `)
        );
        await el2.updateComplete;
        const fieldset2 = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el2.shadowRoot).querySelector(tagString)
        );
        expect(fieldset2.formElements[0].serializedValue).to.equal('foo');
        expect(fieldset2.formElements[1].serializedValue).to.equal('bar');
      });

      it(`when rendering children delayed, sets their values
      correctly based on prefilled model/seriazedValue`, async () => {
        const el = /** @type {DynamicCWrapper} */ (
          await fixture(html`
          <${dynamicChildrenTag} .modelValue="${{ firstName: 'foo', lastName: 'bar' }}">
          </${dynamicChildrenTag}>
        `)
        );
        await el.updateComplete;
        const fieldset = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(tagString)
        );
        el.fields = ['firstName', 'lastName'];
        await el.updateComplete;
        expect(fieldset.formElements[0].modelValue).to.equal('foo');
        expect(fieldset.formElements[1].modelValue).to.equal('bar');

        const el2 = /** @type {DynamicCWrapper} */ (
          await fixture(html`
          <${dynamicChildrenTag} .serializedValue="${{ firstName: 'foo', lastName: 'bar' }}">
          </${dynamicChildrenTag}>
        `)
        );
        await el2.updateComplete;
        const fieldset2 = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el2.shadowRoot).querySelector(tagString)
        );
        el2.fields = ['firstName', 'lastName'];
        await el2.updateComplete;
        expect(fieldset2.formElements[0].serializedValue).to.equal('foo');
        expect(fieldset2.formElements[1].serializedValue).to.equal('bar');
      });

      it(`when rendering children partly delayed, sets their values correctly based on
      prefilled model/seriazedValue`, async () => {
        const el = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag} .fields="${['firstName']}" .modelValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el.updateComplete;
        const fieldset = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(tagString)
        );
        el.fields = ['firstName', 'lastName'];
        await el.updateComplete;
        expect(fieldset.formElements[0].modelValue).to.equal('foo');
        expect(fieldset.formElements[1].modelValue).to.equal('bar');

        const el2 = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag} .fields="${['firstName']}" .serializedValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el2.updateComplete;
        const fieldset2 = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el2.shadowRoot).querySelector(tagString)
        );
        el2.fields = ['firstName', 'lastName'];
        await el2.updateComplete;
        expect(fieldset2.formElements[0].serializedValue).to.equal('foo');
        expect(fieldset2.formElements[1].serializedValue).to.equal('bar');
      });

      it(`does not change interaction states when values set for delayed children`, async () => {
        function expectInteractionStatesToBeCorrectFor(/** @type {FormChild|FormGroup} */ elm) {
          expect(Boolean(elm.submitted)).to.be.false;
          expect(elm.dirty).to.be.false;
          expect(elm.touched).to.be.false;
          expect(elm.prefilled).to.be.true;
        }

        const el = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag} .fields="${['firstName']}" .modelValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el.updateComplete;
        const fieldset = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(tagString)
        );
        await fieldset.registrationComplete;

        el.fields = ['firstName', 'lastName'];
        await el.updateComplete;
        expectInteractionStatesToBeCorrectFor(fieldset.formElements[0]);
        expectInteractionStatesToBeCorrectFor(fieldset.formElements[1]);
        expectInteractionStatesToBeCorrectFor(fieldset);

        const el2 = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag} .fields="${['firstName']}" .serializedValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el2.updateComplete;
        const fieldset2 = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el2.shadowRoot).querySelector(tagString)
        );
        await fieldset2.registrationComplete;

        el2.fields = ['firstName', 'lastName'];
        await el2.updateComplete;
        expectInteractionStatesToBeCorrectFor(fieldset2.formElements[0]);
        expectInteractionStatesToBeCorrectFor(fieldset2.formElements[1]);
        expectInteractionStatesToBeCorrectFor(fieldset2);
      });

      it(`prefilled children values take precedence over parent values`, async () => {
        const el = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag}  .modelValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el.updateComplete;
        const fieldset = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(tagString)
        );
        el.fields = [
          { name: 'firstName', value: 'wins' },
          { name: 'lastName', value: 'winsAsWell' },
        ];
        await el.updateComplete;
        expect(fieldset.formElements[0].modelValue).to.equal('wins');
        expect(fieldset.formElements[1].modelValue).to.equal('winsAsWell');

        const el2 = /** @type {DynamicCWrapper} */ (
          await fixture(html`
        <${dynamicChildrenTag} .serializedValue="${{
            firstName: 'foo',
            lastName: 'bar',
          }}">
        </${dynamicChildrenTag}>
      `)
        );
        await el2.updateComplete;
        const fieldset2 = /** @type {FormGroup} */ (
          /** @type {ShadowRoot} */ (el2.shadowRoot).querySelector(tagString)
        );
        el2.fields = [
          { name: 'firstName', value: 'wins' },
          { name: 'lastName', value: 'winsAsWell' },
        ];
        await el2.updateComplete;
        expect(fieldset2.formElements[0].serializedValue).to.equal('wins');
        expect(fieldset2.formElements[1].serializedValue).to.equal('winsAsWell');
      });
    });
  });
}
