import { LionField, IsNumber, Validator } from '@lion/form-core';
import '@lion/form-core/lion-field.js';
import { formFixture as fixture } from '@lion/form-core/test-helpers.js';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import {
  defineCE,
  expect,
  fixtureSync,
  html,
  nextFrame,
  triggerFocusFor,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';
import '../lion-fieldset.js';

const childTagString = defineCE(
  class extends LionField {
    get slots() {
      return {
        input: () => document.createElement('input'),
      };
    }
  },
);

const tagString = 'lion-fieldset';
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

// TODO: seperate fieldset and FormGroup tests
describe('<lion-fieldset>', () => {
  // TODO: Tests below belong to FormControlMixin. Preferably run suite integration test
  it(`has a fieldName based on the label`, async () => {
    const el1 = await fixture(html`<${tag} label="foo">${inputSlots}</${tag}>`);
    expect(el1.fieldName).to.equal(el1._labelNode.textContent);

    const el2 = await fixture(html`<${tag}><label slot="label">bar</label>${inputSlots}</${tag}>`);
    expect(el2.fieldName).to.equal(el2._labelNode.textContent);
  });

  it(`has a fieldName based on the name if no label exists`, async () => {
    const el = await fixture(html`<${tag} name="foo">${inputSlots}</${tag}>`);
    expect(el.fieldName).to.equal(el.name);
  });

  it(`can override fieldName`, async () => {
    const el = await fixture(
      html`<${tag} label="foo" .fieldName="${'bar'}">${inputSlots}</${tag}>`,
    );
    expect(el.__fieldName).to.equal(el.fieldName);
  });

  // TODO: Tests below belong to FormRegistrarMixin. Preferably run suite integration test
  it(`${tagString} has an up to date list of every form element in .formElements`, async () => {
    const el = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
    await nextFrame();
    expect(el.formElements.keys().length).to.equal(3);
    expect(el.formElements['hobbies[]'].length).to.equal(2);
    el.removeChild(el.formElements['hobbies[]'][0]);
    expect(el.formElements.keys().length).to.equal(3);
    expect(el.formElements['hobbies[]'].length).to.equal(1);
  });

  it(`supports in html wrapped form elements`, async () => {
    const el = await fixture(html`
      <${tag}>
        <div>
          <${childTag} name="foo"></${childTag}>
        </div>
      </${tag}>
    `);
    await nextFrame();
    expect(el.formElements.length).to.equal(1);
    el.children[0].removeChild(el.formElements.foo);
    expect(el.formElements.length).to.equal(0);
  });

  it('handles names with ending [] as an array', async () => {
    const el = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
    await nextFrame();
    el.formElements['gender[]'][0].modelValue = { value: 'male' };
    el.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
    el.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };

    expect(el.formElements.keys().length).to.equal(3);
    expect(el.formElements['hobbies[]'].length).to.equal(2);
    expect(el.formElements['hobbies[]'][0].modelValue.value).to.equal('chess');
    expect(el.formElements['gender[]'][0].modelValue.value).to.equal('male');
    expect(el.modelValue['hobbies[]']).to.deep.equal([
      { checked: false, value: 'chess' },
      { checked: false, value: 'rugby' },
    ]);
  });

  it('throws if an element without a name tries to register', async () => {
    const orig = console.info;
    console.info = () => {};

    let error = false;
    const el = await fixture(html`<${tag}></${tag}>`);
    try {
      // we test the api directly as errors thrown from a web component are in a
      // different context and we can not catch them here => register fake elements
      el.addFormElement({});
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(TypeError);
    expect(error.message).to.equal('You need to define a name');

    console.info = orig; // restore original console
  });

  it('throws if name is the same as its parent', async () => {
    const orig = console.info;
    console.info = () => {};

    let error = false;
    const el = await fixture(html`<${tag} name="foo"></${tag}>`);
    try {
      // we test the api directly as errors thrown from a web component are in a
      // different context and we can not catch them here => register fake elements
      el.addFormElement({ name: 'foo' });
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(TypeError);
    expect(error.message).to.equal('You can not have the same name "foo" as your parent');

    console.info = orig; // restore original console
  });

  it('throws if same name without ending [] is used', async () => {
    const orig = console.info;
    console.info = () => {};

    let error = false;
    const el = await fixture(html`<${tag}></${tag}>`);
    try {
      // we test the api directly as errors thrown from a web component are in a
      // different context and we can not catch them here => register fake elements
      el.addFormElement({ name: 'fooBar' });
      el.addFormElement({ name: 'fooBar' });
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(TypeError);
    expect(error.message).to.equal(
      'Name "fooBar" is already registered - if you want an array add [] to the end',
    );

    console.info = orig; // restore original console
  });
  /* eslint-enable no-console */

  it('can dynamically add/remove elements', async () => {
    const el = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
    const newField = await fixture(html`<${childTag} name="lastName"></${childTag}>`);

    expect(el.formElements.keys().length).to.equal(3);

    el.appendChild(newField);
    expect(el.formElements.keys().length).to.equal(4);

    el._inputNode.removeChild(newField);
    expect(el.formElements.keys().length).to.equal(3);
  });

  // TODO: Tests below belong to FormGroupMixin. Preferably run suite integration test

  it('can read/write all values (of every input) via this.modelValue', async () => {
    const el = await fixture(html`
      <${tag}>
        <${childTag} name="lastName"></${childTag}>
        <${tag} name="newfieldset">${inputSlots}</${tag}>
      </${tag}>
    `);
    await el.registrationReady;
    const newFieldset = el.querySelector('lion-fieldset');
    await newFieldset.registrationReady;
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

  it('does not list disabled values in this.modelValue', async () => {
    const el = await fixture(html`
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
    `);
    await el.registrationReady;
    const newFieldset = el.querySelector('lion-fieldset');
    await newFieldset.registrationReady;

    expect(el.modelValue).to.deep.equal({
      b: 'x',
      newFieldset: {
        c: 'x',
      },
    });
  });

  it('does not throw if setter data of this.modelValue can not be handled', async () => {
    const el = await fixture(html`
      <${tag}>
        <${childTag} name="firstName" .modelValue=${'foo'}></${childTag}>
        <${childTag} name="lastName" .modelValue=${'bar'}></${childTag}>
      </${tag}>
    `);
    await nextFrame();
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
    const el = await fixture(html`<${tag} disabled>${inputSlots}</${tag}>`);
    await nextFrame();
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
    const el = await fixture(
      html`<${tag}>
  <${tag} name="sub" disabled>${inputSlots}</${tag}>
</${tag}>`,
    );
    await el.updateComplete;
    expect(el.disabled).to.equal(false);
    expect(el.formElements.sub.disabled).to.be.true;
    expect(el.formElements.sub.formElements.color.disabled).to.be.true;
    expect(el.formElements.sub.formElements['hobbies[]'][0].disabled).to.be.true;
    expect(el.formElements.sub.formElements['hobbies[]'][1].disabled).to.be.true;
  });

  it('can set initial modelValue on creation', async () => {
    const initialModelValue = {
      lastName: 'Bar',
    };
    const el = await fixture(html`
      <${tag} .modelValue=${initialModelValue}>
        <${childTag} name="lastName"></${childTag}>
      </${tag}>
    `);

    await el.registrationReady;
    await el.updateComplete;
    expect(el.modelValue).to.eql(initialModelValue);
  });

  it('can set initial serializedValue on creation', async () => {
    const initialSerializedValue = {
      lastName: 'Bar',
    };
    const el = await fixture(html`
      <${tag} .modelValue=${initialSerializedValue}>
        <${childTag} name="lastName"></${childTag}>
      </${tag}>
    `);

    await el.registrationReady;
    await el.updateComplete;
    expect(el.modelValue).to.eql(initialSerializedValue);
  });

  describe('Validation', () => {
    it('validates on init', async () => {
      class IsCat extends Validator {
        static get validatorName() {
          return 'IsCat';
        }

        execute(value) {
          const hasError = value !== 'cat';
          return hasError;
        }
      }

      const el = await fixture(html`
        <${tag}>
          <${childTag} name="color" .validators=${[
        new IsCat(),
      ]} .modelValue=${'blue'}></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      expect(el.formElements.color.validationStates.error.IsCat).to.be.true;
    });

    it('validates when a value changes', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
      const spy = sinon.spy(fieldset, 'validate');
      fieldset.formElements.color.modelValue = { checked: true, value: 'red' };
      expect(spy.callCount).to.equal(1);
    });

    it('has a special validator for all children - can be checked via this.error.FormElementsHaveNoError', async () => {
      class IsCat extends Validator {
        static get validatorName() {
          return 'IsCat';
        }

        execute(value) {
          const hasError = value !== 'cat';
          return hasError;
        }
      }

      const el = await fixture(html`
        <${tag}>
          <${childTag} name="color" .validators=${[
        new IsCat(),
      ]} .modelValue=${'blue'}></${childTag}>
        </${tag}>
      `);
      await nextFrame();

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

        execute(value) {
          const hasError = Object.keys(value).length % 2 !== 0;
          return hasError;
        }
      }
      const el = await fixture(html`
        <${tag} .validators=${[new HasEvenNumberOfChildren()]}>
          <${childTag} id="c1" name="c1"></${childTag}>
        </${tag}>
      `);
      const child2 = await fixture(html`
        <${childTag} name="c2"></${childTag}>
      `);
      await nextFrame();
      expect(el.validationStates.error.HasEvenNumberOfChildren).to.be.true;

      el.appendChild(child2);
      await nextFrame();
      expect(el.validationStates.error.HasEvenNumberOfChildren).to.equal(undefined);

      el.removeChild(child2);
      await nextFrame();
      expect(el.validationStates.error.HasEvenNumberOfChildren).to.be.true;

      // Edge case: remove all children
      el.removeChild(el.querySelector('[id=c1]'));
      await nextFrame();

      expect(el.validationStates.error.HasEvenNumberOfChildren).to.equal(undefined);
    });
  });

  describe('Interaction states', () => {
    it('has false states (dirty, touched, prefilled) on init', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
      expect(fieldset.dirty).to.equal(false, 'dirty');
      expect(fieldset.touched).to.equal(false, 'touched');
      expect(fieldset.prefilled).to.equal(false, 'prefilled');
    });

    it('sets dirty when value changed', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'football' };
      expect(fieldset.dirty).to.be.true;
    });

    it('sets touched when last field in fieldset left after focus', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await triggerFocusFor(fieldset.formElements['hobbies[]'][0]._inputNode);
      await triggerFocusFor(
        fieldset.formElements['hobbies[]'][fieldset.formElements['gender[]'].length - 1]._inputNode,
      );
      const el = await fixture(html`<button></button>`);
      el.focus();

      expect(fieldset.touched).to.be.true;
    });

    it('sets attributes [touched][dirty]', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      el.touched = true;
      await el.updateComplete;
      expect(el).to.have.attribute('touched');

      el.dirty = true;
      await el.updateComplete;
      expect(el).to.have.attribute('dirty');
    });

    it('becomes prefilled if all form elements are prefilled', async () => {
      const el = await fixture(html`
        <${tag}>
          <${childTag} name="input1" .modelValue="${'prefilled'}"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      expect(el.prefilled).to.be.false;

      const el2 = await fixture(html`
        <${tag}>
          <${childTag} name="input1" .modelValue="${'prefilled'}"></${childTag}>
          <${childTag} name="input2" .modelValue="${'prefilled'}"></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      expect(el2.prefilled).to.be.true;
    });

    it(`becomes "touched" once the last element of a group becomes blurred by keyboard
      interaction (e.g. tabbing through the checkbox-group)`, async () => {
      const el = await fixture(html`
        <${tag}>
          <label slot="label">My group</label>
          <${childTag} name="myGroup[]" label="Option 1" value="1"></${childTag}>
          <${childTag} name="myGroup[]" label="Option 2" value="2"></${childTag}>
        </${tag}>
      `);
      await nextFrame();

      const button = await fixture(`<button>Blur</button>`);

      expect(el.touched).to.equal(false, 'initially, touched state is false');
      el.children[2].focus();
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
      const el = await fixture(html`
        <${tag}>
          <${childTag} name="input1"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `);
      const el2 = await fixture(html`
        <${tag}>
          <${childTag} name="input1"></${childTag}>
          <${childTag} name="input2"></${childTag}>
        </${tag}>
      `);

      await nextFrame();
      const outside = await fixture(html`<button>outside</button>`);

      outside.click();
      expect(el.touched, 'unfocused fieldset should stay untouched').to.be.false;

      el.children[1].focus();
      el.children[2].focus();
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

        execute(value) {
          const hasError = value.input1 !== 10;
          return hasError;
        }
      }

      const outSideButton = await fixture(html`<button>outside</button>`);
      const el = await fixture(html`
        <${tag} .validators=${[new Input1IsTen()]}>
          <${childTag} name="input1" .validators=${[new IsNumber()]}></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      const input1 = el.querySelector(childTagString);
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

        execute(value) {
          const hasError = value.input1 !== 10;
          return hasError;
        }
      }
      const outSideButton = await fixture(html`<button>outside</button>`);
      const el = await fixture(html`
        <${tag} .validators=${[new Input1IsTen()]}>
          <${childTag} name="input1" .validators=${[new IsNumber()]}></${childTag}>
          <${childTag} name="input2" .validators=${[new IsNumber()]}></${childTag}>
        </${tag}>
      `);
      const inputs = el.querySelectorAll(childTagString);
      inputs[1].modelValue = 2; // make it dirty
      inputs[1].focus();

      outSideButton.focus();
      await nextFrame();

      expect(el.validationStates.error.Input1IsTen).to.be.true;
      expect(el.hasFeedbackFor).to.deep.equal(['error']);
    });

    it('(re)initializes children interaction states on registration ready', async () => {
      const fieldset = await fixtureSync(html`
      <${tag} .modelValue="${{ a: '1', b: '2' }}">
        <${childTag} name="a"></${childTag}>
        <${childTag} name="b"></${childTag}>
      </${tag}>`);
      const childA = fieldset.querySelector('[name="a"]');
      const childB = fieldset.querySelector('[name="b"]');
      const spyA = sinon.spy(childA, 'initInteractionState');
      const spyB = sinon.spy(childB, 'initInteractionState');
      expect(fieldset.prefilled).to.be.false;
      expect(fieldset.dirty).to.be.false;
      await fieldset.registrationReady;
      await nextFrame();
      expect(spyA).to.have.been.called;
      expect(spyB).to.have.been.called;
      expect(fieldset.prefilled).to.be.true;
      expect(fieldset.dirty).to.be.false;
    });
  });

  // TODO: this should be tested in FormGroupMixin
  describe('serializedValue', () => {
    it('use form elements serializedValue', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].serializer = v => `${v.value}-serialized`;
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
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
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
      const fieldset = await fixture(html`
      <${tag}>
        <${childTag} name="price"></${childTag}>
      </${tag}>`);
      await nextFrame();
      fieldset.formElements.price.modelValue = 0;
      expect(fieldset.serializedValue).to.deep.equal({ price: 0 });
    });

    it('serializes undefined values as ""(nb radios/checkboxes are always serialized)', async () => {
      const fieldset = await fixture(html`
        <${tag}>
          <${childTag} name="custom[]"></${childTag}>
          <${childTag} name="custom[]"></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      fieldset.formElements['custom[]'][0].modelValue = 'custom 1';
      fieldset.formElements['custom[]'][1].modelValue = undefined;

      expect(fieldset.serializedValue).to.deep.equal({
        'custom[]': ['custom 1', ''],
      });
    });

    it('allows for nested fieldsets', async () => {
      const fieldset = await fixture(html`
        <${tag} name="userData">
          <${childTag} name="comment"></${childTag}>
          <${tag} name="newfieldset">${inputSlots}</${tag}>
        </${tag}>
      `);
      await nextFrame();
      const newFieldset = fieldset.querySelector('lion-fieldset');
      newFieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      fieldset.formElements.comment.modelValue = 'Foo';
      expect(fieldset.formElements.keys().length).to.equal(2);
      expect(newFieldset.formElements.keys().length).to.equal(3);
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
      const fieldset = await fixture(html`
        <${tag}>
          <${childTag} name="custom[]"></${childTag}>
          <${childTag} name="custom[]"></${childTag}>
        </${tag}>
      `);
      await nextFrame();
      fieldset.formElements['custom[]'][0].modelValue = 'custom 1';
      fieldset.formElements['custom[]'][1].disabled = true;

      expect(fieldset.serializedValue).to.deep.equal({
        'custom[]': ['custom 1'],
      });
    });

    it('will exclude form elements within a disabled fieldset', async () => {
      const fieldset = await fixture(html`
        <${tag} name="userData">
          <${childTag} name="comment"></${childTag}>
          <${tag} name="newfieldset">${inputSlots}</${tag}>
        </${tag}>
      `);
      await nextFrame();

      const newFieldset = fieldset.querySelector('lion-fieldset');
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
  });

  describe('Reset', () => {
    it('restores default values if changes were made', async () => {
      const el = await fixture(html`
        <${tag}>
          <${childTag} id="firstName" name="firstName" .modelValue="${'Foo'}"></${childTag}>
        </${tag}>
      `);
      await el.querySelector(childTagString).updateComplete;

      const input = el.querySelector('#firstName');

      input.modelValue = 'Bar';
      expect(el.modelValue).to.deep.equal({ firstName: 'Bar' });
      expect(input.modelValue).to.equal('Bar');

      el.resetGroup();
      expect(el.modelValue).to.deep.equal({ firstName: 'Foo' });
      expect(input.modelValue).to.equal('Foo');
    });

    it('restores default values of arrays if changes were made', async () => {
      const el = await fixture(html`
        <${tag}>
          <${childTag} id="firstName" name="firstName[]" .modelValue="${'Foo'}"></${childTag}>
        </${tag}>
      `);
      await el.querySelector(childTagString).updateComplete;

      const input = el.querySelector('#firstName');

      input.modelValue = 'Bar';
      expect(el.modelValue).to.deep.equal({ 'firstName[]': ['Bar'] });
      expect(input.modelValue).to.equal('Bar');

      el.resetGroup();
      expect(el.modelValue).to.deep.equal({ 'firstName[]': ['Foo'] });
      expect(input.modelValue).to.equal('Foo');
    });

    it('restores default values of a nested fieldset if changes were made', async () => {
      const el = await fixture(html`
        <${tag}>
          <${tag} id="name" name="name[]">
            <${childTag} id="firstName" name="firstName" .modelValue="${'Foo'}"></${childTag}>
          </${tag}>
        </${tag}>
      `);
      await Promise.all([
        el.querySelector('lion-fieldset').updateComplete,
        el.querySelector(childTagString).updateComplete,
      ]);

      const input = el.querySelector('#firstName');
      const nestedFieldset = el.querySelector('#name');

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
      const el = await fixture(html`<${tag} touched dirty>${inputSlots}</${tag}>`);
      await nextFrame();
      // Safety check initially
      el._setValueForAllFormElements('prefilled', true);
      expect(el.dirty).to.equal(true, '"dirty" initially');
      expect(el.touched).to.equal(true, '"touched" initially');
      expect(el.prefilled).to.equal(true, '"prefilled" initially');

      // Reset all children states, with prefilled false
      el._setValueForAllFormElements('modelValue', {});
      el.resetInteractionState();
      expect(el.dirty).to.equal(false, 'not "dirty" after reset');
      expect(el.touched).to.equal(false, 'not "touched" after reset');
      expect(el.prefilled).to.equal(false, 'not "prefilled" after reset');

      // Reset all children states with prefilled true
      el._setValueForAllFormElements('modelValue', { checked: true }); // not prefilled
      el.resetInteractionState();
      expect(el.dirty).to.equal(false, 'not "dirty" after 2nd reset');
      expect(el.touched).to.equal(false, 'not "touched" after 2nd reset');
      // prefilled state is dependant on value
      expect(el.prefilled).to.equal(true, '"prefilled" after 2nd reset');
    });

    it('clears submitted state', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
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

        execute(value) {
          const hasError = value !== 'cat';
          return hasError;
        }
      }
      class ColorContainsA extends Validator {
        static get validatorName() {
          return 'ColorContainsA';
        }

        execute(value) {
          const hasError = value.color.indexOf('a') === -1;
          return hasError;
        }
      }

      const el = await fixture(html`
        <${tag} .validators=${[new ColorContainsA()]}>
          <${childTag} name="color" .validators=${[new IsCat()]}></${childTag}>
          <${childTag} name="color2"></${childTag}>
        </${tag}>
      `);
      await el.registrationReady;
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
      const el = await fixture(html`
        <${tag}>
          <${childTag} name="child[]" .modelValue="${'foo1'}">
          </${childTag}>
          <${childTag} name="child[]" .modelValue="${'bar1'}">
          </${childTag}>
        </${tag}>
      `);
      await el.updateComplete;
      el.modelValue['child[]'] = ['foo2', 'bar2'];
      expect(el._initialModelValue['child[]']).to.eql(['foo1', 'bar1']);
    });

    it('does not wrongly recompute `_initialModelValue` after dynamic changes of children', async () => {
      const el = await fixture(html`
        <${tag}>
          <${childTag} name="child[]" .modelValue="${'foo1'}">
          </${childTag}>
        </${tag}>
      `);
      el.modelValue['child[]'] = ['foo2'];
      const childEl = await fixture(html`
        <${childTag} name="child[]" .modelValue="${'bar1'}">
        </${childTag}>
      `);
      el.appendChild(childEl);
      expect(el._initialModelValue['child[]']).to.eql(['foo1', 'bar1']);
    });

    describe('resetGroup method', () => {
      it('calls resetGroup on children fieldsets', async () => {
        const el = await fixture(html`
          <${tag} name="parentFieldset">
            <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `);
        const childFieldsetEl = el.querySelector(tagString);
        const resetGroupSpy = sinon.spy(childFieldsetEl, 'resetGroup');
        el.resetGroup();
        expect(resetGroupSpy.callCount).to.equal(1);
      });

      it('calls reset on children fields', async () => {
        const el = await fixture(html`
          <${tag} name="parentFieldset">
            <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `);
        const childFieldsetEl = el.querySelector(childTagString);
        const resetSpy = sinon.spy(childFieldsetEl, 'reset');
        el.resetGroup();
        expect(resetSpy.callCount).to.equal(1);
      });
    });

    describe('clearGroup method', () => {
      it('calls clearGroup on children fieldset', async () => {
        const el = await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `);
        const childFieldsetEl = el.querySelector(tagString);
        const clearGroupSpy = sinon.spy(childFieldsetEl, 'clearGroup');
        el.clearGroup();
        expect(clearGroupSpy.callCount).to.equal(1);
      });

      it('calls clear on children fields', async () => {
        const el = await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child[]" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `);
        const childFieldsetEl = el.querySelector(childTagString);
        const clearSpy = sinon.spy(childFieldsetEl, 'clear');
        el.clearGroup();
        expect(clearSpy.callCount).to.equal(1);
      });

      it('should clear the value of  fields', async () => {
        const el = await fixture(html`
          <${tag} name="parentFieldset">
          <${tag} name="childFieldset">
              <${childTag} name="child" .modelValue="${'foo1'}">
              </${childTag}>
            </${tag}>
          </${tag}>
        `);
        el.clearGroup();
        expect(el.querySelector('[name="child"]').modelValue).to.equal('');
      });
    });
  });

  describe('Accessibility', () => {
    it('has role="group" set', async () => {
      const fieldset = await fixture(html`<${tag}>${inputSlots}</${tag}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      expect(fieldset.hasAttribute('role')).to.be.true;
      expect(fieldset.getAttribute('role')).to.contain('group');
    });

    it('has an aria-labelledby from element with slot="label"', async () => {
      const el = await fixture(html`
        <${tag}>
          <label slot="label">My Label</label>
          ${inputSlots}
        </${tag}>
      `);
      const label = Array.from(el.children).find(child => child.slot === 'label');
      expect(el.hasAttribute('aria-labelledby')).to.equal(true);
      expect(el.getAttribute('aria-labelledby')).contains(label.id);
    });

    describe('Screen reader relations (aria-describedby) for child fields and fieldsets', () => {
      let childAriaFixture; // function
      let childAriaTest; // function

      before(() => {
        // Legend:
        // - l1 means level 1 (outer) fieldset
        // - l2 means level 2 (inner) fieldset
        // - g means group: the help-text or feedback belongs to group
        // - f means field(lion-input in fixture below): the help-text or feedback belongs to field
        // - 'a' or 'b' behind 'f' indicate which field in a fieldset is meant (a: first, b: second)

        childAriaFixture = async (
          msgSlotType = 'feedback', // eslint-disable-line no-shadow
        ) => {
          const dom = await fixture(html`
            <${tag} name="l1_g">
              <${childTag} name="l1_fa">
                <div slot="${msgSlotType}" id="msg_l1_fa"></div>
                <!-- field referred by: #msg_l1_fa (local), #msg_l1_g (parent/group) -->
              </${childTag}>

              <${childTag} name="l1_fb">
                <div slot="${msgSlotType}" id="msg_l1_fb"></div>
                <!-- field referred by: #msg_l1_fb (local), #msg_l1_g (parent/group) -->
              </${childTag}>

              <!-- [ INNER FIELDSET ] -->

              <${tag} name="l2_g">
                <${childTag} name="l2_fa">
                  <div slot="${msgSlotType}" id="msg_l2_fa"></div>
                  <!-- field referred by: #msg_l2_fa (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
                </${childTag}>

                <${childTag} name="l2_fb">
                  <div slot="${msgSlotType}" id="msg_l2_fb"></div>
                  <!-- field referred by: #msg_l2_fb (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
                </${childTag}>

                <div slot="${msgSlotType}" id="msg_l2_g"></div>
                <!-- group referred by: #msg_l2_g (local), #msg_l1_g (parent/group)  -->
              </${tag}>

              <!-- [ / INNER FIELDSET ] -->

              <div slot="${msgSlotType}" id="msg_l1_g"></div>
              <!-- group referred by: #msg_l1_g (local) -->
            </${tag}>
          `);
          return dom;
        };

        // eslint-disable-next-line no-shadow
        childAriaTest = childAriaFixture => {
          /* eslint-disable camelcase */
          // Message elements: all elements pointed at by inputs
          const msg_l1_g = childAriaFixture.querySelector('#msg_l1_g');
          const msg_l1_fa = childAriaFixture.querySelector('#msg_l1_fa');
          const msg_l1_fb = childAriaFixture.querySelector('#msg_l1_fb');
          const msg_l2_g = childAriaFixture.querySelector('#msg_l2_g');
          const msg_l2_fa = childAriaFixture.querySelector('#msg_l2_fa');
          const msg_l2_fb = childAriaFixture.querySelector('#msg_l2_fb');

          // Field elements: all inputs pointing to message elements
          const input_l1_fa = childAriaFixture.querySelector('input[name=l1_fa]');
          const input_l1_fb = childAriaFixture.querySelector('input[name=l1_fb]');
          const input_l2_fa = childAriaFixture.querySelector('input[name=l2_fa]');
          const input_l2_fb = childAriaFixture.querySelector('input[name=l2_fb]');

          /* eslint-enable camelcase */

          // 'L1' fields (inside lion-fieldset[name="l1_g"]) should point to l1(group) msg
          expect(input_l1_fa.getAttribute('aria-describedby')).to.contain(
            msg_l1_g.id,
            'l1 input(a) refers parent/group',
          );
          expect(input_l1_fb.getAttribute('aria-describedby')).to.contain(
            msg_l1_g.id,
            'l1 input(b) refers parent/group',
          );

          // Also check that aria-describedby of the inputs are not overridden (this relation was
          // put there in lion-input(using lion-field)).
          expect(input_l1_fa.getAttribute('aria-describedby')).to.contain(
            msg_l1_fa.id,
            'l1 input(a) refers local field',
          );
          expect(input_l1_fb.getAttribute('aria-describedby')).to.contain(
            msg_l1_fb.id,
            'l1 input(b) refers local field',
          );

          // Also make feedback element point to nested fieldset inputs
          expect(input_l2_fa.getAttribute('aria-describedby')).to.contain(
            msg_l1_g.id,
            'l2 input(a) refers grandparent/group.group',
          );
          expect(input_l2_fb.getAttribute('aria-describedby')).to.contain(
            msg_l1_g.id,
            'l2 input(b) refers grandparent/group.group',
          );

          // Check order: the nearest ('dom wise': so 1. local, 2. parent, 3. grandparent) message
          // should be read first by screen reader
          const dA = input_l2_fa.getAttribute('aria-describedby');
          expect(
            dA.indexOf(msg_l2_fa.id) < dA.indexOf(msg_l2_g.id) < dA.indexOf(msg_l1_g.id),
          ).to.equal(true, 'order of ids');
          const dB = input_l2_fb.getAttribute('aria-describedby');
          expect(
            dB.indexOf(msg_l2_fb.id) < dB.indexOf(msg_l2_g.id) < dB.indexOf(msg_l1_g.id),
          ).to.equal(true, 'order of ids');
        };
      });

      it(`reads feedback message belonging to fieldset when child input is focused
        (via aria-describedby)`, async () => {
        childAriaTest(await childAriaFixture('feedback'));
      });

      it(`reads help-text message belonging to fieldset when child input is focused
        (via aria-describedby)`, async () => {
        childAriaTest(await childAriaFixture('help-text'));
      });
    });
  });
});
