import { formFixture as fixture } from '@lion/form-core/test-helpers.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/input/lion-input.js';
import { expect, html } from '@open-wc/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';

describe('model value event', () => {
  describe('form path', () => {
    it('should be property', async () => {
      const spy = sinon.spy();
      const input = await fixture(html`<lion-input></lion-input>`);
      input.addEventListener('model-value-changed', spy);
      input.modelValue = 'woof';
      const e = spy.firstCall.args[0];
      expect(e.detail).to.have.a.property('formPath');
    });

    it('should contain dispatching field', async () => {
      const spy = sinon.spy();
      const input = await fixture(html`<lion-input></lion-input>`);
      input.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input]);
    });

    it('should contain field and group', async () => {
      const spy = sinon.spy();
      const fieldset = await fixture(html`
        <lion-fieldset name="fieldset">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);
      fieldset.addEventListener('model-value-changed', spy);
      const input = fieldset.querySelector('lion-input');
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, fieldset]);
    });

    it('should contain deep elements', async () => {
      const spy = sinon.spy();
      const grandparent = await fixture(html`
        <lion-fieldset name="grandparent">
          <lion-fieldset name="parent">
            <lion-input name="input"></lion-input>
          </lion-fieldset>
        </lion-fieldset>
      `);
      const parent = grandparent.querySelector('[name=parent]');
      const input = grandparent.querySelector('[name=input]');
      grandparent.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, parent, grandparent]);
    });

    it('should ignore elements that are not fields or fieldsets', async () => {
      const spy = sinon.spy();
      const grandparent = await fixture(html`
        <lion-fieldset name="grandparent">
          <div>
            <lion-fieldset name="parent">
              <div>
                <div>
                  <lion-input name="input"></lion-input>
                </div>
              </div>
            </lion-fieldset>
          </div>
        </lion-fieldset>
      `);
      const parent = grandparent.querySelector('[name=parent]');
      const input = grandparent.querySelector('[name=input]');
      grandparent.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, parent, grandparent]);
    });
  });

  describe('signature', () => {
    let e;
    beforeEach(async () => {
      const spy = sinon.spy();
      const el = await fixture(html`<lion-input></lion-input>`);
      el.addEventListener('model-value-changed', spy);
      el.modelValue = 'foo';
      // eslint-disable-next-line prefer-destructuring
      e = spy.firstCall.args[0];
    });

    // TODO: Re-enable at some point...
    // In my opinion (@CubLion) we should not bubble events.
    // Instead each parent should explicitly listen to children events,
    // and then re-dispatch on themselves.
    it.skip('should not bubble', async () => {
      expect(e.bubbles).to.be.false;
    });

    it('should not leave shadow boundary', async () => {
      expect(e.composed).to.be.false;
    });
  });

  describe('propagation', () => {
    it('should dispatch different event at each level', async () => {
      const grandparent = await fixture(html`
        <lion-fieldset name="grandparent">
          <lion-fieldset name="parent">
            <lion-input name="input"></lion-input>
          </lion-fieldset>
        </lion-fieldset>
      `);
      const parent = grandparent.querySelector('[name="parent"]');
      const input = grandparent.querySelector('[name="input"]');
      const spies = [];
      [grandparent, parent, input].forEach(element => {
        const spy = sinon.spy();
        spies.push(spy);
        element.addEventListener('model-value-changed', spy);
      });
      input.modelValue = 'foo';
      spies.forEach((spy, index) => {
        const currentEvent = spy.firstCall.args[0];
        for (let i = index + 1; i < spies.length; i += 1) {
          const nextEvent = spies[i].firstCall.args[0];
          expect(currentEvent).not.to.eql(nextEvent);
        }
      });
    });
  });
});
