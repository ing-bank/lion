import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';

/**
 * @typedef {import('@lion/input').LionInput} LionInput
 * @typedef {import('@lion/fieldset').LionFieldset} LionFieldset
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const inputFixture = /** @type {(arg: TemplateResult) => Promise<LionInput>} */ (fixture);
const fieldsetFixture = /** @type {(arg: TemplateResult) => Promise<LionFieldset>} */ (fixture);

describe('model value event', () => {
  describe('form path', () => {
    it('should be property', async () => {
      const spy = sinon.spy();
      const input = await inputFixture(html`<lion-input></lion-input>`);
      input.addEventListener('model-value-changed', spy);
      input.modelValue = 'woof';
      const e = spy.firstCall.args[0];
      expect(e.detail).to.have.property('formPath');
    });

    it('should contain dispatching field', async () => {
      const spy = sinon.spy();
      const input = await inputFixture(html`<lion-input></lion-input>`);
      input.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input]);
    });

    it('should contain field and group', async () => {
      const spy = sinon.spy();
      const fieldset = await fieldsetFixture(html`
        <lion-fieldset name="fieldset">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);
      await fieldset.registrationComplete;
      fieldset.addEventListener('model-value-changed', spy);
      const input = /** @type {LionInput} */ (fieldset.querySelector('lion-input'));
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, fieldset]);
    });

    it('should contain deep elements', async () => {
      const spy = sinon.spy();
      const grandparent = await fieldsetFixture(html`
        <lion-fieldset name="grandparent">
          <lion-fieldset name="parent">
            <lion-input name="input"></lion-input>
          </lion-fieldset>
        </lion-fieldset>
      `);
      const parent = /** @type {LionFieldset} */ (grandparent.querySelector('[name=parent]'));
      const input = /** @type {LionInput} */ (grandparent.querySelector('[name=input]'));
      await grandparent.registrationComplete;
      await parent.registrationComplete;

      grandparent.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, parent, grandparent]);
    });

    it('should ignore elements that are not fields or fieldsets', async () => {
      const spy = sinon.spy();
      const grandparent = await fieldsetFixture(html`
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
      const parent = /** @type {LionFieldset} */ (grandparent.querySelector('[name=parent]'));
      const input = /** @type {LionInput} */ (grandparent.querySelector('[name=input]'));
      await grandparent.registrationComplete;
      await parent.registrationComplete;

      grandparent.addEventListener('model-value-changed', spy);
      input.modelValue = 'foo';
      const e = spy.firstCall.args[0];
      expect(e.detail.formPath).to.eql([input, parent, grandparent]);
    });
  });

  describe('signature', () => {
    /** @type {?} */
    let e;
    beforeEach(async () => {
      const spy = sinon.spy();
      const el = await inputFixture(html`<lion-input></lion-input>`);
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
      const grandparent = await fieldsetFixture(html`
        <lion-fieldset name="grandparent">
          <lion-fieldset name="parent">
            <lion-input name="input"></lion-input>
          </lion-fieldset>
        </lion-fieldset>
      `);
      const parent = /** @type {LionFieldset} */ (grandparent.querySelector('[name="parent"]'));
      const input = /** @type {LionInput} */ (grandparent.querySelector('[name="input"]'));
      await grandparent.registrationComplete;
      await parent.registrationComplete;

      /** @type {sinon.SinonSpy[]} */
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
