import {
  expect,
  fixture,
  html,
  oneEvent,
  aTimeout,
  unsafeStatic,
  defineCE,
} from '@open-wc/testing';
import { spy } from 'sinon';
import { LitElement } from 'lit-element';
import { LionField } from '@lion/form-core';
import { LionFieldset } from '@lion/fieldset';
import '@lion/form-core/lion-field.js';
import '@lion/fieldset/lion-fieldset.js';

import '../lion-form.js';

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
const formTagString = 'lion-form';
const formTag = unsafeStatic(formTagString);

describe('<lion-form>', () => {
  it('is an instance of LionFieldSet', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
        </form>
      </${formTag}>
    `);
    expect(el).to.be.instanceOf(LionFieldset);
  });

  it('relies on the native form for its accessible role', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
        </form>
      </${formTag}>
    `);
    expect(el.getAttribute('role')).to.be.null;
  });

  it('has a custom reset that gets triggered by native reset', async () => {
    const withDefaults = await fixture(html`
      <${formTag}>
        <form>
          <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
          <input type="reset" value="reset-button" />
        </form>
      </${formTag}>
    `);
    const resetButton = withDefaults.querySelector('input[type=reset]');

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
      <${formTag}>
        <form>
          <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
        </form>
      </${formTag}>
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
      <${formTag} @submit=${submitSpy}>
        <form>
          <button type="submit">submit</button>
        </form>
      </${formTag}>
    `);

    const button = el.querySelector('button');
    button.click();
    expect(submitSpy.callCount).to.equal(1);
  });

  it('dispatches submit events', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
          <button type="submit">submit</button>
        </form>
      </${formTag}>
    `);
    const button = el.querySelector('button');
    setTimeout(() => button.click());
    const submitEv = await oneEvent(el, 'submit');
    expect(submitEv).to.be.instanceOf(Event);
    expect(submitEv.type).to.equal('submit');
    expect(submitEv.target).to.equal(el);
    expect(submitEv.bubbles).to.be.true;
    expect(submitEv.composed).to.be.false;
  });

  it('handles internal submit handler before dispatch', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
          <button type="submit">submit</button>
        </form>
      </${formTag}>
    `);
    const button = el.querySelector('button');
    const internalHandlerSpy = spy(el, 'submitGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    await aTimeout();
    button.click();
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it('handles internal submit handler before dispatch', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
          <button type="submit">submit</button>
        </form>
      </${formTag}>
    `);
    const button = el.querySelector('button');
    const internalHandlerSpy = spy(el, 'submitGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('submit');
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it('handles internal reset handler before dispatch', async () => {
    const el = await fixture(html`
      <${formTag}>
        <form>
          <button type="reset">submit</button>
        </form>
      </${formTag}>
    `);
    const button = el.querySelector('button');
    const internalHandlerSpy = spy(el, 'resetGroup');
    const dispatchSpy = spy(el, 'dispatchEvent');
    button.click();
    expect(dispatchSpy.args[0][0].type).to.equal('reset');
    expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
  });

  it.only('sets serialized value of form', async () => {
    const answer = {
      firstName: 'Foo',
    };
    const el = await fixture(html`
      <lion-form name="test" id="test" .serializedValue=${{ firstName: 'Foo' }}>
        <form>
          <lion-input name="firstName" id="firstName"></lion-input>
        </form>
      </lion-form>
    `);

    await el.registrationComplete;
    const firstNameInput = el.querySelector('#firstName');
    expect(firstNameInput.serializedValue).to.equal('Foo');
  });
});
