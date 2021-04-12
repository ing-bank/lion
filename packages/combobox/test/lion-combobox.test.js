import '@lion/listbox/define-option';
import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/combobox/define';
import { LionOptions } from '@lion/listbox';
import { browserDetection, LitElement } from '@lion/core';
import { Required } from '@lion/form-core';
import { LionCombobox } from '../src/LionCombobox.js';

/**
 * @typedef {import('../types/SelectionDisplay').SelectionDisplay} SelectionDisplay
 */

/**
 * @param {LionCombobox} el
 */

function getProtectedMembers(el) {
  // @ts-ignore
  const {
    _comboboxNode: comboboxNode,
    _inputNode: inputNode,
    _listboxNode: listboxNode,
    _selectionDisplayNode: selectionDisplayNode,
    _activeDescendantOwnerNode: activeDescendantOwnerNode,
    _ariaVersion: ariaVersion,
  } = el;
  return {
    comboboxNode,
    inputNode,
    listboxNode,
    selectionDisplayNode,
    activeDescendantOwnerNode,
    ariaVersion,
  };
}

/**
 * @param {LionCombobox} el
 * @param {string} value
 */
function mimicUserTyping(el, value) {
  const { inputNode } = getProtectedMembers(el);
  inputNode.dispatchEvent(new Event('focusin', { bubbles: true }));
  // eslint-disable-next-line no-param-reassign
  inputNode.value = value;
  inputNode.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  inputNode.dispatchEvent(new KeyboardEvent('keyup', { key: value }));
  inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: value }));
}

/**
 * @param {HTMLInputElement} el
 * @param {string} key
 */
function mimicKeyPress(el, key) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key }));
}

/**
 * @param {LionCombobox} el
 * @param {string[]} values
 */
