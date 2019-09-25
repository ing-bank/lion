import { expect, fixture, html, aTimeout } from '@open-wc/testing';
import './keyboardEventShimIE.js';

import '@lion/option/lion-option.js';
import '../lion-options.js';
import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  it('does not have a tabindex', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-options slot="input"></lion-options>
      </lion-select-rich>
    `);
    expect(el.hasAttribute('tabindex')).to.be.false;
  });

  describe('Invoker', () => {
    it('generates an lion-select-invoker if no invoker is provided', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);

      expect(el._invokerNode).to.exist;
      expect(el._invokerNode.tagName).to.equal('LION-SELECT-INVOKER');
    });

    it('syncs the selected element to the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      const options = Array.from(el.querySelectorAll('lion-option'));
      expect(el._invokerNode.selectedElement).to.equal(options[0]);

      el.checkedIndex = 1;
      expect(el._invokerNode.selectedElement).to.equal(el.querySelectorAll('lion-option')[1]);
    });
  });

  describe('overlay', () => {
    it('should be closed by default', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.false;
    });

    it('shows/hides the listbox via opened attribute', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.opened = true;
      await el.updateComplete;
      expect(el._listboxNode.style.display).to.be.equal('inline-block');

      el.opened = false;
      await el.updateComplete;
      expect(el._listboxNode.style.display).to.be.equal('none');
    });

    it('syncs opened state with overlay shown', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      const outerEl = await fixture('<button>somewhere</button>');

      expect(el.opened).to.be.true;
      // a click on the button will trigger hide on outside click
      // which we then need to sync back to "opened"
      outerEl.click();
      await aTimeout();
      expect(el.opened).to.be.false;
    });

    it('will focus the listbox on open and invoker on close', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.opened = true;
      await el.updateComplete;
      expect(document.activeElement === el._listboxNode).to.be.true;
      expect(document.activeElement === el._invokerNode).to.be.false;

      el.opened = false;
      await el.updateComplete;
      expect(document.activeElement === el._listboxNode).to.be.false;
      expect(document.activeElement === el._invokerNode).to.be.true;
    });

    it('opens the listbox with checked option as active', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20} checked>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      el.opened = true;
      await el.updateComplete;
      const options = Array.from(el.querySelectorAll('lion-option'));

      expect(options[1].active).to.be.true;
      expect(options[1].checked).to.be.true;
    });
  });

  describe('interaction-mode', () => {
    it('allows to specify an interaction-mode which determines other behaviors', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.interactionMode).to.equal('mac');
    });
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [Enter] key via click handler', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._invokerNode.click();
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ ](Space) key via click handler', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._invokerNode.click();
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('closes the listbox with [Escape] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._listboxNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [Tab] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      // tab can only be caught via keydown
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });
  });

  describe('Mouse navigation', () => {
    it('opens the listbox via click on invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.false;
      el._invokerNode.click();
      expect(el.opened).to.be.true;
    });

    it('closes the listbox when an option gets clicked', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el.opened).to.be.true;
      el.querySelector('lion-option').click();
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Windows', () => {
    it('closes the listbox with [Enter] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el._listboxNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });
  });

  describe('Keyboard navigation Mac', () => {
    it('checks active item and closes the listbox with [Enter] key via click handler once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened interaction-mode="mac">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);

      // changes active but not checked
      el.activeIndex = 1;
      expect(el.checkedIndex).to.equal(0);

      el._listboxNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(el.opened).to.be.false;
      expect(el.checkedIndex).to.equal(1);
    });

    it('opens the listbox with [ArrowUp] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [ArrowDown] key', async () => {
      const el = await fixture(html`
        <lion-select-rich interaction-mode="mac">
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has the right references to its inner elements', async () => {
      const el = await fixture(html`
        <lion-select-rich label="age">
          <lion-options slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-labelledby')).to.contain(el._labelNode.id);
      expect(el._invokerNode.getAttribute('aria-labelledby')).to.contain(el._invokerNode.id);
      expect(el._invokerNode.getAttribute('aria-describedby')).to.contain(el._helpTextNode.id);
      expect(el._invokerNode.getAttribute('aria-describedby')).to.contain(el._feedbackNode.id);
      expect(el._invokerNode.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or not', async () => {
      // smoke test for overlay functionality
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input"></lion-options>
        </lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-expanded')).to.equal('false');
      el.opened = true;
      await el.updateComplete;
      await el.updateComplete; // need 2 awaits as overlay.show is an async function

      expect(el._invokerNode.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('Use cases', () => {
    it('works for complex array data', async () => {
      const objs = [
        { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
        { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
      ];
      const el = await fixture(html`
        <lion-select-rich label="Favorite color" name="color">
          <lion-options slot="input">
            ${objs.map(
              obj => html`
                <lion-option .modelValue=${{ value: obj, checked: false }}
                  >${obj.label}</lion-option
                >
              `,
            )}
          </lion-options>
        </lion-select-rich>
      `);
      expect(el.checkedValue).to.deep.equal({
        type: 'mastercard',
        label: 'Master Card',
        amount: 12000,
        active: true,
      });

      el.checkedIndex = 1;
      expect(el.checkedValue).to.deep.equal({
        type: 'visacard',
        label: 'Visa Card',
        amount: 0,
        active: false,
      });
    });
  });
});
