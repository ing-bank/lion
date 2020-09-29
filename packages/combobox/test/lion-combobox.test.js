import '@lion/listbox/lion-option.js';
import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import '../lion-combobox.js';
import { LionOptions } from '@lion/listbox/src/LionOptions.js';
import { browserDetection, LitElement } from '@lion/core';

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
  el._overlayInvokerNode.dispatchEvent(new Event('keydown'));
}

/**
 * @param {LionCombobox} el
 */
function getFilteredOptionValues(el) {
  const options = el.formElements;
  /**
   * @param {{ style: { display: string; }; }} option
   */
  const filtered = options.filter(option => option.getAttribute('aria-hidden') !== 'true');
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

    it('has a textbox element', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      expect(el._comboboxNode).to.exist;
      expect(el.querySelector('[role=combobox]')).to.equal(el._comboboxNode);
    });
  });

  describe('Values', () => {
    it('syncs modelValue with textbox', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" .modelValue="${'10'}">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      expect(el._inputNode.value).to.equal('10');

      el.modelValue = '20';
      await el.updateComplete;
      expect(el._inputNode.value).to.equal('20');
    });
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

    it('shows listbox again after select and char keydown', async () => {
      /**
       * Scenario:
       * [1] user focuses textbox: listbox hidden
       * [2] user types char: listbox shows
       * [3] user selects "Artichoke": listbox closes, textbox gets value "Artichoke" and textbox
       * still has focus
       * [4] user changes textbox value to "Artichoke": the listbox should show again
       */
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

      // step [1]
      el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);

      // step [2]
      mimicUserTyping(el, 'c');
      await el.updateComplete;
      expect(el.opened).to.equal(true);

      // step [3]
      options[0].click();
      await el.updateComplete;
      expect(el.opened).to.equal(false);
      expect(document.activeElement).to.equal(el._inputNode);

      // step [4]
      el._inputNode.value = '';
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

    it('hides listbox on [Tab]', async () => {
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

      el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.opened).to.equal(false);
      expect(el._inputNode.value).to.equal('Artichoke');
    });

    it('clears checkedIndex on empty text', async () => {
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
      expect(el.checkedIndex).to.equal(0);

      el._inputNode.value = '';
      mimicUserTyping(el, '');
      el.opened = false;
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(-1);
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

      /**
       * Note that we use aria-hidden instead of 'display:none' to allow for animations
       * (like fade in/out)
       */
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

  describe('Selection display', () => {
    class MySelectionDisplay extends LitElement {
      onComboboxElementUpdated(changedProperties) {
        if (changedProperties.has('modelValue') && this.comboboxElement.multipleChoice) {
          // do smth..
        }
      }
    }
    const selectionDisplayTag = unsafeStatic(defineCE(MySelectionDisplay));

    it('stores internal reference _selectionDisplayNode in LionCombobox', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      expect(el._selectionDisplayNode).to.equal(el.querySelector('[slot=selection-display]'));
    });

    it('sets a reference to combobox element in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      expect(el._selectionDisplayNode.comboboxElement).to.equal(el);
    });

    it('calls "onComboboxElementUpdated(changedProperties)" on "updated" in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      const spy = sinon.spy(el._selectionDisplayNode, 'onComboboxElementUpdated');
      el.requestUpdate('modelValue');
      await el.updateComplete;
      expect(spy).to.have.been.calledOnce;
    });

    // TODO: put those in distinct file if ./docs/lion-combobox-selection-display.js is accessible
    // and exposable
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

    it('highlights matching options', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" match-mode="all">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const options = el.formElements;

      mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`<span aria-label="Artichoke">Arti<b>ch</b>oke</span>`);
      expect(options[1]).lightDom.to.equal(`<span aria-label="Chard"><b>Ch</b>ard</span>`);
      expect(options[2]).lightDom.to.equal(`<span aria-label="Chicory"><b>Ch</b>icory</span>`);
      expect(options[3]).lightDom.to.equal(`Victoria Plum`);

      mimicUserTyping(/** @type {LionCombobox} */ (el), 'D');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`Artichoke`);
      expect(options[1]).lightDom.to.equal(`<span aria-label="Chard">Char<b>d</b></span>`);
      expect(options[2]).lightDom.to.equal(`Chicory`);
      expect(options[3]).lightDom.to.equal(`Victoria Plum`);
    });

    describe('Active index behavior', () => {
      it('sets the active index to the closest match on open by default', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(1);
      });

      it('changes whether active index is set to the closest match automatically depending on autocomplete', async () => {
        /**
         * Automatic selection (setting activeIndex to closest matching option) in lion is set for inline & both autocomplete,
         * because it is unavoidable there
         * For list & none autocomplete, it is turned off and manual selection is required.
         * TODO: Make this configurable for list & none autocomplete?
         */
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        // https://www.w3.org/TR/wai-aria-practices-1.1/examples/combobox/aria1.1pattern/grid-combo.html
        // first example, does not set active at all until user selects
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.true;

        // https://www.w3.org/TR/wai-aria-practices-1.1/examples/combobox/aria1.1pattern/grid-combo.html
        // first example, does not set active at all until user selects
        el.autocomplete = 'list';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.true;

        // https://www.w3.org/TR/wai-aria-practices-1.1/examples/combobox/aria1.1pattern/listbox-combo.html
        // automatic selection example (2)
        el.autocomplete = 'inline';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.activeIndex).to.equal(1);
        expect(el.opened).to.be.false;

        // https://www.w3.org/TR/wai-aria-practices-1.1/examples/combobox/aria1.1pattern/listbox-combo.html
        // automatic selection example (2)
        el.autocomplete = 'both';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.activeIndex).to.equal(1);
        expect(el.opened).to.be.false;
      });

      it('sets the active index to the closest match on autocomplete', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(1);

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'chi');
        // Chard no longer matches, so should switch active to Chicory
        await el.updateComplete;
        expect(el.activeIndex).to.equal(2);

        // select artichoke
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'artichoke');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // change selection, active index should update to closest match
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'vic');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(3);
      });

      it('supports clearing by ESC key and resets active state on all options', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        // Select something
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.activeIndex).to.equal(1);

        el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await el.updateComplete;
        expect(el._inputNode.textContent).to.equal('');
        el.formElements.forEach(option => expect(option.active).to.be.false);

        // change selection, active index should update to closest match
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'vic');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(3);
      });
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
        let el = await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}" id="artichoke-option">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}" id="chard-option">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `);

        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(null);
        expect(el.formElements[1].active).to.equal(false);

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'artichoke-option',
        );
        expect(el.formElements[1].active).to.equal(false);

        el = await fixture(html`
          <lion-combobox name="foo" autocomplete="both" match-mode="begin">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `);
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el.formElements[1].id,
        );
        expect(el.formElements[1].active).to.equal(true);

        el.autocomplete = 'list';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el.formElements[1].id,
        );
        expect(el.formElements[1].active).to.equal(true);
      });

      it('adds aria-label to highlighted options', async () => {
        const [el, options] = await fruitFixture({ autocomplete: 'both', matchMode: 'all' });
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'choke');
        await el.updateComplete;
        const labelledElement = options[0].querySelector('span[aria-label="Artichoke"]');
        expect(labelledElement).to.not.be.null;
        expect(labelledElement.innerText).to.equal('Artichoke');
      });
    });
  });

  describe('Accessibility', () => {
    describe('Aria versions', () => {
      it('[role=combobox] wraps input node in v1.1', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" ._ariaVersion="${'1.1'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        expect(el._comboboxNode.contains(el._inputNode)).to.be.true;
      });

      it('has one input node with [role=combobox] in v1.0', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" ._ariaVersion="${'1.0'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        expect(el._comboboxNode).to.equal(el._inputNode);
      });

      it('autodetects aria version and sets it to 1.1 on Chromium browsers', async () => {
        const browserDetectionIsChromiumOriginal = browserDetection.isChromium;

        browserDetection.isChromium = true;
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        expect(el._ariaVersion).to.equal('1.1');

        browserDetection.isChromium = false;
        const el2 = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        expect(el2._ariaVersion).to.equal('1.0');

        // restore...
        browserDetection.isChromium = browserDetectionIsChromiumOriginal;
      });
    });
  });

  describe('Multiple Choice', () => {
    // TODO: possibly later share test with select-rich if it officially supports multipleChoice
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
  });

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
});
