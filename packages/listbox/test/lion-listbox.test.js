import { expect, fixture, html } from '@open-wc/testing';
import { keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';

import '../lion-listbox.js';
import '../lion-option.js';

const keyCodes = {
  arrowDown: 40,
  arrowUp: 38,
};

describe('lion-listbox', () => {
  it('should register all its child options', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option value="nr1">Item 1</lion-option>
        <lion-option value="nr2">Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.__optionElements.length).to.equal(2);
  });

  it('should register all its child options despite grouping elements and separators', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option value="nr1">Item 1</lion-option>
        <lion-separator></lion-separator>
        <lion-option value="nr2">Item 2</lion-option>
        <lion-optgroup label="foo">
          <lion-option value="nr3">Item 3</lion-option>
        </lion-optgroup>
      </lion-listbox>
    `);
    expect(el.__optionElements.length).to.equal(3);
  });

  it('has an empty value by default', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option value="nr1">Item 1</lion-option>
        <lion-option value="nr2">Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.value).to.equal('');
  });

  it('has the selected option as value', async () => {
    const el = await fixture(html`
      <lion-listbox>
        <lion-option value="nr1" selected>Item 1</lion-option>
        <lion-option value="nr2">Item 2</lion-option>
      </lion-listbox>
    `);
    expect(el.value).to.equal('Item 1');
  });

  describe('User interaction', () => {
    it('deselects an option on setting focus on another option', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1" selected>Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.querySelectorAll('lion-option')[0].selected).to.be.true;
      el.querySelectorAll('lion-option')[1].click();
      expect(el.querySelectorAll('lion-option')[0].selected).to.be.false;
    });
  });

  // Not part of mvp. We will handle later.

  // Up until now, for all our $$slot('input')s, we don't have modelValues. Considering the
  // lion-listbox should be an equivalent of native <select> (but with extra styling capabilities),
  // it would be more consistent to keep the value a serialized String (could be space separated
  // list).
  // It would be up to the FormControl layer (one layer up, currently called SelectRich (extension
  // of LionField)) to add a modelValue which would be an array.
  // We might consider to create a lion-field-listbox and a lion-field-listbox-dropdown(listbox
  // with invoker button for dropdown on top)
  describe.skip('Multi select', () => {
    it('has an empty value of Type Array when multi by default', async () => {
      const el = await fixture(html`
        <lion-listbox multiple>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.value).to.equal([]);
    });

    it('has the selected options as value', async () => {
      const el = await fixture(html`
        <lion-listbox multiple>
          <lion-option value="nr1" selected>Item 1</lion-option>
          <lion-option value="nr2" selected>Item 2</lion-option>
          <lion-option value="nr3">Item 3</lion-option>
        </lion-listbox>
      `);
      expect(el.value).to.equal(['nr1', 'nr2']);
    });
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

    it('doesn\t "rotate" option selection on [up/down] arrow keys', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option selected value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      `);
      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');

      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');
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

    // TODO: nice to have
    it.skip('switch focus with single [character] key', async () => {
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

  describe('Accessibility', () => {
    it('creates unique ids for all children', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2" selected>Item 2</lion-option>
          <lion-option value="nr3" id="prededefined">Item 3</lion-option>
        </lion-listbox>
      `);
      expect(el.querySelectorAll('lion-option')[0].id).to.exist;
      expect(el.querySelectorAll('lion-option')[1].id).to.exist;
      expect(el.querySelectorAll('lion-option')[2].id).to.equal('predefined');
    });

    it('has a reference to the selected option', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1" id="first">Item 1</lion-option>
          <lion-option value="nr2" selected id="second">Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('aria-activedescendant')).to.equal('first');
      keyUpOn(el, keyCodes.arrowDown);
      expect(el.getAttribute('aria-activedescendant')).to.equal('second');
    });

    it('has aria-multiselectable attribute if multiple enabled', async () => {
      const el = await fixture(html`
        <lion-listbox multiple>
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('aria-multiselectable')).to.equal('true');
    });

    it('has tabindex="0" to on role="listbox" element', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
        </lion-listbox>
      `);
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('puts "aria-setsize" on all options', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <optgroup>
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr1">Item 1</lion-option>
          </optgroup>
        </lion-listbox>
      `);
      const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
      optionEls.forEach((oEl) => {
        expect(oEl.getAttribute('aria-setsize')).to.equal('3');
      });
    });

    it('puts "aria-posinset" on all options', async () => {
      const el = await fixture(html`
        <lion-listbox>
          <lion-option value="nr1">Item 1</lion-option>
          <optgroup>
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr1">Item 1</lion-option>
          </optgroup>
        </lion-listbox>
      `);
      const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
      optionEls.forEach((oEl, i) => {
        expect(oEl.getAttribute('aria-posinset')).to.equal(`${i + 1}`);
      });
    });
  });
});
