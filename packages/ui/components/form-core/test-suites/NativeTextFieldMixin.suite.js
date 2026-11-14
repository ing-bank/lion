import { expect, fixture, html, triggerFocusFor, unsafeStatic } from '@open-wc/testing';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import { NativeTextFieldMixin } from '@lion/ui/form-core.js';
import { sendKeys } from '@web/test-runner-commands';
import { browserDetection } from '@lion/ui/core.js';
import { LitElement } from 'lit';
import { spy } from 'sinon';

import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';

/**
 * @typedef {ArrayConstructor | ObjectConstructor | NumberConstructor | BooleanConstructor | StringConstructor | DateConstructor | 'iban' | 'email'} modelValueType
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

/**
 * Runs the `NativeTextFieldMixin` behavioural suite. The caller hands the element to run against;
 * leaving `host` out keeps the element this suite builds from the mixin.
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}, {modelValueType?: modelValueType}>} [customConfig]
 */
export function runNativeTextFieldMixinSuite({ classes = {}, tagString: legacyTagString } = {}) {
  describe('NativeTextFieldMixin', () => {
    class NativeTextFieldClass extends NativeTextFieldMixin(LitElement) {
      get slots() {
        return {
          // NativeTextFieldClass needs to have an _inputNode defined in order to work...
          input: () => document.createElement('input'),
        };
      }
    }

    const tag = unsafeStatic(resolveSuiteTag(classes?.host, legacyTagString, NativeTextFieldClass));

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

    it('delegates selectionStart and selectionEnd to its native text field', async () => {
      const el = /** @type {NativeTextFieldClass} */ (await fixture(html`<${tag}></${tag}>`));
      const { _inputNode } = getFormControlMembers(el);
      _inputNode.value = 'hello world';
      _inputNode.setSelectionRange(1, 2);
      expect(el.selectionStart).to.equal(1);
      expect(el.selectionEnd).to.equal(2);

      // Also when the caret is at the very start
      _inputNode.setSelectionRange(0, 0);
      el.selectionStart = 3;
      el.selectionEnd = 5;
      expect(_inputNode.selectionStart).to.equal(3);
      expect(_inputNode.selectionEnd).to.equal(5);
      expect(el.selectionStart).to.equal(3);
      expect(el.selectionEnd).to.equal(5);
    });

    it('has selectionStart and selectionEnd 0 when its native field has no selection', async () => {
      const el = /** @type {NativeTextFieldClass} */ (await fixture(html`<${tag}></${tag}>`));
      const { _inputNode } = getFormControlMembers(el);
      if (!(_inputNode instanceof HTMLInputElement)) {
        return;
      }
      // input types like 'number' do not support selection (selectionStart is null)
      _inputNode.type = 'number';
      expect(el.selectionStart).to.equal(0);
      expect(el.selectionEnd).to.equal(0);
      expect(() => {
        el.selectionStart = 1;
        el.selectionEnd = 1;
      }).to.not.throw();
    });

    it('moves focus to a next focusable element after writing some text', async () => {
      const el = /** @type {NativeTextFieldClass} */ (await fixture(html`<${tag}></${tag}>`));
      // @ts-ignore [allow-protected] in test
      const setValueAndPreserveCaretSpy = spy(el, '_setValueAndPreserveCaret');
      const { _inputNode } = getFormControlMembers(el);
      await triggerFocusFor(el);
      await el.updateComplete;
      expect(isActiveElement(_inputNode)).to.be.true;
      await sendKeys({ press: 'h' });
      await sendKeys({ press: 'Tab' });

      expect(setValueAndPreserveCaretSpy.calledOnce).to.be.false;

      // TODO: This seems to work in practice, but not in the test. Investigate.
      if (browserDetection.isMacSafari || browserDetection.isFirefox) {
        return;
      }

      expect(isActiveElement(_inputNode)).to.be.false;
    });
  });
}
