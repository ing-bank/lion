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
