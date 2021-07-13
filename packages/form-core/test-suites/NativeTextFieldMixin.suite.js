import { LitElement } from '@lion/core';
import { getFormControlMembers } from '@lion/form-core/test-helpers';
import { defineCE, expect, fixture, html, triggerFocusFor, unsafeStatic } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { spy } from 'sinon';
import { NativeTextFieldMixin } from '../src/NativeTextFieldMixin.js';

/**
 * @typedef {import('../types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {ArrayConstructor | ObjectConstructor | NumberConstructor | BooleanConstructor | StringConstructor | DateConstructor | 'iban' | 'email'} modelValueType
 */

/**
 * @param {{tagString?: string, modelValueType?: modelValueType}} [customConfig]
 */
export function runNativeTextFieldMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    ...customConfig,
  };

  describe('NativeTextFieldMixin', () => {
    class NativeTextFieldClass extends NativeTextFieldMixin(LitElement) {
      get slots() {
        return {
          // NativeTextFieldClass needs to have an _inputNode defined in order to work...
          input: () => document.createElement('input'),
        };
      }
    }

    cfg.tagString = cfg.tagString ? cfg.tagString : defineCE(NativeTextFieldClass);
    const tag = unsafeStatic(cfg.tagString);

    it('preserves the caret position on value change', async () => {
      const el = /** @type {NativeTextFieldClass} */ (await fixture(html`<${tag}></${tag}>`));
      // @ts-ignore [allow-protected] in test
      const setValueAndPreserveCaretSpy = spy(el, '_setValueAndPreserveCaret');
      const { _inputNode } = getFormControlMembers(el);
      await triggerFocusFor(el);
      await el.updateComplete;
      _inputNode.value = 'hello world';
      _inputNode.selectionStart = 2;
      _inputNode.selectionEnd = 2;
      el.value = 'hey there universe';
      expect(setValueAndPreserveCaretSpy.calledOnce).to.be.true;
      expect(_inputNode.selectionStart).to.equal(2);
      expect(_inputNode.selectionEnd).to.equal(2);
    });

    it('move focus to a next focusable element after writing some text', async () => {
      const el = /** @type {NativeTextFieldClass} */ (await fixture(html`<${tag}></${tag}>`));
      // @ts-ignore [allow-protected] in test
      const setValueAndPreserveCaretSpy = spy(el, '_setValueAndPreserveCaret');
      const { _inputNode } = getFormControlMembers(el);
      await triggerFocusFor(el);
      await el.updateComplete;
      expect(document.activeElement).to.equal(_inputNode);
      await sendKeys({
        press: 'h',
      });
      await sendKeys({
        press: 'Tab',
      });
      expect(document.activeElement).to.not.equal(_inputNode);
      expect(setValueAndPreserveCaretSpy.calledOnce).to.be.false;
    });
  });
}
