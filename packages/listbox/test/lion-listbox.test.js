import { expect, fixture, html } from '@open-wc/testing';

import '../lion-listbox.js';
import '../lion-option.js';

describe('lion-listbox', () => {
  it('should register all its child options', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option>Item 1</lion-option>
        <lion-option>Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.__optionElements.length).to.equal(2);
  });

  it('should register all its child options despite optgroups or separators', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option>Item 1</lion-option>
        <lion-separator></lion-separator>
        <lion-option>Item 2</lion-option>
        <lion-optgroup label="foo">
          <lion-option>Item 3</lion-option>
        </lion-optgroup>
      </lion-listbox>
    `);
    expect(el.__optionElements.length).to.equal(3);
  });

  it('has an empty value by default', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option>Item 1</lion-option>
        <lion-option>Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.value).to.equal('');
  });

  it('has an empty value of Type Arry when multi by default', async () => {
    const el = await fixture(html`
      <lion-listbox multi>
        <lion-option>Item 1</lion-option>
        <lion-option>Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.value).to.equal({});
  });

  it('can set focused on an option', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option>Item 1</lion-option>
        <lion-option>Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.__optionElements.length).to.equal(3);
  });

  describe('Keyboard navigation', () => {
    it('navigates through listbox with [arrow up] [arrow down] keys', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2" selected>Item 2</lion-option>
          <lion-option value="nr3">Item 3</lion-option>
          <lion-option value="nr4">Item 4</lion-option>
        </lion-listbox>
      `);
      el.querySelectorAll('lion-option')[1].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[1].focused).to.be.true;
    });

    it('navigates to top and bottom with [home] [end] keys', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
          <lion-option value="nr3">Item 3</lion-option>
          <lion-option value="nr4">Item 4</lion-option>
        </lion-listbox>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[0].focused).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[3].focused).to.be.true;
    });

    it('selects an option with [enter] key', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
          <lion-option value="nr3">Item 3</lion-option>
          <lion-option value="nr4">Item 4</lion-option>
        </lion-listbox>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[3]).to.be.equal('inline-block');

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('switch focus with single [character] key', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="aaa">Aaa</lion-option>
          <lion-option value="bbb">Bbb</lion-option>
          <lion-option value="ccc">Ccc</lion-option>
        </lion-listbox>
      `);
      el.querySelectorAll('lion-option')[0].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;
    });

    it('switch focus to specific element with multiple [character] keys', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="bar">Bar</lion-option>
          <lion-option value="far">Far</lion-option>
          <lion-option value="Foo">Foo</lion-option>
        </lion-listbox>
      `);
      el.querySelectorAll('lion-option')[0].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'F' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'O' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;
    });
  });

  describe('A11y', () => {
    it('has the right aria attributes', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option>Item 1</lion-option>
          <lion-option selected>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('aria-labelledby')).to.equal('ID_REF-label');
      expect(el.getAttribute('aria-activedescendant')).to.equal('ID_REF-selected-option');
    });

    it('has aria-multiselectable attribute if multi enabled', async () => {
      const el = await fixture(html`
        <lion-listbox multi>
          <lion-option>Item 1</lion-option>
          <lion-option>Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('aria-multiselectable')).to.be.true;
    });

    it('has tabindex="-1" to be focusable', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option>Item 1</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('tabindex')).to.equal('-1');
    });
  });
});
