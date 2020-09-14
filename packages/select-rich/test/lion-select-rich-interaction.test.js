import { Required } from '@lion/form-core';
import { expect, html, triggerBlurFor, triggerFocusFor, fixture } from '@open-wc/testing';

import '@lion/core/src/differentKeyEventNamesShimIE.js';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-options.js';
import '../lion-select-rich.js';

describe('lion-select-rich interactions', () => {
  describe('Keyboard navigation', () => {
    it('navigates to first and last option with [Home] and [End] keys', async () => {
      const el = await fixture(html`
        <lion-select-rich opened interaction-mode="windows/linux">
          <lion-options slot="input" name="foo">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
            <lion-option .choiceValue=${30} checked>Item 3</lion-option>
            <lion-option .choiceValue=${40}>Item 4</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el.modelValue).to.equal(30);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(el.modelValue).to.equal(10);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      expect(el.modelValue).to.equal(40);
    });
  });

  describe('Keyboard navigation Windows', () => {
    it('navigates through list with [ArrowDown] [ArrowUp] keys activates and checks the option', async () => {
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
        <lion-select-rich opened interaction-mode="windows/linux">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
            <lion-option .choiceValue=${30}>Item 3</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      const options = Array.from(el.querySelectorAll('lion-option'));
      expect(el.activeIndex).to.equal(0);
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(el.activeIndex).to.equal(1);
      expect(el.checkedIndex).to.equal(1);
      expectOnlyGivenOneOptionToBeChecked(options, 1);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(el.activeIndex).to.equal(0);
      expect(el.checkedIndex).to.equal(0);
      expectOnlyGivenOneOptionToBeChecked(options, 0);
    });

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
    it('cannot be focused if disabled', async () => {
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
