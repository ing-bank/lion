import { LionFieldset } from '@lion/ui/fieldset.js';
import '@lion/ui/define/lion-fieldset.js';
import { LionField, Required } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-field.js';
import '@lion/ui/define/lion-validation-feedback.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-form.js';
import {
  aTimeout,
  defineCE,
  expect,
  fixture as _fixture,
  html,
  oneEvent,
  unsafeStatic,
} from '@open-wc/testing';
import { spy } from 'sinon';

/**
 * @typedef {import('../src/LionForm.js').LionForm} LionForm
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionForm>} */ (_fixture);

const childTagString = defineCE(
  class extends LionField {
    get slots() {
      return {
        input: () => document.createElement('input'),
      };
    }
  },
);
const childTag = unsafeStatic(childTagString);

describe('<lion-form>', () => {
  it('is an instance of LionFieldSet', async () => {
    const el = await fixture(html`
      <lion-form>
        <form></form>
      </lion-form>
    `);
    expect(el).to.be.instanceOf(LionFieldset);
  });

  it('relies on the native form for its accessible role', async () => {
    const el = await fixture(html`
      <lion-form>
        <form></form>
      </lion-form>
    `);
    expect(el.getAttribute('role')).to.be.null;
  });

  it('has a custom reset that gets triggered by native reset', async () => {
    const withDefaults = await fixture(html`
      <lion-form>
        <form>
          <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
          <input type="reset" value="reset-button" />
        </form>
      </lion-form>
    `);
    const resetButton = /** @type {HTMLInputElement} */ (
      withDefaults.querySelector('input[type=reset]')
    );

    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    withDefaults.reset();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });

    // use button
    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    resetButton.click();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });
  });

  it('dispatches reset events', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
        </form>
      </lion-form>
    `);

    setTimeout(() => el.reset());
    const resetEv = await oneEvent(el, 'reset');
    expect(resetEv).to.be.instanceOf(Event);
    expect(resetEv.type).to.equal('reset');
    expect(resetEv.target).to.equal(el);
    expect(resetEv.bubbles).to.be.true;
    expect(resetEv.composed).to.be.false;
  });

  it('works with the native submit event (triggered via a button)', async () => {
    const submitSpy = spy();
    const el = await fixture(html`
      <lion-form @submit=${submitSpy}>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);

    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    button.click();
    expect(submitSpy.callCount).to.equal(1);
  });

  it('dispatches submit events', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    setTimeout(() => button.click());
    const submitEv = await oneEvent(el, 'submit');
    expect(submitEv).to.be.instanceOf(Event);
    expect(submitEv.type).to.equal('submit');
    expect(submitEv.target).to.equal(el);
    expect(submitEv.bubbles).to.be.true;
    expect(submitEv.composed).to.be.false;
  });

  it('redispatches a submit event on the native form node when calling submit() imperatively', async () => {
    const nativeFormSubmitEventSpy = spy();
    const el = await fixture(html`
      <lion-form>
        <form @submit=${nativeFormSubmitEventSpy}>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const submitSpy = spy(el, 'submit');
    const submitGroupSpy = spy(el, 'submitGroup');
    el.submit();
    expect(submitSpy.calledOnce).to.be.true;
    expect(nativeFormSubmitEventSpy.calledOnce).to.be.true;
    expect(submitGroupSpy.calledOnce).to.be.true;
  });

  it('handles internal submit handler before dispatch', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const internalHandlerSpy = spy(el, 'submitGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    await aTimeout(0);
    button.click();
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it('handles internal submit handler before dispatch', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const internalHandlerSpy = spy(el, 'submitGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('submit');
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it('handles internal reset handler before dispatch', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <button type="reset">reset</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const internalHandlerSpy = spy(el, 'resetGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('reset');
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it('sets focus on submit to the first erroneous form element', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <${childTag} name="firstName" .modelValue=${'Foo'} .validators=${[
            new Required(),
          ]}></${childTag}>
          <${childTag} name="lastName" .validators=${[new Required()]}></${childTag}>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('submit');
    // @ts-ignore [allow-protected] in test
    expect(document.activeElement).to.equal(el.formElements[1]._inputNode);
  });

  it('sets focus on submit to the first erroneous form element within a fieldset', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-fieldset name="name">
            <${childTag} name="firstName" .modelValue=${'Foo'} .validators=${[
              new Required(),
            ]}></${childTag}>
            <${childTag} name="lastName" .validators=${[new Required()]}></${childTag}>
          </lion-fieldset>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('submit');
    const fieldset = el.formElements[0];
    // @ts-ignore [allow-protected] in test
    expect(document.activeElement).to.equal(fieldset.formElements[1]._inputNode);
  });

  it('sets focus on submit to the first form element within a erroneous fieldset', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-fieldset name="name" .validators=${[new Required()]}>
            <${childTag} name="firstName"></${childTag}>
            <${childTag} name="lastName"></${childTag}>
          </lion-fieldset>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('submit');
    const fieldset = el.formElements[0];
    expect(document.activeElement).to.equal(fieldset.formElements[0]._inputNode);
  });

  it('sets focus on submit to the first form element within a erroneous fieldset within another fieldset', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-fieldset name="parentFieldset">
            <lion-fieldset name="childFieldset" .validators="${[new Required()]}">
              <${childTag} name="firstName"></${childTag}>
            </lion-fieldset>
          </lion-fieldset>

          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const parentFieldSetEl = el.formElements[0];
    const childFieldsetEl = parentFieldSetEl.formElements[0];
    const inputEl = childFieldsetEl.formElements[0];
    button.click();
    expect(document.activeElement).to.equal(inputEl._focusableNode);
  });

  it('sets focus on submit to the first form element within a erroneous listbox', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-listbox name="name" .validators="${[new Required()]}">
            <lion-option value="a">a</lion-option>
            <lion-option value="b">b</lion-option>
          </lion-listbox>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    button.click();
    const listboxEl = el.formElements[0];
    expect(document.activeElement).to.equal(listboxEl._inputNode);
  });

  it('sets focus on submit to the first form element within a erroneous listbox within a fieldset', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-fieldset name="fieldset">
            <lion-listbox name="name" .validators="${[new Required()]}">
              <lion-option value="a">a</lion-option>
              <lion-option value="b">b</lion-option>
            </lion-listbox>
          </lion-fieldset>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    button.click();
    const fieldsetEl = el.formElements[0];
    const listboxEl = fieldsetEl.formElements[0];
    expect(document.activeElement).to.equal(listboxEl._inputNode);
  });

  it('sets focus on submit to the first form element within a erroneous checkbox-group', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-checkbox-group name="name" .validators="${[new Required()]}">
            <lion-checkbox .choiceValue=${'a'} label="a"></lion-checkbox>
            <lion-checkbox .choiceValue=${'b'} label="b"></lion-checkbox>
          </lion-checkbox-group>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
    const checkboxGroupEl = el.formElements[0];
    const checkboxEl = checkboxGroupEl.formElements[0];
    button.click();
    expect(document.activeElement).to.equal(checkboxEl._focusableNode);
  });

  it('sets focus on submit to the first form element within a erroneous radio-group', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
            <lion-radio-group name="name" .validators="${[new Required()]}">
              <lion-radio .choiceValue=${'a'} label="a"></lion-radio>
              <lion-radio .choiceValue=${'b'} label="b"></lion-radio>
            </lion-radio-group>
          </lion-fieldset>

          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));

    const radioGroupEl = el.formElements[0];
    const radioEl = radioGroupEl.formElements[0];
    button.click();
    expect(document.activeElement).to.equal(radioEl._focusableNode);
  });
});
