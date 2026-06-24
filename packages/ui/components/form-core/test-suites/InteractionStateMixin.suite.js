import { LitElement } from 'lit';
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
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import { InteractionStateMixin, ValidateMixin, MinLength } from '@lion/ui/form-core.js';

/**
 * @param {{tagString?: string, allowedModelValueTypes?: Array.<ArrayConstructor | ObjectConstructor | NumberConstructor | BooleanConstructor | StringConstructor | DateConstructor>}} [customConfig]
 */
export function runInteractionStateMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    allowedModelValueTypes: [Array, Object, Number, Boolean, String, Date],
    ...customConfig,
  };

  describe(`InteractionStateMixin`, async () => {
    class IState extends InteractionStateMixin(ValidateMixin(LitElement)) {
      connectedCallback() {
        super.connectedCallback();
        this.tabIndex = 0;
      }

      set modelValue(v) {
        /** @type {*} */
        this._modelValue = v;
        this.dispatchEvent(new CustomEvent('model-value-changed', { bubbles: true }));
        this.requestUpdate('modelValue');
      }

      get modelValue() {
        return this._modelValue;
      }
    }

    cfg.tagString = cfg.tagString ? cfg.tagString : defineCE(IState);
    const tag = unsafeStatic(cfg.tagString);

    it('sets states to false on init', async () => {
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.false;
    });

    it('sets dirty when value changed', async () => {
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      expect(el.dirty).to.be.false;
      el.modelValue = 'foobar';
      expect(el.dirty).to.be.true;
    });

    it('sets touched to true when field left after focus', async () => {
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      await triggerFocusFor(el);
      await triggerBlurFor(el);
      expect(el.touched).to.be.true;
    });

    it('sets an attribute "touched', async () => {
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      el.touched = true;
      await el.updateComplete;
      expect(el.hasAttribute('touched')).to.be.true;
    });

    it('sets an attribute "dirty', async () => {
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      el.dirty = true;
      await el.updateComplete;
      expect(el.hasAttribute('dirty')).to.be.true;
    });

    it('sets an attribute "filled" if the input has a non-empty modelValue', async () => {
      const el = /** @type {IState} */ (
        await fixture(html`<${tag} .modelValue=${'hello'}></${tag}>`)
      );
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
      const el = /** @type {IState} */ (
        await fixture(
          html`<${tag} @touched-changed=${touchedSpy} @dirty-changed=${dirtySpy}></${tag}>`,
        )
      );

      el.touched = true;
      expect(touchedSpy.callCount).to.equal(1);

      el.dirty = true;
      expect(dirtySpy.callCount).to.equal(1);
    });

    it('sets prefilled once instantiated', async () => {
      const el = /** @type {IState} */ (
        await fixture(html`
        <${tag} .modelValue=${'prefilled'}></${tag}>
      `)
      );
      expect(el.prefilled).to.be.true;

      const nonPrefilled = /** @type {IState} */ (
        await fixture(html`
        <${tag} .modelValue=${''}></${tag}>
      `)
      );
      expect(nonPrefilled.prefilled).to.be.false;
    });

    // This method actually tests the implementation of the _isPrefilled method.
    it(`can determine "prefilled" based on different modelValue types
      (${cfg.allowedModelValueTypes.map(t => t.name).join(', ')})`, async () => {
      /** @typedef {{_inputNode: HTMLElement}} inputNodeInterface */

      const el = /** @type {IState & inputNodeInterface} */ (
        await fixture(html`<${tag}></${tag}>`)
      );

      /**
       * @param {*} modelValue
       */
      const changeModelValueAndLeave = modelValue => {
        const targetEl = el._inputNode || el;
        targetEl.dispatchEvent(new Event('focus', { bubbles: true }));
        el.modelValue = modelValue;
        // @ts-ignore [allow-protected] in test
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
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
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
      const el = /** @type {IState} */ (await fixture(html`<${tag}></${tag}>`));
      el.modelValue = 'Some value';
      expect(el.dirty).to.be.true;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.false;
      el.initInteractionState();
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
      expect(el.prefilled).to.be.true;
    });

    // Edge Case
    // Multiple Interactions: What happens if a user interacts with the input multiple times in quick succession? For instance, rapidly focusing and blurring the input. This could lead to unexpected behavior or race conditions.
    it('handles rapid focus and blur interactions', async () => {
      /** @type {HTMLElement & { touched: boolean, modelValue: any }} */
      const el = await fixture(html`<${tag}></${tag}>`);
      await triggerFocusFor(el);
      await triggerBlurFor(el);
      await triggerFocusFor(el);
      await triggerBlurFor(el);
      expect(el.touched).to.be.true;
    });

    // Edge Case
    // Dynamic Value Changes: How does the mixin handle programmatic changes to the value? If the value of the input is changed programmatically (e.g., via JavaScript), does it correctly update the dirty or prefilled states?
    it('updates states on programmatic value changes', async () => {
      /** @type {HTMLElement & { dirty: boolean, modelValue: string, prefilled: boolean }} */
      const el = await fixture(html`<${tag}></${tag}>`);
      el.modelValue = 'test';
      expect(el.dirty).to.be.true;
      expect(el.prefilled).to.be.true;
    });

    // Edge Case
    // Delayed Interactions: What if there's a delay in some interactions due to, for instance, asynchronous operations or animations? This could affect the timing of when states are set or updated.
    it('handles delayed interactions correctly', async () => {
      /** @type {HTMLElement & { touched: boolean }} */
      const el = await fixture(html`<${tag}></${tag}>`);
      await triggerFocusFor(el);
      await new Promise(r => setTimeout(r, 1000));
      await triggerBlurFor(el);
      expect(el.touched).to.be.true;
    });

    // Edge Case
    // Resetting State: How does the mixin handle resetting its state? If the input is reset to its initial state, does the mixin correctly reset its interaction states?
    it('handles resetting its state after interactions', async () => {
      /** @type {HTMLElement & { dirty: boolean, resetInteractionState: function, touched: boolean, modelValue: string }} */
      const el = await fixture(html`<${tag}></${tag}>`);
      el.modelValue = 'test';
      el.resetInteractionState();
      expect(el.dirty).to.be.false;
      expect(el.touched).to.be.false;
    });

    describe('Validation integration with states', () => {
      it('has .shouldShowFeedbackFor indicating for which type to show messages', async () => {
        const el = /** @type {IState} */ (
          await fixture(html`
          <${tag}></${tag}>
        `)
        );
        // @ts-ignore [allow-private] in test
        expect(el.shouldShowFeedbackFor).to.deep.equal([]);
        el.submitted = true;
        await el.updateComplete;
        // @ts-ignore [allow-private] in test
        expect(el.shouldShowFeedbackFor).to.deep.equal(['error']);
      });

      it('keeps the feedback component in sync', async () => {
        const el = /** @type {IState} */ (
          await fixture(html`
          <${tag} .validators=${[new MinLength(3)]}></${tag}>
        `)
        );
        const { _feedbackNode } = getFormControlMembers(el);

        await el.updateComplete;
        await el.feedbackComplete;
        expect(_feedbackNode.feedbackData).to.deep.equal([]);

        // has error but does not show/forward to component as showCondition is not met
        el.modelValue = '1';
        await el.updateComplete;
        await el.feedbackComplete;
        expect(_feedbackNode.feedbackData).to.deep.equal([]);

        el.submitted = true;
        await el.updateComplete;
        await el.feedbackComplete;
        expect(_feedbackNode.feedbackData?.length).to.equal(1);
      });
    });

    describe('SubClassers', () => {
      it('can override the `_leaveEvent`', async () => {
        class IStateCustomBlur extends InteractionStateMixin(LitElement) {
          constructor() {
            super();
            this._leaveEvent = 'custom-blur';
          }
        }
        const tagLeaveString = defineCE(IStateCustomBlur);
        const tagLeave = unsafeStatic(tagLeaveString);
        const el = /** @type {IStateCustomBlur} */ (
          await fixture(html`<${tagLeave}></${tagLeave}>`)
        );
        el.dispatchEvent(new Event('custom-blur'));
        expect(el.touched).to.be.true;
      });
    });
  });
}
