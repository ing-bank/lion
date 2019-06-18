import { expect, fixture, html } from '@open-wc/testing';

import '../lion-option.js';
import '../lion-listbox.js';

describe('lion-listbox', () => {
  describe('values', () => {
    it('requires a set name', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.modelValue).to.equal([{ value: 10, checked: true }, { value: 20, checked: false }]);
      expect(el.choiceValue).to.equal(10);
    });

    it('has the first element as default selection', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.modelValue).to.equal([{ value: 10, checked: true }, { value: 20, checked: false }]);
      expect(el.choiceValue).to.equal(10);
    });

    it('allows null choiceValue', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${null}>Please select value</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.modelValue).to.equal([
        { value: null, checked: true },
        { value: 20, checked: false },
      ]);
      expect(el.checkedValue).to.be.null;
    });

    it('has the checked option as modelValue', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} checked>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.modelValue).to.equal([{ value: 10, checked: false }, { value: 20, checked: true }]);
      expect(el.checkedValue).to.equal(20);
    });
  });

  describe('Disabled', () => {
    it('can not be focused if disabled', async () => {
      const el = await fixture(html`
        <lion-select-rich disabled> </lion-select-rich>
      `);
      expect(el.tabIndex).to.equal('-1');
    });

    it('can not be navigated with keyboard if disabled', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);
    });
  });

  describe('Keyboard navigation', () => {
    it('navigates through list with [arrow up] [arrow down] keys', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
          <lion-option .choiceValue=${30}>Item 3</lion-option>
        </lion-listbox>
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
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
          <lion-option .choiceValue=${30} checked>Item 3</lion-option>
          <lion-option .choiceValue=${40}>Item 4</lion-option>
        </lion-listbox>
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
        <lion-listbox name="foo">
          <lion-option .choiceValue=${'a'}>A</lion-option>
          <lion-option .choiceValue=${'b'}>B</lion-option>
          <lion-option .choiceValue=${'c'}>C</lion-option>
        </lion-listbox>
      `);
      expect(el.choiceValue).to.equal('a');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal('c');
    });

    it.skip('selects a value with multiple [character] keys', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${'bar'}>Bar</lion-option>
          <lion-option .choiceValue=${'far'}>Far</lion-option>
          <lion-option .choiceValue=${'foo'}>Foo</lion-option>
        </lion-listbox>
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
        <lion-listbox readonly> </lion-listbox>
      `);
      expect(el.tabIndex).to.equal('-1');
    });

    it('can not be navigated with keyboard if readonly', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.choiceValue).to.equal(10);
    });
  });

  describe('Interaction states', () => {
    it('becomes dirty if valued changed once', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.dirty).to.be.false;
      el.checkedValue = 20;
      await el.updateComplete;
      expect(el.dirty).to.be.true;
    });

    it('becomes touched if becomes focused once', async () => {
      const el = await fixture(html``);
      expect(el.touched).to.be.false;
      el._invokerNode.focus();
      expect(el.touched).to.be.true;
    });

    it('is prefilled if there is a value on init', async () => {
      const el = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-listbox>
      `);
      expect(el.prefilled).to.be.true;

      const elEmpty = await fixture(html`
        <lion-listbox name="foo">
          <lion-option .choiceValue=${null}>Please select a value</lion-option>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
        </lion-listbox>
      `);
      expect(elEmpty.prefilled).to.be.false;
    });
  });

  describe('Validation', () => {
    it('can be required', async () => {
      const lionSelect = await fixture(html`
        <lion-listbox name="foo" .errorValidators=${['required']}>
          <lion-option .choiceValue=${null}>Please select a value</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(lionSelect.error.required).to.be.true;
      lionSelect.choiceValue = 20;
      expect(lionSelect.error.required).to.be.undefined;
    });
  });

  describe('Accessibility', () => {
    it('creates unique ids for all children', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20} selected>Item 2</lion-option>
          <lion-option .choiceValue=${30} id="prededefined">Item 3</lion-option>
        </lion-listbox>
      `);
      expect(el.querySelectorAll('lion-option')[0].id).to.exist;
      expect(el.querySelectorAll('lion-option')[1].id).to.exist;
      expect(el.querySelectorAll('lion-option')[2].id).to.equal('predefined');
    });

    it('has a reference to the selected option', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option .choiceValue=${10} id="first">Item 1</lion-option>
          <lion-option .choiceValue=${20} selected id="second">Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('aria-activedescendant')).to.equal('first');
      keyUpOn(el, keyCodes.arrowDown);
      expect(el.getAttribute('aria-activedescendant')).to.equal('second');
    });

    it('puts "aria-setsize" on all options to indicate the total amount of options', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
          <lion-option .choiceValue=${30}>Item 3</lion-option>
        </lion-listbox>
      `);
      const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
      optionEls.forEach(oEl => {
        expect(oEl.getAttribute('aria-setsize')).to.equal('3');
      });
    });

    it('puts "aria-posinset" on all options to indicate their position in the listbox', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>Item 2</lion-option>
          <lion-option .choiceValue=${30}>Item 3</lion-option>
        </lion-listbox>
      `);
      const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
      optionEls.forEach((oEl, i) => {
        expect(oEl.getAttribute('aria-posinset')).to.equal(`${i + 1}`);
      });
    });
  });
});