async function mimicUserTypingAdvanced(el, values) {
  const { inputNode } = getProtectedMembers(el);
  const inputNodeLoc = /** @type {HTMLInputElement & {selectionStart:number, selectionEnd:number}} */ (inputNode);
  inputNodeLoc.dispatchEvent(new Event('focusin', { bubbles: true }));

  for (const key of values) {
    // eslint-disable-next-line no-await-in-loop, no-loop-func
    await new Promise(resolve => {
      const hasSelection = inputNodeLoc.selectionStart !== inputNodeLoc.selectionEnd;

      if (key === 'Backspace') {
        if (hasSelection) {
          inputNodeLoc.value =
            inputNodeLoc.value.slice(
              0,
              inputNodeLoc.selectionStart ? inputNodeLoc.selectionStart : undefined,
            ) +
            inputNodeLoc.value.slice(
              inputNodeLoc.selectionEnd ? inputNodeLoc.selectionEnd : undefined,
              inputNodeLoc.value.length,
            );
        } else {
          inputNodeLoc.value = inputNodeLoc.value.slice(0, -1);
        }
      } else if (hasSelection) {
        inputNodeLoc.value =
          inputNodeLoc.value.slice(
            0,
            inputNodeLoc.selectionStart ? inputNodeLoc.selectionStart : undefined,
          ) +
          key +
          inputNodeLoc.value.slice(
            inputNodeLoc.selectionEnd ? inputNodeLoc.selectionEnd : undefined,
            inputNodeLoc.value.length,
          );
      } else {
        inputNodeLoc.value += key;
      }

      mimicKeyPress(inputNodeLoc, key);
      inputNodeLoc.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      el.updateComplete.then(() => {
        // @ts-ignore
        resolve();
      });
    });
  }
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
  describe('Options', () => {
    describe('showAllOnEmpty', () => {
      it('hides options when text in input node is cleared after typing something by default', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));

        const options = el.formElements;
        const visibleOptions = () => options.filter(o => o.getAttribute('aria-hidden') !== 'true');

        async function performChecks() {
          mimicUserTyping(el, 'c');
          await el.updateComplete;
          expect(visibleOptions().length).to.equal(4);
          mimicUserTyping(el, '');
          await el.updateComplete;
          expect(visibleOptions().length).to.equal(0);
        }

        // FIXME: autocomplete 'none' should have this behavior as well
        // el.autocomplete = 'none';
        // await performChecks();
        el.autocomplete = 'list';
        await performChecks();
        el.autocomplete = 'inline';
        await performChecks();
        el.autocomplete = 'both';
        await performChecks();
      });

      it('keeps showing options when text in input node is cleared after typing something', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" autocomplete="list" show-all-on-empty>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));

        const options = el.formElements;
        const visibleOptions = () => options.filter(o => o.getAttribute('aria-hidden') !== 'true');

        async function performChecks() {
          mimicUserTyping(el, 'c');
          await el.updateComplete;
          expect(visibleOptions().length).to.equal(4);
          mimicUserTyping(el, '');
          await el.updateComplete;
          expect(visibleOptions().length).to.equal(options.length);
        }

        el.autocomplete = 'none';
        await performChecks();
        el.autocomplete = 'list';
        await performChecks();
        el.autocomplete = 'inline';
        await performChecks();
        el.autocomplete = 'both';
        await performChecks();
      });

      it('shows overlay on focusin', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" .showAllOnEmpty="${true}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const { comboboxNode } = getProtectedMembers(el);

        expect(el.opened).to.be.false;
        comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.opened).to.be.true;
      });
    });
  });

  describe('Structure', () => {
    it('has a listbox node', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      const { listboxNode } = getProtectedMembers(el);

      expect(listboxNode).to.exist;
      expect(listboxNode).to.be.instanceOf(LionOptions);
      expect(el.querySelector('[role=listbox]')).to.equal(listboxNode);
    });

    it('has a textbox element', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          <lion-option .choiceValue="${'20'}">Item 2</lion-option>
        </lion-combobox>
      `));
      const { comboboxNode } = getProtectedMembers(el);

      expect(comboboxNode).to.exist;
      expect(el.querySelector('[role=combobox]')).to.equal(comboboxNode);
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
      const { inputNode } = getProtectedMembers(el);

      expect(inputNode.value).to.equal('10');

      el.modelValue = '20';
      await el.updateComplete;
      expect(inputNode.value).to.equal('20');
    });

    it('sets modelValue to empty string if no option is selected', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" .modelValue="${'Artichoke'}">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      expect(el.modelValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.true;
      el.checkedIndex = -1;
      await el.updateComplete;
      expect(el.modelValue).to.equal('');
      expect(el.formElements[0].checked).to.be.false;
    });

    it('sets modelValue to empty array if no option is selected for multiple choice', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice .modelValue="${['Artichoke']}">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      expect(el.modelValue).to.eql(['Artichoke']);
      expect(el.formElements[0].checked).to.be.true;
      el.checkedIndex = [];
      await el.updateComplete;
      expect(el.modelValue).to.eql([]);
      expect(el.formElements[0].checked).to.be.false;
    });

    it('clears modelValue and textbox value on clear()', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" .modelValue="${'Artichoke'}">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      const { inputNode } = getProtectedMembers(el);

      el.clear();
      expect(el.modelValue).to.equal('');
      expect(inputNode.value).to.equal('');

      const el2 = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice .modelValue="${['Artichoke']}">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      el2.clear();
      expect(el2.modelValue).to.eql([]);
      expect(inputNode.value).to.equal('');
    });
  });

  describe('Overlay visibility', () => {
    it('does not show overlay on focusin', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { comboboxNode } = getProtectedMembers(el);

      expect(el.opened).to.equal(false);
      comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);
    });

    it('shows overlay again after select and char keyup', async () => {
      /**
       * Scenario:
       * [1] user focuses textbox: overlay hidden
       * [2] user types char: overlay shows
       * [3] user selects "Artichoke": overlay closes, textbox gets value "Artichoke" and textbox
       * still has focus
       * [4] user changes textbox value to "Artichoke": the overlay should show again
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
      const { inputNode } = getProtectedMembers(el);

      expect(el.opened).to.equal(false);

      // step [1]
      inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
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
      expect(document.activeElement).to.equal(inputNode);

      // step [4]
      await el.updateComplete;
      mimicUserTyping(el, 'c');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
    });

    it('hides (and clears) overlay on [Escape]', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      const { comboboxNode, inputNode } = getProtectedMembers(el);

      // open
      comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

      mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(inputNode.value).to.equal('Artichoke');

      inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.equal(false);
      expect(inputNode.value).to.equal('');
    });

    it('hides overlay on [Tab]', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      const { comboboxNode, inputNode } = getProtectedMembers(el);

      // open
      comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

      mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(inputNode.value).to.equal('Artichoke');

      mimicKeyPress(inputNode, 'Tab');
      expect(el.opened).to.equal(false);
      expect(inputNode.value).to.equal('Artichoke');
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

      const { comboboxNode, inputNode } = getProtectedMembers(el);

      // open
      comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

      mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(inputNode.value).to.equal('Artichoke');
      expect(el.checkedIndex).to.equal(0);

      mimicUserTyping(el, '');
      await el.updateComplete;
      el.opened = false;
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(-1);
    });

    // NB: If this becomes a suite, move to separate file
    describe('Subclassers', () => {
      it('allows to control overlay visibility via "_showOverlayCondition"', async () => {
        class ShowOverlayConditionCombobox extends LionCombobox {
          /** @param {{ currentValue: string, lastKey:string }} options */
          _showOverlayCondition(options) {
            return this.focused || super._showOverlayCondition(options);
          }
        }
        const tagName = defineCE(ShowOverlayConditionCombobox);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));
        const { comboboxNode } = getProtectedMembers(el);

        expect(el.opened).to.equal(false);
        comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.opened).to.equal(true);
      });

      it('allows to control overlay visibility via "_showOverlayCondition": should not display overlay if currentValue length condition is not fulfilled', async () => {
        class ShowOverlayConditionCombobox extends LionCombobox {
          /** @param {{ currentValue: string, lastKey:string }} options */
          _showOverlayCondition(options) {
            return options.currentValue.length > 3 && super._showOverlayCondition(options);
          }
        }
        const tagName = defineCE(ShowOverlayConditionCombobox);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));

        mimicUserTyping(el, 'aaa');
        expect(el.opened).to.be.false;
      });

      it('allows to control overlay visibility via "_showOverlayCondition": should display overlay if currentValue length condition is fulfilled', async () => {
        class ShowOverlayConditionCombobox extends LionCombobox {
          /** @param {{ currentValue: string, lastKey:string }} options */
          _showOverlayCondition(options) {
            return options.currentValue.length > 3 && super._showOverlayCondition(options);
          }
        }
        const tagName = defineCE(ShowOverlayConditionCombobox);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));

        mimicUserTyping(el, 'aaaa');
        expect(el.opened).to.be.true;
      });

      it('allows to control overlay visibility via "_showOverlayCondition": should not display overlay if currentValue length condition is not fulfilled after once fulfilled', async () => {
        class ShowOverlayConditionCombobox extends LionCombobox {
          /** @param {{ currentValue: string, lastKey:string }} options */
          _showOverlayCondition(options) {
            return options.currentValue.length > 3 && super._showOverlayCondition(options);
          }
        }
        const tagName = defineCE(ShowOverlayConditionCombobox);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));

        mimicUserTyping(el, 'aaaa');
        expect(el.opened).to.be.true;

        mimicUserTyping(el, 'aaa');
        await el.updateComplete;
        expect(el.opened).to.be.false;
      });
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
        const { comboboxNode } = getProtectedMembers(el);
        expect(el.opened).to.equal(false);

        comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

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
        const { comboboxNode } = getProtectedMembers(el);
        expect(el.opened).to.equal(false);

        comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));

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

      it('works with validation', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" .validators=${[new Required()]}>
            <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const { inputNode } = getProtectedMembers(el);
        expect(el.checkedIndex).to.equal(0);

        // Simulate backspace deleting the char at the end of the string
        mimicKeyPress(inputNode, 'Backspace');
        inputNode.dispatchEvent(new Event('input'));
        const arr = inputNode.value.split('');
        arr.splice(inputNode.value.length - 1, 1);
        inputNode.value = arr.join('');
        await el.updateComplete;
        el.dispatchEvent(new Event('blur'));

        expect(el.checkedIndex).to.equal(-1);
        await el.feedbackComplete;
        expect(el.hasFeedbackFor).to.include('error');
        expect(el.showsFeedbackFor).to.include('error');
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
        const { comboboxNode } = getProtectedMembers(el);

        expect(comboboxNode.getAttribute('role')).to.equal('combobox');
      });

      it('sets aria-expanded to element with role="combobox" in wai-aria 1.0 and 1.1', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" ._ariaVersion="${'1.0'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `));
        const { comboboxNode } = getProtectedMembers(el);

        expect(comboboxNode.getAttribute('aria-expanded')).to.equal('false');
        el.opened = true;
        await el.updateComplete;
        expect(comboboxNode.getAttribute('aria-expanded')).to.equal('true');

        const el2 = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" ._ariaVersion="${'1.1'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `));
        const { comboboxNode: comboboxNode2 } = getProtectedMembers(el2);

        expect(comboboxNode2.getAttribute('aria-expanded')).to.equal('false');
        el2.opened = true;
        await el2.updateComplete;
        expect(comboboxNode.getAttribute('aria-expanded')).to.equal('true');
      });

      it('makes sure listbox node is not focusable', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `));
        const { listboxNode } = getProtectedMembers(el);

        expect(listboxNode.hasAttribute('tabindex')).to.be.false;
      });
    });
  });

  describe('Selection display', () => {
    class MySelectionDisplay extends LitElement {
      /**
       * @param {import('@lion/core').PropertyValues } changedProperties
       */
      onComboboxElementUpdated(changedProperties) {
        if (
          changedProperties.has('modelValue') &&
          // @ts-ignore
          this.comboboxElement.multipleChoice
        ) {
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
      const { selectionDisplayNode } = getProtectedMembers(el);

      expect(selectionDisplayNode).to.equal(el.querySelector('[slot=selection-display]'));
    });

    it('sets a reference to combobox element in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      // @ts-ignore allow protected members
      expect(el._selectionDisplayNode.comboboxElement).to.equal(el);
    });

    it('calls "onComboboxElementUpdated(changedProperties)" on "updated" in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `));
      // @ts-ignore sinon type error
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
      const { inputNode } = getProtectedMembers(el);

      expect(inputNode.value).to.equal('Chard');
      expect(inputNode.selectionStart).to.equal(2);
      expect(inputNode.selectionEnd).to.equal(inputNode.value.length);

      // We don't autocomplete when characters are removed
      mimicUserTyping(el, 'c'); // The user pressed backspace (number of chars decreased)
      expect(inputNode.value).to.equal('c');
      expect(inputNode.selectionStart).to.equal(inputNode.value.length);
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
      const { inputNode } = getProtectedMembers(el);

      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql(['Artichoke', 'Chard', 'Chicory']);
      expect(inputNode.value).to.equal('ch');
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
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    it('does not filter options when autocomplete is "inline"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    it('resets "checkedIndex" when going from matched to unmatched textbox value', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(1);

      mimicUserTyping(el, 'cho');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(-1);

      // Works for autocomplete 'both' as well.
      const el2 = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="both">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      mimicUserTyping(el2, 'ch');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(1);

      // Also works when 'diminishing amount of chars'
      mimicUserTyping(el2, 'x');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(-1);
    });

    it('completes chars inside textbox', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { inputNode } = getProtectedMembers(el);

      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(inputNode.value).to.equal('Chard');
      expect(inputNode.selectionStart).to.equal('ch'.length);
      expect(inputNode.selectionEnd).to.equal('Chard'.length);

      await mimicUserTypingAdvanced(el, ['i', 'c']);
      await el.updateComplete;
      expect(inputNode.value).to.equal('Chicory');
      expect(inputNode.selectionStart).to.equal('chic'.length);
      expect(inputNode.selectionEnd).to.equal('Chicory'.length);

      // Diminishing chars, but autocompleting
      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(inputNode.value).to.equal('ch');
      expect(inputNode.selectionStart).to.equal('ch'.length);
      expect(inputNode.selectionEnd).to.equal('ch'.length);
    });

    it('synchronizes textbox on overlay close', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="none">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { inputNode } = getProtectedMembers(el);
      expect(inputNode.value).to.equal('');

      /**
       * @param {'none' | 'list' | 'inline' | 'both'} autocomplete
       * @param {number|number[]} index
       * @param {string} valueOnClose
       */
      async function performChecks(autocomplete, index, valueOnClose) {
        await el.updateComplete;
        el.opened = true;
        el.setCheckedIndex(-1);
        await el.updateComplete;
        el.autocomplete = autocomplete;
        el.setCheckedIndex(index);
        el.opened = false;
        await el.updateComplete;
        expect(inputNode.value).to.equal(valueOnClose);
      }

      await performChecks('none', 0, 'Artichoke');
      await performChecks('list', 0, 'Artichoke');
      await performChecks('inline', 0, 'Artichoke');
      await performChecks('both', 0, 'Artichoke');

      el.multipleChoice = true;
      await performChecks('none', [0, 1], '');
      await performChecks('list', [0, 1], '');
      await performChecks('inline', [0, 1], '');
      await performChecks('both', [0, 1], '');
    });

    it('is possible to adjust textbox synchronize condition on overlay close', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="none" ._syncToTextboxCondition="${() => false}">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      const { inputNode } = getProtectedMembers(el);
      expect(inputNode.value).to.equal('');

      /**
       * @param {'none' | 'list' | 'inline' | 'both'} autocomplete
       * @param {number|number[]} index
       * @param {string} valueOnClose
       */
      async function performChecks(autocomplete, index, valueOnClose) {
        await el.updateComplete;
        el.opened = true;
        el.setCheckedIndex(-1);
        await el.updateComplete;
        el.autocomplete = autocomplete;
        el.setCheckedIndex(index);
        el.opened = false;
        await el.updateComplete;
        expect(inputNode.value).to.equal(valueOnClose);
      }

      await performChecks('none', 0, '');
      await performChecks('list', 0, '');
      await performChecks('inline', 0, '');
      await performChecks('both', 0, '');

      el.multipleChoice = true;
      await performChecks('none', [0, 1], '');
      await performChecks('list', [0, 1], '');
      await performChecks('inline', [0, 1], '');
      await performChecks('both', [0, 1], '');
    });

    it('does inline autocompletion when adding chars', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      mimicUserTyping(el, 'ch'); // ch
      await el.updateComplete; // Ch[ard]
      expect(el.activeIndex).to.equal(1);
      expect(el.checkedIndex).to.equal(1);

      await mimicUserTypingAdvanced(el, ['i', 'c']); // Chic
      await el.updateComplete; // Chic[ory]
      expect(el.activeIndex).to.equal(2);
      expect(el.checkedIndex).to.equal(2);

      await mimicUserTypingAdvanced(el, ['Backspace', 'Backspace', 'Backspace', 'Backspace', 'h']); // Ch
      await el.updateComplete; // Ch[ard]
      expect(el.activeIndex).to.equal(1);
      expect(el.checkedIndex).to.equal(1);
    });

    it('does inline autocompletion when changing the word', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));

      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el.activeIndex).to.equal(1);
      expect(el.checkedIndex).to.equal(1);

      await mimicUserTypingAdvanced(el, ['i']);
      await el.updateComplete;
      expect(el.activeIndex).to.equal(2);
      expect(el.checkedIndex).to.equal(2);

      // Diminishing chars, but autocompleting
      mimicUserTyping(el, 'a');
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
      expect(el.checkedIndex).to.equal(0);
    });

    it('computation of "user intends autofill" works correctly afer autofill', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="inline">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { inputNode } = getProtectedMembers(el);

      mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(inputNode.value).to.equal('Chard');
      expect(inputNode.selectionStart).to.equal('Ch'.length);
      expect(inputNode.selectionEnd).to.equal('Chard'.length);

      // Autocompletion happened. When we go backwards ('Ch[ard]' => 'Ch'), we should not
      // autocomplete to 'Chard' anymore.
      await mimicUserTypingAdvanced(el, ['Backspace']);
      await el.updateComplete;
      expect(inputNode.value).to.equal('Ch'); // so not 'Chard'
      expect(inputNode.selectionStart).to.equal('Ch'.length);
      expect(inputNode.selectionEnd).to.equal('Ch'.length);
    });

    describe('Subclassers', () => {
      it('allows to configure autoselect', async () => {
        class X extends LionCombobox {
          _autoSelectCondition() {
            return true;
          }
        }
        const tagName = defineCE(X);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo" autocomplete="list" opened>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));
        // This ensures autocomplete would be off originally
        el.autocomplete = 'list';
        await mimicUserTypingAdvanced(el, ['v', 'i']); // so we have options ['Victoria Plum']
        await el.updateComplete;
        expect(el.checkedIndex).to.equal(3);
      });
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

    it('synchronizes textbox when autocomplete is "inline" or "both"', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="none">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { inputNode } = getProtectedMembers(el);

      expect(inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'none';
      el.setCheckedIndex(0);
      expect(inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'list';
      el.setCheckedIndex(0);
      expect(inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'inline';
      el.setCheckedIndex(0);
      expect(inputNode.value).to.equal('Artichoke');

      el.setCheckedIndex(-1);
      el.autocomplete = 'both';
      el.setCheckedIndex(0);
      expect(inputNode.value).to.equal('Artichoke');
    });

    it('synchronizes last index to textbox when autocomplete is "inline" or "both" when multipleChoice', async () => {
      const el = /** @type {LionCombobox} */ (await fixture(html`
        <lion-combobox name="foo" autocomplete="none" multiple-choice>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `));
      const { inputNode } = getProtectedMembers(el);

      expect(inputNode.value).to.eql('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'none';
      el.setCheckedIndex([0]);
      el.setCheckedIndex([1]);
      expect(inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'list';
      el.setCheckedIndex([0]);
      el.setCheckedIndex([1]);
      expect(inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'inline';
      el.setCheckedIndex([0]);
      expect(inputNode.value).to.equal('Artichoke');
      el.setCheckedIndex([1]);
      expect(inputNode.value).to.equal('Chard');

      el.setCheckedIndex(-1);
      el.autocomplete = 'both';
      el.setCheckedIndex([0]);
      expect(inputNode.value).to.equal('Artichoke');
      el.setCheckedIndex([1]);
      expect(inputNode.value).to.equal('Chard');
    });

    describe('Subclassers', () => {
      it('allows to override "_syncCheckedWithTextboxMultiple"', async () => {
        class X extends LionCombobox {
          // eslint-disable-next-line no-unused-vars
          _syncToTextboxCondition() {
            return true;
          }

          /**
           * @param {?} modelValue
           * @param {?} oldModelValue
           */
          // eslint-disable-next-line no-unused-vars
          _syncToTextboxMultiple(modelValue, oldModelValue) {
            // In a real scenario (depending on how selection display works),
            // you could override the default (last selected option) with '' for instance
            this._setTextboxValue(`${modelValue}-${oldModelValue}-multi`);
          }
        }
        const tagName = defineCE(X);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (await fixture(html`
          <${tag} name="foo" autocomplete="none" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `));
        const { inputNode } = getProtectedMembers(el);

        el.setCheckedIndex(-1);
        el.autocomplete = 'none';
        el.setCheckedIndex([0]);
        expect(inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'list';
        el.setCheckedIndex([0]);
        expect(inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'inline';
        el.setCheckedIndex([0]);
        expect(inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'both';
        el.setCheckedIndex([0]);
        expect(inputNode.value).to.equal('Artichoke--multi');
      });
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

      it('changes whether activeIndex is set to the closest match automatically depending on autocomplete', async () => {
        /**
         * Automatic selection (setting activeIndex to closest matching option) in lion is set for
         * 'inline' & 'both' autocomplete, because it is unavoidable there
         * For 'list' & 'none' autocomplete, it is turned off and manual selection is required.
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
        const { inputNode } = getProtectedMembers(el);

        /**
         * @param {LionCombobox} elm
         * @param {'none'|'list'|'inline'|'both'} autocomplete
         */
        async function setup(elm, autocomplete) {
          // eslint-disable-next-line no-param-reassign
          elm.autocomplete = autocomplete;
          // eslint-disable-next-line no-param-reassign
          elm.activeIndex = -1;
          // eslint-disable-next-line no-param-reassign
          elm.checkedIndex = -1;
          // eslint-disable-next-line no-param-reassign
          elm.opened = true;
          await elm.updateComplete;
        }

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 1. List Autocomplete with Manual Selection:
        // does not set active at all until user selects
        await setup(el, 'none');

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.true;

        mimicKeyPress(inputNode, 'Enter');
        expect(el.opened).to.be.false;
        expect(el.activeIndex).to.equal(-1);

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 2. List Autocomplete with Automatic Selection:
        // does not set active at all until user selects
        await setup(el, 'list');

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.opened).to.be.true;
        expect(el.activeIndex).to.equal(-1);

        mimicKeyPress(inputNode, 'Enter');
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.false;

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 3. List with Inline Autocomplete (mostly, but with aria-autocomplete="inline")
        await setup(el, 'inline');

        mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.opened).to.be.true;

        expect(el.activeIndex).to.equal(1);

        mimicKeyPress(inputNode, 'Enter');
        await el.updateComplete;
        await el.updateComplete;

        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.false;

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 3. List with Inline Autocomplete
        await setup(el, 'both');
        mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        mimicKeyPress(inputNode, 'Enter');
        expect(el.activeIndex).to.equal(1);
        expect(el.opened).to.be.false;
      });

      it('sets the active index to the closest match on autocomplete', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const { inputNode } = getProtectedMembers(el);

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(1);

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'chi');
        // Chard no longer matches, so should switch active to Chicory
        await el.updateComplete;

        expect(el.activeIndex).to.equal(2);

        // select artichoke
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'artichoke');
        await el.updateComplete;
        mimicKeyPress(inputNode, 'Enter');

        mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        // change selection, active index should update to closest match
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'vic');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(3);
      });

      it('supports clearing by [Escape] key and resets active state on all options', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));
        const { inputNode } = getProtectedMembers(el);

        // Select something
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        mimicKeyPress(inputNode, 'Enter');
        expect(el.activeIndex).to.equal(1);

        mimicKeyPress(inputNode, 'Escape');
        await el.updateComplete;
        expect(inputNode.textContent).to.equal('');

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
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}" id="artichoke-option">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}" id="chard-option">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));

        const elProts = getProtectedMembers(el);

        expect(elProts.activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          null,
        );
        expect(el.formElements[1].active).to.equal(false);

        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(elProts.activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          null,
        );
        // el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        mimicKeyPress(elProts.inputNode, 'ArrowDown');
        expect(elProts.activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'artichoke-option',
        );
        expect(el.formElements[1].active).to.equal(false);

        const el2 = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" autocomplete="both" match-mode="begin">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `));

        const el2Prots = getProtectedMembers(el2);

        mimicUserTyping(/** @type {LionCombobox} */ (el2), 'ch');
        await el2.updateComplete;
        expect(el2Prots.activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el2.formElements[1].id,
        );
        expect(el2.formElements[1].active).to.equal(true);

        el2.autocomplete = 'list';
        mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el2.updateComplete;
        expect(el2Prots.activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el2.formElements[1].id,
        );
        expect(el2.formElements[1].active).to.equal(true);
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
        const { comboboxNode, inputNode } = getProtectedMembers(el);

        expect(comboboxNode.contains(inputNode)).to.be.true;
      });

      it('has one input node with [role=combobox] in v1.0', async () => {
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo" ._ariaVersion="${'1.0'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        const { comboboxNode, inputNode } = getProtectedMembers(el);

        expect(comboboxNode).to.equal(inputNode);
      });

      it('autodetects aria version and sets it to 1.1 on Chromium browsers', async () => {
        const browserDetectionIsChromiumOriginal = browserDetection.isChromium;

        browserDetection.isChromium = true;
        const el = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        const elProts = getProtectedMembers(el);

        expect(elProts.ariaVersion).to.equal('1.1');

        browserDetection.isChromium = false;
        const el2 = /** @type {LionCombobox} */ (await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `));
        const el2Prots = getProtectedMembers(el2);

        expect(el2Prots.ariaVersion).to.equal('1.0');

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

      const { comboboxNode } = getProtectedMembers(el);

      // activate opened listbox
      comboboxNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
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
        el.matchCondition = onlyExactMatches;
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
