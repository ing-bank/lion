import { expect, fixture, html } from '@open-wc/testing';

import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-listbox.js';
import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  describe('values', () => {
    it('sync modelValue, checkedValue from/to the listbox', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el.modelValue).to.equal([{ value: 10, checked: true }, { value: 20, checked: false }]);
      expect(el.choiceValue).to.equal(10);
    });

    it('shows html content of the checked option inside the invoker', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10}>
              <span>Item 1</span>
            </lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el._invokerNode.contentWrapper).lightDom.to.equal('<span>Item 1</span>');
    });
  });

  describe('overlay', () => {
    it('should be closed by default', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.opened).to.be.false;
    });

    it('shows/hides the listbox via opened attribute', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      el.opened = true;
      await el.updateComplete;
      expect(el._listboxNode.style.display).to.be.equal('inline-block');

      el.opened = false;
      await el.updateComplete;
      expect(el._listboxNode.style.display).to.be.equal('none');
    });
  });

  describe('Disabled', () => {
    it('can not be focused if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled></lion-select-rich>
      `);
      expect(el.tabIndex).to.equal('-1');
    });

    it('should not open if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled opened></lion-select-rich>
      `);
      expect(el.opened).to.be.false;
      el.opend = true;
      expect(el.opened).to.be.false;
    });

    it('can not be navigated with keyboard if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="Item 1"></lion-option>
            <lion-option .choiceValue=${20} label="Item 2"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);
    });
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [enter] key', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('opens the listbox with [space] key', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
      await el.updateComplete;
      expect(el.opened).to.be.true;
    });

    it('closes the listbox with [enter] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened></lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [esc] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened></lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });

    it('closes the listbox with [tab] key once opened', async () => {
      const el = await fixture(html`
        <lion-select-rich opened></lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });

    it('navigates through list with [arrow up] [arrow down] keys', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="Item 1"></lion-option>
            <lion-option .choiceValue=${20} label="Item 2"></lion-option>
            <lion-option .choiceValue=${30} label="Item 3"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el.choiceValue).to.equal(10);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(20);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);
    });

    it('navigates to first and last option with [home] [end] keys', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="Item 1"></lion-option>
            <lion-option .choiceValue=${20} label="Item 2"></lion-option>
            <lion-option .choiceValue=${30} label="Item 3" checked></lion-option>
            <lion-option .choiceValue=${40} label="Item 4"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(40);
    });

    // TODO: nice to have
    it.skip('selects a value with single [character] key', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${'a'} label="A"></lion-option>
            <lion-option .choiceValue=${'b'} label="B"></lion-option>
            <lion-option .choiceValue=${'c'} label="C"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el.choiceValue).to.equal('a');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal('c');
    });

    it.skip('selects a value with multiple [character] keys', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${'bar'} label="Bar"></lion-option>
            <lion-option .choiceValue=${'far'} label="Far"></lion-option>
            <lion-option .choiceValue=${'foo'} label="Foo"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'F' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal('far');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'O' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal('foo');
    });
  });

  // TODO: nice to have
  describe.skip('Read only', () => {
    it('can be focused if readonly', async () => {
      const el = await fixture(html`
        <lion-select-rich readonly></lion-select-rich>
      `);
      expect(el.tabIndex).to.equal('-1');
    });

    it('can not open if readonly', async () => {
      const el = await fixture(html`
        <lion-select-rich readonly></lion-select-rich>
      `);
      el.opened = true;
      expect(el.opened).to.be.true;
    });

    it('can not be navigated with keyboard if readonly', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="Item 1"></lion-option>
            <lion-option .choiceValue=${20} label="Item 2"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);
    });
  });

  describe('Interaction states', () => {
    it('syncs dirty, touched, prefilled from listbox', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="Item 1"></lion-option>
            <lion-option .choiceValue=${20} label="Item 2"></lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el.dirty).to.be.false;
      el.checkedValue = 20;
      expect(el.dirty).to.be.true;

      expect(el.touched).to.be.false;
      el._invokerNode.focus();
      expect(el.touched).to.be.true;
    });

    it('is prefilled if there is a value on init', async () => {
      const el = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${10} label="">Item 1</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(el.prefilled).to.be.true;

      const elEmpty = await fixture(html`
        <lion-select-rich>
          <lion-listbox slot="input">
            <lion-option .choiceValue=${null}>Please select a value</lion-option>
            <lion-option .choiceValue=${10}>Item 1</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(elEmpty.prefilled).to.be.false;
    });
  });

  describe('Validation', () => {
    it('can be required', async () => {
      const lionSelect = await fixture(html`
        <lion-select-rich name="foo" .errorValidators="${[`required`]}">
          <lion-listbox slot="input">
            <lion-option .choiceValue=${null}>Please select a value</lion-option>
            <lion-option .choiceValue=${20}>Item 2</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(lionSelect.error.required).to.be.true;
      lionSelect.choiceValue = 20;
      expect(lionSelect.error.required).to.be.undefined;
    });
  });

  describe('Invoker', () => {
    it('can toggle the listbox', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.opened).to.be.false;
      el._invokerNode.click();
      expect(el.opened).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has the right references to its inner elements', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-labelledby')).to.equal(
        'ID_REF-label ID_RED-invoker',
      );
      expect(el._invokerNode.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or not', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('aria-expanded')).to.be.false;
      el.opened = true;
      expect(el._invokerNode.getAttribute('aria-expanded')).to.be.true;
    });

    it('has tabindex="0" to on the invoker element', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._invokerNode.getAttribute('tabindex')).to.equal('0');
    });
  });
});
