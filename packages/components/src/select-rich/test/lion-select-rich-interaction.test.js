import { expect, triggerBlurFor, triggerFocusFor, fixture } from '@open-wc/testing';
import { Required } from '@lion/components/form-core.js';
import { html } from 'lit/static-html.js';
import { browserDetection } from '@lion/components/core.js';

import '@lion/components/define/lion-option.js';

import '@lion/components/define/lion-listbox.js';
import '@lion/components/define/lion-select-rich.js';

/**
 * @typedef {import('../src/LionSelectRich').LionSelectRich} LionSelectRich
 * @typedef {import('@lion/listbox').LionOption} LionOption
 */

/**
 * @param {HTMLElement} el
 * @param {string} key
 * @param {string} code
 */
function mimicKeyPress(el, key, code = '') {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, code }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key, code }));
}

/**
 * @param {LionSelectRich} lionSelectEl
 */
function getNodes(lionSelectEl) {
  const {
    // @ts-ignore protected members allowed in test
    _invokerNode: invoker,
    // @ts-ignore protected members allowed in test
    _feedbackNode: feedback,
    // @ts-ignore protected members allowed in test
    _labelNode: label,
    // @ts-ignore protected members allowed in test
    _helpTextNode: helpText,
    // @ts-ignore protected members allowed in test
    _listboxNode: listbox,
    // @ts-ignore protected members allowed in test
  } = lionSelectEl;
  return {
    invoker,
    feedback,
    label,
    helpText,
    listbox,
  };
}

describe('lion-select-rich interactions', () => {
  describe('Interaction mode', () => {
    it('autodetects interactionMode if not defined', async () => {
      const originalIsMac = browserDetection.isMac;

      browserDetection.isMac = true;
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich>
        `)
      );
      expect(el.interactionMode).to.equal('mac');
      const el2 = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="windows/linux"
            ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
          >
        `)
      );
      expect(el2.interactionMode).to.equal('windows/linux');

      browserDetection.isMac = false;
      const el3 = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich>
        `)
      );
      expect(el3.interactionMode).to.equal('windows/linux');
      const el4 = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="mac"
            ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
          >
        `)
      );
      expect(el4.interactionMode).to.equal('mac');
      browserDetection.isMac = originalIsMac;
    });

    it('derives selectionFollowsFocus and navigateWithinInvoker from interactionMode', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="windows/linux"
            ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
          >
        `)
      );
      expect(el.selectionFollowsFocus).to.be.true;
      expect(el.navigateWithinInvoker).to.be.true;

      const el2 = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="mac"
            ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
          >
        `)
      );
      expect(el2.selectionFollowsFocus).to.be.false;
      expect(el2.navigateWithinInvoker).to.be.false;
    });
  });

  describe('Invoker Keyboard navigation Windows', () => {
    it('navigates through list with [ArrowDown] [ArrowUp] keys checks the option while listbox unopened', async () => {
      /**
       * @param {LionOption[]} options
       * @param {number} selectedIndex
       */
      function expectOnlyGivenOneOptionToBeChecked(options, selectedIndex) {
        /**
         * @param {{ checked: any; }} option
         * @param {any} i
         */
        options.forEach((option, i) => {
          if (i === selectedIndex) {
            expect(option.checked).to.be.true;
          } else {
            expect(option.checked).to.be.false;
          }
        });
      }

      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="windows/linux">
            <lion-options slot="input">
              <lion-option .choiceValue=${10}>Item 1</lion-option>
              <lion-option .choiceValue=${20}>Item 2</lion-option>
              <lion-option .choiceValue=${30}>Item 3</lion-option>
            </lion-options>
          </lion-select-rich>
        `)
      );

      const options = el.formElements;
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);

      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      expect(el.checkedIndex).to.equal(1);
      expectOnlyGivenOneOptionToBeChecked(options, 1);

      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);
    });

    it('checkes a value with [character] keys while listbox unopened', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich interaction-mode="windows/linux">
            <lion-options slot="input">
              <lion-option .choiceValue=${'red'}>Red</lion-option>
              <lion-option .choiceValue=${'teal'}>Teal</lion-option>
              <lion-option .choiceValue=${'turquoise'}>Turquoise</lion-option>
            </lion-options>
          </lion-select-rich>
        `)
      );

      // @ts-ignore [allow-private] in test
      mimicKeyPress(el, 't', 'KeyT');
      expect(el.checkedIndex).to.equal(1);

      mimicKeyPress(el, 'u', 'KeyU');
      expect(el.checkedIndex).to.equal(2);
    });
  });

  describe('Disabled', () => {
    it('invoker cannot be focused if disabled', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich disabled>
            <lion-options slot="input"></lion-options>
          </lion-select-rich>
        `)
      );
      const { invoker } = getNodes(el);
      expect(invoker.tabIndex).to.equal(-1);
    });

    it('cannot be opened via click if disabled', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich disabled>
            <lion-options slot="input"></lion-options>
          </lion-select-rich>
        `)
      );
      const { invoker } = getNodes(el);
      invoker.click();
      expect(el.opened).to.be.false;
    });

    it('reflects disabled attribute to invoker', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich disabled>
            <lion-options slot="input"></lion-options>
          </lion-select-rich>
        `)
      );
      const { invoker } = getNodes(el);
      expect(invoker.hasAttribute('disabled')).to.be.true;
      el.removeAttribute('disabled');
      await el.updateComplete;
      expect(invoker.hasAttribute('disabled')).to.be.false;
    });
  });

  describe('Interaction states', () => {
    it('becomes touched if blurred once', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich>
            <lion-options slot="input">
              <lion-option .choiceValue=${10}>Item 1</lion-option>
              <lion-option .choiceValue=${20}>Item 2</lion-option>
            </lion-options>
          </lion-select-rich>
        `)
      );
      const { invoker } = getNodes(el);
      expect(el.touched).to.be.false;
      await triggerFocusFor(invoker);
      await triggerBlurFor(invoker);
      expect(el.touched).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('sets [aria-invalid="true"] to "._invokerNode" when there is an error', async () => {
      const el = /** @type {LionSelectRich} */ (
        await fixture(html`
          <lion-select-rich .validators=${[new Required()]}>
            <lion-options slot="input">
              <lion-option .choiceValue=${null}>Please select a value</lion-option>
              <lion-option .modelValue=${{ value: 10, checked: true }}>Item 1</lion-option>
            </lion-options>
          </lion-select-rich>
        `)
      );
      const { invoker } = getNodes(el);
      const options = el.formElements;
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invoker.getAttribute('aria-invalid')).to.equal('false');

      options[0].checked = true;
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invoker.getAttribute('aria-invalid')).to.equal('true');

      options[1].checked = true;
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invoker.getAttribute('aria-invalid')).to.equal('false');
    });
  });
});
