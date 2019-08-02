import {
  expect,
  fixture,
  html,
  unsafeStatic,
  triggerFocusFor,
  triggerBlurFor,
  nextFrame,
} from '@open-wc/testing';
import sinon from 'sinon';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import '@lion/input/lion-input.js';
import '../lion-fieldset.js';

const tagString = 'lion-fieldset';
const tag = unsafeStatic(tagString);
const inputSlotString = `
  <lion-input name="gender[]"></lion-input>
  <lion-input name="gender[]"></lion-input>
  <lion-input name="color"></lion-input>
  <lion-input name="hobbies[]"></lion-input>
  <lion-input name="hobbies[]"></lion-input>
`;
const nonPrefilledModelValue = '';
const prefilledModelValue = 'prefill';

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-fieldset>', () => {
  it(`${tagString} has an up to date list of every form element in #formElements`, async () => {
    const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    await nextFrame();
    expect(Object.keys(fieldset.formElements).length).to.equal(3);
    expect(fieldset.formElements['hobbies[]'].length).to.equal(2);
    fieldset.removeChild(fieldset.formElements['hobbies[]'][0]);
    expect(Object.keys(fieldset.formElements).length).to.equal(3);
    expect(fieldset.formElements['hobbies[]'].length).to.equal(1);
  });

  it(`supports in html wrapped form elements`, async () => {
    const el = await fixture(`
      <lion-fieldset>
        <div>
          <lion-input name="foo"></lion-input>
        </div>
      </lion-fieldset>
    `);
    await nextFrame();
    expect(el.formElementsArray.length).to.equal(1);
    el.children[0].removeChild(el.formElements.foo);
    expect(el.formElementsArray.length).to.equal(0);
  });

  it('handles names with ending [] as an array', async () => {
    const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    await nextFrame();
    fieldset.formElements['gender[]'][0].modelValue = { value: 'male' };
    fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
    fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };

    expect(Object.keys(fieldset.formElements).length).to.equal(3);
    expect(fieldset.formElements['hobbies[]'].length).to.equal(2);
    expect(fieldset.formElements['hobbies[]'][0].modelValue.value).to.equal('chess');
    expect(fieldset.formElements['gender[]'][0].modelValue.value).to.equal('male');
    expect(fieldset.modelValue['hobbies[]']).to.deep.equal([
      { checked: false, value: 'chess' },
      { checked: false, value: 'rugby' },
    ]);
  });

  it('throws if an element without a name tries to register', async () => {
    const orig = console.info;
    console.info = () => {};

    let error = false;
    const el = await fixture(`<lion-fieldset></lion-fieldset>`);
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
    const el = await fixture(`<lion-fieldset name="foo"></lion-fieldset>`);
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
    const el = await fixture(`<lion-fieldset></lion-fieldset>`);
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
    const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    const newField = await fixture(`<lion-input name="lastName"></lion-input>`);

    expect(Object.keys(fieldset.formElements).length).to.equal(3);

    fieldset.appendChild(newField);
    expect(Object.keys(fieldset.formElements).length).to.equal(4);

    fieldset.inputElement.removeChild(newField);
    expect(Object.keys(fieldset.formElements).length).to.equal(3);
  });

  it('can read/write all values (of every input) via this.modelValue', async () => {
    const fieldset = await fixture(`
      <lion-fieldset>
        <lion-input name="lastName"></lion-input>
        <${tagString} name="newfieldset">${inputSlotString}</${tagString}>
      </lion-fieldset>
    `);
    await fieldset.registrationReady;
    const newFieldset = fieldset.querySelector('lion-fieldset');
    await newFieldset.registrationReady;
    fieldset.formElements.lastName.modelValue = 'Bar';
    newFieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'chess' };
    newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'football' };
    newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
    newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
    newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };

    expect(fieldset.modelValue).to.deep.equal({
      lastName: 'Bar',
      newfieldset: {
        'hobbies[]': [{ checked: true, value: 'chess' }, { checked: false, value: 'football' }],
        'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
        color: { checked: false, value: 'blue' },
      },
    });
    fieldset.modelValue = {
      lastName: 2,
      newfieldset: {
        'hobbies[]': [{ checked: true, value: 'chess' }, { checked: false, value: 'baseball' }],
        'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
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
    expect(fieldset.formElements.lastName.modelValue).to.equal(2);
  });

  it('does not throw if setter data of this.modelValue can not be handled', async () => {
    const el = await fixture(html`
      <lion-fieldset>
        <lion-input name="firstName" .modelValue=${'foo'}></lion-input>
        <lion-input name="lastName" .modelValue=${'bar'}></lion-input>
      </lion-fieldset>
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
    const el = await fixture(`<${tagString} disabled>${inputSlotString}</${tagString}>`);
    await nextFrame();
    expect(el.formElements.color.disabled).to.equal(true);
    expect(el.formElements['hobbies[]'][0].disabled).to.equal(true);
    expect(el.formElements['hobbies[]'][1].disabled).to.equal(true);

    el.disabled = false;
    await el.updateComplete;
    expect(el.formElements.color.disabled).to.equal(false);
    expect(el.formElements['hobbies[]'][0].disabled).to.equal(false);
    expect(el.formElements['hobbies[]'][1].disabled).to.equal(false);
  });

  it('does not propagate/override initial disabled value on nested form elements', async () => {
    const el = await fixture(
      `<${tagString}><${tagString} name="sub" disabled>${inputSlotString}</${tagString}></${tagString}>`,
    );
    await el.updateComplete;
    expect(el.disabled).to.equal(false);
    expect(el.formElements.sub.disabled).to.equal(true);
    expect(el.formElements.sub.formElements.color.disabled).to.equal(true);
    expect(el.formElements.sub.formElements['hobbies[]'][0].disabled).to.equal(true);
    expect(el.formElements.sub.formElements['hobbies[]'][1].disabled).to.equal(true);
  });

  // classes are added only for backward compatibility - they are deprecated
  it('sets a state-disabled class when disabled', async () => {
    const el = await fixture(`<${tagString} disabled>${inputSlotString}</${tagString}>`);
    await nextFrame();
    expect(el.classList.contains('state-disabled')).to.equal(true);
    el.disabled = false;
    await nextFrame();
    expect(el.classList.contains('state-disabled')).to.equal(false);
  });

  describe('validation', () => {
    it('validates on init', async () => {
      function isCat(value) {
        return { isCat: value === 'cat' };
      }
      const el = await fixture(html`
        <${tag}>
          <lion-input name="color"
            .errorValidators=${[[isCat]]}
            .modelValue=${'blue'}
          ></lion-input>
        </${tag}>
      `);
      await nextFrame();
      expect(el.formElements.color.error.isCat).to.equal(true);
    });

    it('validates when a value changes', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      const spy = sinon.spy(fieldset, 'validate');
      fieldset.formElements.color.modelValue = { checked: true, value: 'red' };
      expect(spy.callCount).to.equal(1);
    });

    it('has a special {error, warning, info, success} validator for all children - can be checked via this.error.formElementsHaveNoError', async () => {
      function isCat(value) {
        return { isCat: value === 'cat' };
      }

      const el = await fixture(html`
        <${tag}>
          <lion-input name="color"
            .errorValidators=${[[isCat]]}
            .modelValue=${'blue'}
          ></lion-input>
        </${tag}>
      `);
      await nextFrame();

      expect(el.error.formElementsHaveNoError).to.equal(true);
      expect(el.formElements.color.error.isCat).to.equal(true);
      el.formElements.color.modelValue = 'cat';
      expect(el.error).to.deep.equal({});
    });

    it('validates on children (de)registration', async () => {
      function hasEvenNumberOfChildren(modelValue) {
        return { even: Object.keys(modelValue).length % 2 === 0 };
      }
      const el = await fixture(html`
        <${tag} .errorValidators=${[[hasEvenNumberOfChildren]]}>
          <lion-input id="c1" name="c1"></lion-input>
        </${tag}>
      `);
      const child2 = await fixture(
        html`
          <lion-input name="c2"></lion-input>
        `,
      );

      await nextFrame();
      expect(el.error.even).to.equal(true);

      el.appendChild(child2);
      await nextFrame();
      expect(el.error.even).to.equal(undefined);

      el.removeChild(child2);
      await nextFrame();
      expect(el.error.even).to.equal(true);

      // Edge case: remove all children
      el.removeChild(el.querySelector('[id=c1]'));
      await nextFrame();
      expect(el.error.even).to.equal(undefined);
    });
  });

  describe('interaction states', () => {
    it('has false states (dirty, touched, prefilled) on init', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      expect(fieldset.dirty).to.equal(false, 'dirty');
      expect(fieldset.touched).to.equal(false, 'touched');
      expect(fieldset.prefilled).to.equal(false, 'prefilled');
    });

    it('sets dirty when value changed', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'football' };
      expect(fieldset.dirty).to.equal(true);
    });

    it('sets touched when field left after focus', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      await triggerFocusFor(fieldset.formElements['gender[]'][0].inputElement);
      await triggerBlurFor(fieldset.formElements['gender[]'][0].inputElement);
      expect(fieldset.touched).to.equal(true);
    });

    it('sets a class "state-(touched|dirty)"', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements.color.touched = true;
      await fieldset.updateComplete;
      expect(fieldset.classList.contains('state-touched')).to.equal(
        true,
        'has class "state-touched"',
      );

      fieldset.formElements.color.dirty = true;
      await fieldset.updateComplete;
      expect(fieldset.classList.contains('state-dirty')).to.equal(true, 'has class "state-dirty"');
    });

    it('sets prefilled when field left and value non-empty', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'football' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };

      fieldset.formElements.color.modelValue = nonPrefilledModelValue;
      await triggerFocusFor(fieldset.formElements.color.inputElement);
      fieldset.formElements.color.modelValue = prefilledModelValue;
      await triggerBlurFor(fieldset.formElements.color.inputElement);
      expect(fieldset.prefilled).to.equal(true, 'sets prefilled when left non empty');

      await triggerFocusFor(fieldset.formElements.color.inputElement);
      fieldset.formElements.color.modelValue = nonPrefilledModelValue;
      await triggerBlurFor(fieldset.formElements.color.inputElement);
      expect(fieldset.prefilled).to.equal(false, 'unsets prefilled when left empty');
    });

    it('sets prefilled once instantiated', async () => {
      // no prefilled when nothing has value
      const fieldsetNotPrefilled = await fixture(html`<${tag}>${inputSlotString}</${tag}>`);
      expect(fieldsetNotPrefilled.prefilled).to.equal(false, 'not prefilled on init');

      // prefilled when at least one child has value
      const fieldsetPrefilled = await fixture(html`
        <${tag}>
          <lion-input name="gender[]" .modelValue=${prefilledModelValue}></lion-input>
          <lion-input name="gender[]"></lion-input>
          <lion-input name="color"></lion-input>
          <lion-input name="hobbies[]"></lion-input>
          <lion-input name="hobbies[]"></lion-input>
        </${tag}>
      `);
      await nextFrame();
      expect(fieldsetPrefilled.prefilled).to.equal(true, 'prefilled on init');
    });
  });

  describe('serialize', () => {
    it('use form elements serializedValue', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].serializer = v => `${v.value}-serialized`;
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'Bar' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      expect(fieldset.formElements['hobbies[]'][0].serializedValue).to.equal('Bar-serialized');
      expect(fieldset.serializeGroup()).to.deep.equal({
        'hobbies[]': ['Bar-serialized', { checked: false, value: 'rugby' }],
        'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
        color: { checked: false, value: 'blue' },
      });
    });

    it('form elements which are not disabled', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: true, value: 'football' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: true, value: 'male' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };

      expect(fieldset.serializeGroup()).to.deep.equal({
        'hobbies[]': [{ checked: true, value: 'football' }, { checked: false, value: 'rugby' }],
        'gender[]': [{ checked: true, value: 'male' }, { checked: false, value: 'female' }],
        color: { checked: false, value: 'blue' },
      });
      fieldset.formElements.color.disabled = true;

      expect(fieldset.serializeGroup()).to.deep.equal({
        'hobbies[]': [{ checked: true, value: 'football' }, { checked: false, value: 'rugby' }],
        'gender[]': [{ checked: true, value: 'male' }, { checked: false, value: 'female' }],
      });
    });

    it('allows for nested fieldsets', async () => {
      const fieldset = await fixture(`
        <lion-fieldset name="userData">
          <lion-input name="comment"></lion-input>
          <${tagString} name="newfieldset">${inputSlotString}</${tagString}>
        </lion-fieldset>
      `);
      await nextFrame();
      const newFieldset = fieldset.querySelector('lion-fieldset');
      newFieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      newFieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      newFieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      newFieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      newFieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      fieldset.formElements.comment.modelValue = 'Foo';
      expect(Object.keys(fieldset.formElements).length).to.equal(2);
      expect(Object.keys(newFieldset.formElements).length).to.equal(3);
      expect(fieldset.serializeGroup()).to.deep.equal({
        comment: 'Foo',
        newfieldset: {
          'hobbies[]': [{ checked: false, value: 'chess' }, { checked: false, value: 'rugby' }],
          'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
          color: { checked: false, value: 'blue' },
        },
      });
    });

    it('will exclude form elements within an disabled fieldset', async () => {
      const fieldset = await fixture(`
        <lion-fieldset name="userData">
          <lion-input name="comment"></lion-input>
          <${tagString} name="newfieldset">${inputSlotString}</${tagString}>
        </lion-fieldset>
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

      expect(fieldset.serializeGroup()).to.deep.equal({
        comment: 'Foo',
        newfieldset: {
          'hobbies[]': [{ checked: false, value: 'chess' }, { checked: false, value: 'rugby' }],
          'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
        },
      });

      newFieldset.formElements.color.disabled = false;
      expect(fieldset.serializeGroup()).to.deep.equal({
        comment: 'Foo',
        newfieldset: {
          'hobbies[]': [{ checked: false, value: 'chess' }, { checked: false, value: 'rugby' }],
          'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
          color: { checked: false, value: 'blue' },
        },
      });
    });

    it('treats names with ending [] as arrays', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      expect(fieldset.serializeGroup()).to.deep.equal({
        'hobbies[]': [{ checked: false, value: 'chess' }, { checked: false, value: 'rugby' }],
        'gender[]': [{ checked: false, value: 'male' }, { checked: false, value: 'female' }],
        color: { checked: false, value: 'blue' },
      });
    });

    it('does not serialize undefined values (nb radios/checkboxes are always serialized)', async () => {
      const fieldset = await fixture(`
        <lion-fieldset>
          <lion-input name="custom[]"></lion-input>
          <lion-input name="custom[]"></lion-input>
        </lion-fieldset>
      `);
      await nextFrame();
      fieldset.formElements['custom[]'][0].modelValue = 'custom 1';
      fieldset.formElements['custom[]'][1].modelValue = undefined;

      expect(fieldset.serializeGroup()).to.deep.equal({
        'custom[]': ['custom 1'],
      });
    });
  });

  describe('reset', () => {
    it('restores default values if changes were made', async () => {
      const el = await fixture(html`
        <lion-fieldset>
          <lion-input id="firstName" name="firstName" .modelValue="${'Foo'}"></lion-input>
        </lion-fieldset>
      `);
      await el.querySelector('lion-input').updateComplete;

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
        <lion-fieldset>
          <lion-input id="firstName" name="firstName[]" .modelValue="${'Foo'}"></lion-input>
        </lion-fieldset>
      `);
      await el.querySelector('lion-input').updateComplete;

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
        <lion-fieldset>
          <lion-fieldset id="name" name="name[]">
            <lion-input id="firstName" name="firstName" .modelValue="${'Foo'}"></lion-input>
          </lion-fieldset>
        </lion-fieldset>
      `);
      await Promise.all([
        el.querySelector('lion-fieldset').updateComplete,
        el.querySelector('lion-input').updateComplete,
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
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      // Safety check initially
      fieldset._setValueForAllFormElements('dirty', true);
      fieldset._setValueForAllFormElements('touched', true);
      fieldset._setValueForAllFormElements('prefilled', true);
      expect(fieldset.dirty).to.equal(true, '"dirty" initially');
      expect(fieldset.touched).to.equal(true, '"touched" initially');
      expect(fieldset.prefilled).to.equal(true, '"prefilled" initially');

      // Reset all children states, with prefilled false
      fieldset._setValueForAllFormElements('modelValue', {});
      fieldset.resetInteractionState();
      expect(fieldset.dirty).to.equal(false, 'not "dirty" after reset');
      expect(fieldset.touched).to.equal(false, 'not "touched" after reset');
      expect(fieldset.prefilled).to.equal(false, 'not "prefilled" after reset');

      // Reset all children states with prefilled true
      fieldset._setValueForAllFormElements('dirty', true);
      fieldset._setValueForAllFormElements('touched', true);
      fieldset._setValueForAllFormElements('modelValue', { checked: true }); // not prefilled
      fieldset.resetInteractionState();
      expect(fieldset.dirty).to.equal(false, 'not "dirty" after 2nd reset');
      expect(fieldset.touched).to.equal(false, 'not "touched" after 2nd reset');
      // prefilled state is dependant on value
      expect(fieldset.prefilled).to.equal(true, '"prefilled" after 2nd reset');
    });

    it('clears submitted state', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.submitted = true;
      fieldset.resetGroup();
      expect(fieldset.submitted).to.equal(false);
      fieldset.formElementsArray.forEach(el => {
        expect(el.submitted).to.equal(false);
      });
    });

    it('has correct validation afterwards', async () => {
      const isCat = modelValue => ({ isCat: modelValue === 'cat' });
      const containsA = modelValues => {
        return {
          containsA: modelValues.color ? modelValues.color.indexOf('a') > -1 : false,
        };
      };

      const el = await fixture(html`
        <${tag} .errorValidators=${[[containsA]]}>
          <lion-input name="color" .errorValidators=${[[isCat]]}></lion-input>
          <lion-input name="color2"></lion-input>
        </${tag}>
      `);
      await el.registrationReady;
      expect(el.errorState).to.be.true;
      expect(el.error.containsA).to.be.true;
      expect(el.formElements.color.errorState).to.be.false;

      el.formElements.color.modelValue = 'onlyb';
      expect(el.errorState).to.be.true;
      expect(el.error.containsA).to.be.true;
      expect(el.formElements.color.error.isCat).to.be.true;

      el.formElements.color.modelValue = 'cat';
      expect(el.errorState).to.be.false;

      el.resetGroup();
      expect(el.errorState).to.be.true;
      expect(el.error.containsA).to.be.true;
      expect(el.formElements.color.errorState).to.be.false;
    });
  });

  describe('a11y', () => {
    // beforeEach(() => {
    //   localizeTearDown();
    // });

    it('has role="group" set', async () => {
      const fieldset = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      await nextFrame();
      fieldset.formElements['hobbies[]'][0].modelValue = { checked: false, value: 'chess' };
      fieldset.formElements['hobbies[]'][1].modelValue = { checked: false, value: 'rugby' };
      fieldset.formElements['gender[]'][0].modelValue = { checked: false, value: 'male' };
      fieldset.formElements['gender[]'][1].modelValue = { checked: false, value: 'female' };
      fieldset.formElements.color.modelValue = { checked: false, value: 'blue' };
      expect(fieldset.hasAttribute('role')).to.equal(true);
      expect(fieldset.getAttribute('role')).to.contain('group');
    });

    it('has an aria-labelledby from element with slot="label"', async () => {
      const el = await fixture(`
        <${tagString}>
          <label slot="label">My Label</label>
          ${inputSlotString}
        </${tagString}>
      `);
      const label = el.querySelector('[slot="label"]');
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
          const dom = fixture(`
            <lion-fieldset name="l1_g">
              <lion-input name="l1_fa">
                <div slot="${msgSlotType}" id="msg_l1_fa"></div>
                <!-- field referred by: #msg_l1_fa (local), #msg_l1_g (parent/group) -->
              </lion-input>

              <lion-input name="l1_fb">
                <div slot="${msgSlotType}" id="msg_l1_fb"></div>
                <!-- field referred by: #msg_l1_fb (local), #msg_l1_g (parent/group) -->
              </lion-input>

              <!-- [ INNER FIELDSET ] -->

              <lion-fieldset name="l2_g">
                <lion-input name="l2_fa">
                  <div slot="${msgSlotType}" id="msg_l2_fa"></div>
                  <!-- field referred by: #msg_l2_fa (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
                </lion-input>

                <lion-input name="l2_fb">
                  <div slot="${msgSlotType}" id="msg_l2_fb"></div>
                  <!-- field referred by: #msg_l2_fb (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
                </lion-input>

                <div slot="${msgSlotType}" id="msg_l2_g"></div>
                <!-- group referred by: #msg_l2_g (local), #msg_l1_g (parent/group)  -->
              </lion-fieldset>

              <!-- [ / INNER FIELDSET ] -->

              <div slot="${msgSlotType}" id="msg_l1_g"></div>
              <!-- group referred by: #msg_l1_g (local) -->
            </lion-fieldset>
          `);
          await nextFrame();
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
          const input_l1_fa = childAriaFixture.querySelector('[name=l1_fa]');
          const input_l1_fb = childAriaFixture.querySelector('[name=l1_fb]');
          const input_l2_fa = childAriaFixture.querySelector('[name=l2_fa]');
          const input_l2_fb = childAriaFixture.querySelector('[name=l2_fb]');

          /* eslint-enable camelcase */

          const ariaDescribedBy = el => el.getAttribute('aria-describedby');

          // 'L1' fields (inside lion-fieldset[name="l1_g"]) should point to l1(group) msg
          expect(ariaDescribedBy(input_l1_fa)).to.contain(
            msg_l1_g.id,
            'l1 input(a) refers parent/group',
          );
          expect(ariaDescribedBy(input_l1_fb)).to.contain(
            msg_l1_g.id,
            'l1 input(b) refers parent/group',
          );

          // Also check that aria-describedby of the inputs are not overridden (this relation was
          // put there in lion-input(using lion-field)).
          expect(ariaDescribedBy(input_l1_fa)).to.contain(
            msg_l1_fa.id,
            'l1 input(a) refers local field',
          );
          expect(ariaDescribedBy(input_l1_fb)).to.contain(
            msg_l1_fb.id,
            'l1 input(b) refers local field',
          );

          // Also make feedback element point to nested fieldset inputs
          expect(ariaDescribedBy(input_l2_fa)).to.contain(
            msg_l1_g.id,
            'l2 input(a) refers grandparent/group.group',
          );
          expect(ariaDescribedBy(input_l2_fb)).to.contain(
            msg_l1_g.id,
            'l2 input(b) refers grandparent/group.group',
          );

          // Check order: the nearest ('dom wise': so 1. local, 2. parent, 3. grandparent) message
          // should be read first by screen reader
          let d = ariaDescribedBy(input_l2_fa);
          expect(
            d.indexOf(msg_l1_g.id) < d.indexOf(msg_l2_g.id) < d.indexOf(msg_l2_fa.id),
          ).to.equal(true, 'order of ids');
          d = ariaDescribedBy(input_l2_fb);
          expect(
            d.indexOf(msg_l1_g.id) < d.indexOf(msg_l2_g.id) < d.indexOf(msg_l2_fb.id),
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
