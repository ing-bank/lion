import { Required } from '@lion/form-core';
import { expect, html, triggerBlurFor, triggerFocusFor, fixture } from '@open-wc/testing';
import { browserDetection } from '@lion/core';

import '@lion/core/src/differentKeyEventNamesShimIE.js';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-options.js';
import '../lion-select-rich.js';

describe('lion-select-rich interactions', () => {
  describe('Interaction mode', () => {
    it('autodetects interactionMode if not defined', async () => {
      const originalIsMac = browserDetection.isMac;

      browserDetection.isMac = true;
      const el = await fixture(html`
        <lion-select-rich><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich>
      `);
      expect(el.interactionMode).to.equal('mac');
      const el2 = await fixture(html`
        <lion-select-rich interaction-mode="windows/linux"
          ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
        >
      `);
      expect(el2.interactionMode).to.equal('windows/linux');

      browserDetection.isMac = false;
      const el3 = await fixture(html`
        <lion-select-rich><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich>
      `);
      expect(el3.interactionMode).to.equal('windows/linux');
      const el4 = await fixture(html`
        <lion-select-rich interaction-mode="mac"
          ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
        >
      `);
      expect(el4.interactionMode).to.equal('mac');
      browserDetection.isMac = originalIsMac;
    });

    it('derives selectionFollowsFocus and navigateWithinInvoker from interactionMode', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="windows/linux"
          ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
        >
      `);
      expect(el.selectionFollowsFocus).to.be.true;
      expect(el.navigateWithinInvoker).to.be.true;

      const el2 = await fixture(html`
        <lion-select-rich interaction-mode="mac"
          ><lion-option .choiceValue=${10}>Item 1</lion-option></lion-select-rich
        >
      `);
      expect(el2.selectionFollowsFocus).to.be.false;
      expect(el2.navigateWithinInvoker).to.be.false;
    });
  });

  describe('Invoker Keyboard navigation Windows', () => {
    it('navigates through list with [ArrowDown] [ArrowUp] keys checks the option while listbox unopened', async () => {
      function expectOnlyGivenOneOptionToBeChecked(options, selectedIndex) {
        options.forEach((option, i) => {
          if (i === selectedIndex) {
            expect(option.checked).to.be.true;
          } else {
            expect(option.checked).to.be.false;
          }
        });
      }

      const el = await fixture(html`
        <lion-select-rich interaction-mode="windows/linux">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
            <lion-option .choiceValue=${30}>Item 3</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      const options = Array.from(el.querySelectorAll('lion-option'));
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);

      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      expect(el.checkedIndex).to.equal(1);
      expectOnlyGivenOneOptionToBeChecked(options, 1);

      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);
    });
  });

  describe('Disabled', () => {
    it('invoker cannot be focused if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.tabIndex).to.equal(-1);
    });

    it('cannot be opened via click if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._invokerNode.click();
      expect(el.opened).to.be.false;
    });

    it('reflects disabled attribute to invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.hasAttribute('disabled')).to.be.true;
      el.removeAttribute('disabled');
      await el.updateComplete;
      expect(el._invokerNode.hasAttribute('disabled')).to.be.false;
    });
  });

  describe('Interaction states', () => {
    it('becomes touched if blurred once', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el.touched).to.be.false;
      await triggerFocusFor(el._invokerNode);
      await triggerBlurFor(el._invokerNode);
      expect(el.touched).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('sets [aria-invalid="true"] to "._invokerNode" when there is an error', async () => {
      const el = await fixture(html`
        <lion-select-rich .validators=${[new Required()]}>
          <lion-options slot="input">
            <lion-option .choiceValue=${null}>Please select a value</lion-option>
            <lion-option .modelValue=${{ value: 10, checked: true }}>Item 1</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      const invokerNode = el._invokerNode;
      const options = el.querySelectorAll('lion-option');
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invokerNode.getAttribute('aria-invalid')).to.equal('false');

      options[0].checked = true;
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invokerNode.getAttribute('aria-invalid')).to.equal('true');

      options[1].checked = true;
      await el.feedbackComplete;
      await el.updateComplete;
      expect(invokerNode.getAttribute('aria-invalid')).to.equal('false');
    });
  });
});
