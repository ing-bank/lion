import { LitElement } from '@lion/core';
import {
  defineCE,
  expect,
  fixture,
  html,
  triggerBlurFor,
  triggerFocusFor,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';
import { InteractionStateMixin } from '../src/InteractionStateMixin.js';

export function runInteractionStateMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    allowedModelValueTypes: [Array, Object, Number, Boolean, String, Date],
    ...customConfig,
  };

  describe(`InteractionStateMixin`, async () => {
    let tag;
    before(() => {
      if (!cfg.tagString) {
        cfg.tagString = defineCE(
          class IState extends InteractionStateMixin(LitElement) {
            connectedCallback() {
              super.connectedCallback();
              this.tabIndex = 0;
            }

            set modelValue(v) {
              this._modelValue = v;
              this.dispatchEvent(new CustomEvent('model-value-changed', { bubbles: true }));
              this.requestUpdate('modelValue');
            }

            get modelValue() {
              return this._modelValue;
            }
          },
        );
      }
      tag = unsafeStatic(cfg.tagString);
    });

    it('sets states to false on init', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('sets dirty when value changed', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      expect(el.dirty).to.be.false;
      el.modelValue = 'foobar';
      expect(el.dirty).to.be.true;
    });

    it('sets touched to true when field left after focus', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      await triggerFocusFor(el);
      await triggerBlurFor(el);
      expect(el.touched).to.be.true;
    });

    it('sets an attribute "touched', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      el.touched = true;
      await el.updateComplete;
      expect(el.hasAttribute('touched')).to.be.true;
    });

    it('sets an attribute "dirty', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      el.dirty = true;
      await el.updateComplete;
      expect(el.hasAttribute('dirty')).to.be.true;
    });

    it('sets an attribute "filled" if the input has a non-empty modelValue', async () => {
      const el = await fixture(html`<${tag} .modelValue=${'hello'}></${tag}>`);
      expect(el.hasAttribute('filled')).to.equal(true);
      el.modelValue = '';
      await el.updateComplete;
      expect(el.hasAttribute('filled')).to.equal(false);
      el.modelValue = 'foo';
      await el.updateComplete;
      expect(el.hasAttribute('filled')).to.equal(true);
    });

    it('fires "(touched|dirty)-state-changed" event when state changes', async () => {
      const touchedSpy = sinon.spy();
      const dirtySpy = sinon.spy();
      const el = await fixture(
        html`<${tag} @touched-changed=${touchedSpy} @dirty-changed=${dirtySpy}></${tag}>`,
      );

      el.touched = true;
      expect(touchedSpy.callCount).to.equal(1);

      el.dirty = true;
      expect(dirtySpy.callCount).to.equal(1);
    });

    it('sets prefilled once instantiated', async () => {
      const el = await fixture(html`
        <${tag} .modelValue=${'prefilled'}></${tag}>
      `);
      expect(el.prefilled).to.be.true;

      const nonPrefilled = await fixture(html`
        <${tag} .modelValue=${''}></${tag}>
      `);
      expect(nonPrefilled.prefilled).to.be.false;
    });

    // This method actually tests the implementation of the _isPrefilled method.
    it(`can determine "prefilled" based on different modelValue types
      (${cfg.allowedModelValueTypes.map(t => t.name).join(', ')})`, async () => {
      const el = await fixture(html`<${tag}></${tag}>`);

      const changeModelValueAndLeave = modelValue => {
        const targetEl = el._inputNode || el;
        targetEl.dispatchEvent(new Event('focus', { bubbles: true }));
        el.modelValue = modelValue;
        targetEl.dispatchEvent(new Event(el._leaveEvent, { bubbles: true }));
      };

      // Prefilled
      if (cfg.allowedModelValueTypes.includes(Array)) {
        changeModelValueAndLeave(['not-empty']);
        expect(el.prefilled, 'not empty array should be "prefilled"').to.be.true;
        changeModelValueAndLeave([]);
        expect(el.prefilled, 'empty array should not be "prefilled"').to.be.false;
      }
      if (cfg.allowedModelValueTypes.includes(Object)) {
        changeModelValueAndLeave({ not: 'empty' });
        expect(el.prefilled, 'not empty object should be "prefilled"').to.be.true;
        changeModelValueAndLeave({});
        expect(el.prefilled, 'empty object should not be "prefilled"').to.be.false;
      }
      if (cfg.allowedModelValueTypes.includes(Number)) {
        changeModelValueAndLeave(0);
        expect(el.prefilled, 'numbers should be "prefilled"').to.be.true;
      }
      if (cfg.allowedModelValueTypes.includes(String)) {
        changeModelValueAndLeave(false);
        expect(el.prefilled, 'booleans should be "prefilled"').to.be.true;
        changeModelValueAndLeave('');
        expect(el.prefilled, 'empty string should not be "prefilled"').to.be.false;
      }
      if (cfg.allowedModelValueTypes.includes(Date)) {
        changeModelValueAndLeave(new Date());
        expect(el.prefilled, 'Dates should be "prefilled"').to.be.true;
      }

      // Not prefilled
      changeModelValueAndLeave(null);
      expect(el.prefilled, 'null should not be "prefilled"').to.be.false;
      changeModelValueAndLeave(undefined);
      expect(el.prefilled, 'undefined should not be "prefilled"').to.be.false;
    });

    it('has a method resetInteractionState()', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      el.dirty = true;
      el.touched = true;
      el.prefilled = true;
      el.submitted = true;
      el.resetInteractionState();
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.false;
      expect(el.submitted).to.be.false;

      el.dirty = true;
      el.touched = true;
      el.prefilled = false;
      el.submitted = true;
      el.modelValue = 'Some value';
      el.resetInteractionState();
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.true;
      expect(el.submitted).to.be.false;
    });

    it('has a method initInteractionState()', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      el.modelValue = 'Some value';
      expect(el.dirty).to.be.true;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.false;
      el.initInteractionState();
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.true;
    });

    describe('SubClassers', () => {
      it('can override the `_leaveEvent`', async () => {
        const tagLeaveString = defineCE(
          class IState extends InteractionStateMixin(LitElement) {
            constructor() {
              super();
              this._leaveEvent = 'custom-blur';
            }
          },
        );
        const tagLeave = unsafeStatic(tagLeaveString);
        const el = await fixture(html`<${tagLeave}></${tagLeave}>`);
        el.dispatchEvent(new Event('custom-blur'));
        expect(el.touched).to.be.true;
      });
    });
  });
}
