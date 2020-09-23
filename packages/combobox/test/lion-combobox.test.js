import '@lion/listbox/lion-option.js';
import { expect, fixture, html } from '@open-wc/testing';
import '../lion-combobox.js';
import { LionOptions } from '@lion/listbox/src/LionOptions.js';

/**
 * @typedef {import('../src/LionCombobox.js').LionCombobox} LionCombobox
 */

/**
 * @param {LionCombobox} el
 * @param {string} value
 */
function mimicUserTyping(el, value) {
  el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true }));
  // eslint-disable-next-line no-param-reassign
  el._inputNode.value = value;
  el._inputNode.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  el._overlayInvokerNode.dispatchEvent(new Event('keyup'));
}

/**
 * @param {LionCombobox} el
 */
function getFilteredOptionValues(el) {
  const options = el.formElements;
  /**
   * @param {{ style: { display: string; }; }} option
   */
  const filtered = options.filter(option => option.style.display !== 'none');
  /**
   * @param {{ value: any; }} option
   */
  return filtered.map(option => option.value);
}

/**
 * @param {{ autocomplete?:'none'|'list'|'both', matchMode?:'begin'|'all' }} [config]
 */
async function fruitFixture({ autocomplete, matchMode } = {}) {
  const el = /** @type {LionCombobox} */ (await fixture(html`
    <lion-combobox name="foo">
      <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
    </lion-combobox>
  `));
  if (autocomplete) {
    el.autocomplete = autocomplete;
  }
  if (matchMode) {
    el.matchMode = matchMode;
  }
  await el.updateComplete;
  return [el, el.formElements];
}

describe('lion-combobox', () => {
  describe('Structure', () => {
    it('has a listbox node', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      expect(el._listboxNode).to.exist;
      expect(el._listboxNode).to.be.instanceOf(LionOptions);
      expect(el.querySelector('[role=listbox]')).to.equal(el._listboxNode);
    });

    // it('has an LionComboboxInvoker component', async () => {
    //   const el = /** @type {LionCombobox} */ (await fixture(html`
    //     <lion-combobox name="foo">
    //       <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
    //       <lion-option .choiceValue="${'20'}">Item 2</lion-option>
    //     </lion-combobox>
    //   `));
    //   expect(el._comboboxNode).to.exist;
    //   expect(el._comboboxNode).to.be.instanceOf(LionComboboxInvoker);
    //   expect(el.querySelector('[role=combobox]')).to.equal(el._comboboxNode);
    // });
  });

  describe('Listbox visibility', () => {
    it('does not show listbox on focusin', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      expect(el.opened).to.equal(false);
      el._comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);
    });

    it('keeps showing listbox after select', async () => {
      /**
       * Scenario:
       * [1] user focuses textbox: listbox hidden
       * [2] user types char: listbox shows
       * [3] user selects "Artichoke": listbox closes, textbox gets value "Artichoke" and textbox still has focus
       * [4] user changes textbox value to "Artichoke": the listbox should show again
       */
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;
      expect(el.opened).to.equal(false);

      // step [1]
      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);

      // step [2]
      mimicUserTyping(el, 'c');
      await el.updateComplete;

      // step [3]
      options[0].click();
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(document.activeElement).to.equal(el._inputNode);

      // step [4]
      el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
      await el.updateComplete;
      expect(el.opened).to.equal(true);
    });

    it('hides (and clears) listbox on [Escape]', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      // open
      el._comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

      mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(el._inputNode.value).to.equal('Artichoke');

      el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.equal(false);
      expect(el._inputNode.value).to.equal('');
    });

    describe('Accessibility', () => {
      it('sets "aria-posinset" and "aria-setsize" on visible entries', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const options = el.formElements;
        expect(el.opened).to.equal(false);

        el._comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

        mimicUserTyping(el, 'art');
        await el.updateComplete;
        expect(el.opened).to.equal(true);

        const visibleOptions = options.filter(o => o.style.display !== 'none');
        visibleOptions.forEach((o, i) => {
          expect(o.getAttribute('aria-posinset')).to.equal(`${i + 1}`);
          expect(o.getAttribute('aria-setsize')).to.equal(`${visibleOptions.length}`);
        });
        /**
         * @param {{ style: { display: string; }; }} o
         */
        const hiddenOptions = options.filter(o => o.style.display === 'none');
        /**
         * @param {{ hasAttribute: (arg0: string) => any; }} o
         */
        hiddenOptions.forEach(o => {
          expect(o.hasAttribute('aria-posinset')).to.equal(false);
          expect(o.hasAttribute('aria-setsize')).to.equal(false);
        });
      });

      it('sets aria-hidden="true" on hidden entries', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const options = el.formElements;
        expect(el.opened).to.equal(false);

        el._comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

        mimicUserTyping(el, 'art');
        expect(el.opened).to.equal(true);
        await el.updateComplete;

        const visibleOptions = options.filter(o => o.style.display !== 'none');
        visibleOptions.forEach(o => {
          expect(o.hasAttribute('aria-hidden')).to.be.false;
        });
        const hiddenOptions = options.filter(o => o.style.display === 'none');
        hiddenOptions.forEach(o => {
          expect(o.getAttribute('aria-hidden')).to.equal('true');
        });
      });
    });
  });

  // Notice that the LionComboboxInvoker always needs to be used in conjunction with the
  // LionCombobox, and therefore will be tested integrated,
  describe('Invoker component integration', () => {
    it('has a combobox with a textbox', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      expect(el._comboboxNode.getAttribute('role')).to.equal('combobox');
      const slot = el._comboboxNode.querySelector('slot[name=input]');
      expect(slot.assignedNodes()[0]).to.equal(el._inputNode);
    });

    describe('Accessibility', () => {
      it('sets role="combobox" on textbox wrapper/listbox sibling', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `));
        expect(el._comboboxNode.getAttribute('role')).to.equal('combobox');
      });

      it('makes sure listbox node is not focusable', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `));
        expect(el._listboxNode.hasAttribute('tabindex')).to.be.false;
      });
    });
  });

  describe('Autocompletion', () => {
    it('has autocomplete "both" by default', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      expect(el.autocomplete).to.equal('both');
    });

    it('filters options when autocomplete is "both"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="both">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql(['Artichoke', 'Chard', 'Chicory']);
    });

    it('completes textbox when autocomplete is "both"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="both">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el._inputNode.value).to.equal('Chard');
      expect(el._inputNode.selectionStart).to.equal(2);
      expect(el._inputNode.selectionEnd).to.equal(el._inputNode.value.length);

      // We don't autocomplete when characters are removed
      mimicUserTyping(el, 'c'); // The user pressed backspace (number of chars decreased)
      expect(el._inputNode.value).to.equal('c');
      expect(el._inputNode.selectionStart).to.equal(el._inputNode.value.length);
    });

    it('filters options when autocomplete is "list"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="list">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql(['Artichoke', 'Chard', 'Chicory']);
      expect(el._inputNode.value).to.equal('ch');
    });

    it('does not filter options when autocomplete is "none"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="none">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      mimicUserTyping(el, 'ch');
      expect(getFilteredOptionValues(el)).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    describe('Accessibility', () => {
      it('synchronizes autocomplete option to textbox', async () => {
        let el;

        [el] = await fruitFixture({ autocomplete: 'both' });
        expect(el._inputNode.getAttribute('aria-autocomplete')).to.equal('both');

        [el] = await fruitFixture({ autocomplete: 'list' });
        expect(el._inputNode.getAttribute('aria-autocomplete')).to.equal('list');

        [el] = await fruitFixture({ autocomplete: 'none' });
        expect(el._inputNode.getAttribute('aria-autocomplete')).to.equal('none');
      });

      it('updates aria-activedescendant on textbox node', async () => {
        let el;
        let options;

        [el, options] = await fruitFixture({ autocomplete: 'none' });
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(null);
        expect(options[1].active).to.equal(false);

        [el, options] = await fruitFixture({ autocomplete: 'both', matchMode: 'begin' });
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          options[1].id,
        );
        expect(options[1].active).to.equal(true);

        el.autocomplete = 'list';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          options[1].id,
        );
        expect(options[1].active).to.equal(true);
      });
    });
  });

  // TODO: move parts to ListboxMixin test
  describe('Multiple Choice', () => {
    it('does not uncheck siblings', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;
      options[0].checked = true;
      options[1].checked = true;
      expect(options[0].checked).to.equal(true);
      expect(el.modelValue).to.eql(['Artichoke', 'Chard']);
    });

    it('does not close listbox on click/enter/space', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      // activate opened listbox
      el._comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'ch');
      await el.updateComplete;

      expect(el.opened).to.equal(true);
      const visibleOptions = el.formElements.filter(o => o.style.display !== 'none');
      visibleOptions[0].click();
      expect(el.opened).to.equal(true);
      // visibleOptions[1].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      // expect(el.opened).to.equal(true);
      // visibleOptions[2].dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      // expect(el.opened).to.equal(true);
    });

    // TODO: move to LionComboboxInvoker test
    describe.skip('Selected chips display', () => {
      // it('displays chips next to textbox, ordered based on user selection', async () => {
      //   const el = /** @type {LionCombobox} */ (await fixture(html`
      //     <lion-combobox name="foo" multiple-choice>
      //       <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      //       <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      //       <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      //       <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
      //     </lion-combobox>
      //   `));
      //   const options = el.formElements;
      //   options[2].checked = true; // Chicory
      //   options[0].checked = true; // Artichoke
      //   options[1].checked = true; // Chard
      //   const chips = Array.from(el._comboboxNode.querySelectorAll('.selection-chip'));
      //   expect(chips.map(elm => elm.textContent)).to.eql(['Chicory', 'Artichoke', 'Chard']);
      //   expect(el._comboboxNode.selectedElements).to.eql([options[2], options[0], options[1]]);
      // });
      // it('stages deletable chips on [Backspace]', async () => {
      //   const el = /** @type {LionCombobox} */ (await fixture(html`
      //     <lion-combobox name="foo" multiple-choice>
      //       <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      //       <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      //       <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      //     </lion-combobox>
      //   `));
      //   const options = el.formElements;
      //   options[0].checked = true; // Artichoke
      //   options[1].checked = true; // Chard
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.false;
      //   el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.true;
      //   el._inputNode.blur();
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.false;
      // });
      // it('deletes staged chip on [Backspace]', async () => {
      //   const el = /** @type {LionCombobox} */ (await fixture(html`
      //     <lion-combobox name="foo" multiple-choice>
      //       <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      //       <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      //       <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      //     </lion-combobox>
      //   `));
      //   const options = el.formElements;
      //   options[0].checked = true; // Artichoke
      //   options[1].checked = true; // Chard
      //   expect(el._comboboxNode.selectedElements).to.eql([options[0], options[1]]);
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.false;
      //   el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      //   expect(el._comboboxNode.selectedElements).to.eql([options[0], options[1]]);
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.true;
      //   el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      //   expect(el._comboboxNode.selectedElements).to.eql([options[0]]);
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.true;
      //   el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      //   expect(el._comboboxNode.selectedElements).to.eql([]);
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.true;
      //   el._inputNode.blur();
      //   expect(el._comboboxNode.removeChipOnNextBackspace).to.be.false;
      // });
    });

    describe('Accessibility', () => {
      it('adds aria-multiselectable="true" to listbox node', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          </lion-combobox>
        `));
        expect(el._listboxNode.getAttribute('aria-multiselectable')).to.equal('true');
      });

      it('does not allow "selectionFollowsFocus"', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          </lion-combobox>
        `));
        el._inputNode.focus();
        el._listboxNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
        expect(el._listboxNode.getAttribute('aria-multiselectable')).to.equal('true');
      });
    });
  });

  //
  describe('Match Mode', () => {
    it('has a default value of "all"', async () => {
      const [el] = await fruitFixture();
      expect(el.matchMode).to.equal('all');
    });

    it('will suggest partial matches (in the middle of the word) when set to "all"', async () => {
      const [el] = await fruitFixture();
      mimicUserTyping(/** @type {LionCombobox} */ (el), 'c');
      await el.updateComplete;
      expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    it('will only suggest beginning matches when set to "begin"', async () => {
      const [el] = await fruitFixture({ matchMode: 'begin' });
      mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql([
        'Chard',
        'Chicory',
      ]);
    });

    describe('Subclassers', () => {
      it('allows for custom matching functions', async () => {
        const [el] = await fruitFixture();
        /**
         * @param {{ value: any; }} option
         * @param {any} curValue
         */
        function onlyExactMatches(option, curValue) {
          return option.value === curValue;
        }
        el.filterOptionCondition = onlyExactMatches;
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'Chicory');
        await el.updateComplete;
        expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql(['Chicory']);
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'Chicor');
        await el.updateComplete;
        expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql([]);
      });
    });
  });

  // TODO: move to ListboxMixin tests
  describe('Orientation', () => {
    it('has a default value of "vertical"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        </lion-combobox>
      `));
      expect(el.orientation).to.equal('vertical');
      const options = el.formElements;

      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'a');
      await el.updateComplete;
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.false;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.true;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      // No response to horizontal arrows...

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      el.activeIndex = 1;
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.true;
    });

    it('uses left and right arrow keys when "horizontal"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" orientation="horizontal">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        </lion-combobox>
      `));
      expect(el.orientation).to.equal('horizontal');
      const options = el.formElements;

      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'a');
      await el.updateComplete;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.true;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      // No response to vertical arrows...
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;

      el.activeIndex = 1;
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.true;
    });

    describe('Accessibility', () => {
      it('adds aria-orientation attribute to listbox node', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" orientation="horizontal">
            <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          </lion-combobox>
        `));
        expect(el._listboxNode.getAttribute('aria-orientation')).to.equal('horizontal');
      });
    });
  });

  // TODO: Move to Listbox
  describe('Selection follows focus', () => {
    it('syncs activate option to checked', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" selection-follows-focus>
          <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;
      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'a');
      await el.updateComplete;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].checked).to.be.true;
      expect(options[1].checked).to.be.false;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].checked).to.be.false;
      expect(options[1].checked).to.be.true;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(options[0].checked).to.be.true;
      expect(options[1].checked).to.be.false;
    });
  });

  // TODO: move to ListboxMixin
  describe('Rotate Navigation', () => {
    it('stops navigation by default at end of option list', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Bla'}">Bla</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;
      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'a');
      await el.updateComplete;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;
      expect(options[2].active).to.be.false;

      el.activeIndex = 2;
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.false;
      expect(options[2].active).to.be.true;
    });

    it('when "rotate-navigation" provided, selects first option after navigated to next from last and vice versa', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" rotate-keyboard-navigation>
          <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Bla'}">Bla</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;
      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      mimicUserTyping(el, 'a');
      await el.updateComplete;
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.false;
      expect(options[2].active).to.be.true;

      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.true;
      expect(options[1].active).to.be.false;
      expect(options[2].active).to.be.false;

      // Extra check: regular navigation
      el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(options[0].active).to.be.false;
      expect(options[1].active).to.be.true;
      expect(options[2].active).to.be.false;
    });
  });
});
