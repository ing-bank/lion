import {
  getComboboxMembers,
  getFilteredOptionValues,
  mimicKeyPress,
  mimicUserTyping,
  mimicUserTypingAdvanced,
} from '@lion/ui/combobox-test-helpers.js';
import { LionCombobox } from '@lion/ui/combobox.js';
import { browserDetection } from '@lion/ui/core.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
import { Required, Unparseable } from '@lion/ui/form-core.js';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement } from 'lit';
import sinon from 'sinon';

/**
 * @typedef {import('../types/SelectionDisplay.js').SelectionDisplay} SelectionDisplay
 * @typedef {import('@lion/ui/listbox.js').LionOption} LionOption
 */

/**
 * @param {{ autocomplete?:'none'|'list'|'both', matchMode?:'begin'|'all' }} config
 */
async function fruitFixture({ autocomplete, matchMode } = {}) {
  const el = /** @type {LionCombobox} */ (
    await fixture(html`
      <lion-combobox name="foo">
        <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
        <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
        <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
        <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
      </lion-combobox>
    `)
  );
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
  describe('Options visibility', () => {
    it('hides options when text in input node is cleared after typing something by default', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const options = el.formElements;
      const visibleOptions = () => options.filter(o => o.getAttribute('aria-hidden') !== 'true');

      async function performChecks() {
        await mimicUserTyping(el, 'c');
        await el.updateComplete;
        expect(visibleOptions().length).to.equal(4, `autocompleteMode is ${el.autocomplete}`);
        // Remove [hard], [c]
        await mimicUserTypingAdvanced(el, ['Backspace', 'Backspace']);
        await el.updateComplete;
        expect(visibleOptions().length).to.equal(0, `autocompleteMode is ${el.autocomplete}`);
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

    it('hides all options on reset()', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const options = el.formElements;
      const visibleOptions = () => options.filter(o => o.style.display !== 'none');

      await mimicUserTyping(el, 'cha');
      await el.updateComplete;
      expect(visibleOptions().length).to.equal(1);
      el.reset();
      await el.updateComplete;
      expect(visibleOptions().length).to.equal(0);
    });

    it('shows all options on reset() when showAllOnEmpty is set to true and overlay was open', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" show-all-on-empty>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const options = el.formElements;
      const visibleOptions = () => options.filter(o => o.getAttribute('aria-hidden') !== 'true');

      await mimicUserTyping(el, 'cha');
      await el.updateComplete;
      expect(visibleOptions().length).to.equal(1);
      expect(el.opened).to.be.true;

      el.reset();
      await el.updateComplete;
      expect(visibleOptions().length).to.equal(4);
    });

    it('hides listbox on click/enter (when multiple-choice is false)', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _listboxNode } = getComboboxMembers(el);

      async function open() {
        await mimicUserTyping(el, 'ch');
        return el.updateComplete;
      }

      await open();
      expect(el.opened).to.be.true;
      const visibleOptions = el.formElements.filter(o => o.style.display !== 'none');
      visibleOptions[0].click();
      expect(el.opened).to.be.false;
      await open();
      expect(el.opened).to.be.true;
      el.activeIndex = el.formElements.indexOf(visibleOptions[0]);
      mimicKeyPress(_listboxNode, 'Enter');
      await el.updateComplete;
      expect(el.opened).to.be.false;
    });

    describe('With ".showAllOnEmpty"', () => {
      it('keeps showing options when text in input node is cleared after typing something', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" autocomplete="list" show-all-on-empty>
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );

        const options = el.formElements;
        const visibleOptions = () => options.filter(o => o.getAttribute('aria-hidden') !== 'true');

        async function performChecks() {
          await mimicUserTyping(el, 'c');
          await el.updateComplete;
          expect(visibleOptions().length).to.equal(4);
          await mimicUserTyping(el, '');
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

      it('shows overlay on click', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" .showAllOnEmpty="${true}">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _inputNode } = getComboboxMembers(el);

        expect(el.opened).to.be.false;
        _inputNode.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.opened).to.be.true;
      });

      it('hides overlay on [Escape] after being opened', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" .showAllOnEmpty="${true}">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode, _inputNode } = getComboboxMembers(el);

        expect(el.opened).to.be.false;
        _comboboxNode.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.opened).to.be.true;
        _inputNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        await el.updateComplete;
        expect(el.opened).to.be.false;
      });

      it('hides listbox on click/enter (when multiple-choice is false)', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" .showAllOnEmpty="${true}">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );

        const { _listboxNode, _inputNode } = getComboboxMembers(el);

        async function open() {
          await mimicUserTyping(el, 'ch');
          return el.updateComplete;
        }

        // FIXME: temp disable for Safari. Works locally, not in build
        const isSafari = (() => {
          const ua = navigator.userAgent.toLowerCase();
          return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
        })();
        if (isSafari) {
          return;
        }

        await open();
        expect(el.opened).to.be.true;
        const visibleOptions = el.formElements.filter(o => o.style.display !== 'none');
        visibleOptions[0].click();
        await el.updateComplete;
        expect(el.opened).to.be.false;

        _inputNode.value = '';
        _inputNode.blur();
        await open();
        await el.updateComplete;

        el.activeIndex = el.formElements.indexOf(visibleOptions[0]);
        mimicKeyPress(_listboxNode, 'Enter');
        expect(el.opened).to.be.false;
      });
    });
  });

  describe('Structure', () => {
    it('has a listbox node', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `)
      );
      const { _listboxNode } = getComboboxMembers(el);

      expect(_listboxNode).to.exist;
      // TODO: worked before, find out what has changed in ScopedElements
      // expect(_listboxNode instanceof LionOptions).to.be.true;
      expect(el.querySelector('[role=listbox]')).to.equal(_listboxNode);
    });

    it('has a textbox element', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `)
      );
      const { _comboboxNode } = getComboboxMembers(el);

      expect(_comboboxNode).to.exist;
      expect(el.querySelector('[role=combobox]')).to.equal(_comboboxNode);
    });

    it('has validator "MatchesOption" applied by default', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `)
      );
      await mimicUserTyping(el, '30');
      await el.updateComplete;
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates).to.have.property('error');
      expect(el.validationStates.error).to.have.property('MatchesOption');
    });
  });

  describe('Values', () => {
    it('syncs modelValue with textbox', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .modelValue="${'10'}">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            <lion-option .choiceValue="${'20'}">Item 2</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      expect(_inputNode.value).to.equal('10');

      el.modelValue = '20';
      await el.updateComplete;
      expect(_inputNode.value).to.equal('20');
    });

    it('sets modelValue to Unparseable if no option is selected', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .modelValue="${'Artichoke'}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      expect(el.modelValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.true;
      el.setCheckedIndex(-1);
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue instanceof Unparseable).to.be.true;
      expect(el.modelValue.viewValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.false;

      el.setCheckedIndex(-1);
      _inputNode.value = 'Foo';
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue instanceof Unparseable).to.be.true;
      expect(el.modelValue.viewValue).to.equal('Foo');
      expect(el.formElements[0].checked).to.be.false;

      el.setCheckedIndex(0);
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue instanceof Unparseable).to.be.false;
      expect(el.modelValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.true;
    });

    it('sets modelValue to _inputNode.value if no option is selected when requireOptionMatch is false', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .modelValue="${'Artichoke'}" .requireOptionMatch="${false}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      expect(el.modelValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.true;
      el.setCheckedIndex(-1);
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue).to.equal('Artichoke');
      expect(el.formElements[0].checked).to.be.true;

      el.setCheckedIndex(-1);
      _inputNode.value = 'Foo';
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue).to.equal('Foo');
      expect(el.formElements[0].checked).to.be.false;
    });

    it('sets modelValue to empty array if no option is selected for multiple choice', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice .modelValue="${['Artichoke']}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      expect(el.modelValue).to.deep.equal(['Artichoke']);
      expect(el.formElements[0].checked).to.be.true;
      el.setCheckedIndex([]);
      await el.updateComplete;
      expect(el.modelValue).to.deep.equal([]);
      expect(el.formElements[0].checked).to.be.false;
    });

    it('clears modelValue and textbox value on clear()', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .modelValue="${'Artichoke'}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      el.clear();
      expect(el.modelValue).to.equal('');
      expect(_inputNode.value).to.equal('');

      const el2 = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice .modelValue="${['Artichoke']}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      el2.clear();
      expect(el2.modelValue).to.eql([]);
      // @ts-ignore [allow-protected] in test
      expect(el2._inputNode.value).to.equal('');
    });

    it('correctly emits event with an empty value when clear() is called', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(
          html`<lion-combobox>
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'green'}>Green</lion-option>
            <lion-option .choiceValue=${'blue'}>Blue</lion-option>
          </lion-combobox>`,
        )
      );

      el.modelValue = 'red';
      await el.updateComplete;

      el.addEventListener('model-value-changed', ({ target }) => {
        expect(target).to.not.be.null;

        const { modelValue, value } = /** @type {LionCombobox} */ (target);
        expect(value).to.equal('');
        expect(modelValue).to.equal('');
      });

      el.clear();
      await el.updateComplete;
    });

    it('updates option list after clear()', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const options = el.formElements;
      await mimicUserTyping(el, 'a');
      await el.updateComplete;

      const visibleOptions = () => options.filter(o => o.style.display !== 'none');
      expect(visibleOptions().length).to.equal(3, 'after input');

      el.clear();
      await el.updateComplete;
      expect(visibleOptions().length).to.equal(0, 'after clear');
    });

    it('resets modelValue and textbox value on reset()', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .modelValue="${'Artichoke'}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);
      el.modelValue = 'Chard';
      el.reset();
      expect(el.modelValue).to.equal('Artichoke');
      expect(_inputNode.value).to.equal('Artichoke');

      const el2 = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice .modelValue="${['Artichoke']}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      el2.modelValue = ['Artichoke', 'Chard'];
      el2.reset();
      expect(el2.modelValue).to.deep.equal(['Artichoke']);
      // @ts-ignore [allow-protected] in test
      expect(el2._inputNode.value).to.equal('');
    });

    it('syncs textbox to modelValue', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" show-all-on-empty>
            <lion-option .choiceValue="${'Aha'}" checked>Aha</lion-option>
            <lion-option .choiceValue="${'Bhb'}">Bhb</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      /** @param {string} autocompleteMode */
      async function performChecks(autocompleteMode) {
        el.formElements[0].click();
        await el.updateComplete;

        // FIXME: fix properly for Webkit
        // expect(_inputNode.value).to.equal('Aha', `autocompleteMode is ${autocompleteMode}`);
        expect(el.checkedIndex).to.equal(0, `autocompleteMode is ${autocompleteMode}`);

        await mimicUserTyping(el, 'Ah');
        await el.updateComplete;
        expect(_inputNode.value).to.equal('Ah', `autocompleteMode is ${autocompleteMode}`);

        await el.updateComplete;
        expect(el.checkedIndex).to.equal(-1, `autocompleteMode is ${autocompleteMode}`);
      }

      el.autocomplete = 'none';
      await performChecks('none');

      el.autocomplete = 'list';
      await performChecks('list');
    });

    it('works with Required validator', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .validators=${[new Required()]}>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      el.submitted = true;
      await el.feedbackComplete;
      expect(el.hasFeedbackFor).to.include('error', 'hasFeedbackFor');
      await el.feedbackComplete;
      expect(el.showsFeedbackFor).to.include('error', 'showsFeedbackFor');
    });

    it('ignores empty string modelValue inputs', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      el.requireOptionMatch = false;
      await el.updateComplete;
      const { _inputNode } = getComboboxMembers(el);

      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
      expect(el.modelValue).to.eql([]);

      await mimicUserTyping(el, ' ');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
      expect(el.modelValue).to.eql([]);
    });

    it('allows a value outside of the option list when requireOptionMatch is false', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .validators=${[new Required()]}>
            <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      el.requireOptionMatch = false;
      const { _inputNode } = getComboboxMembers(el);
      expect(el.checkedIndex).to.equal(0);

      await mimicUserTyping(el, 'Foo');
      _inputNode.dispatchEvent(new Event('input'));
      await el.updateComplete;

      expect(el.checkedIndex).to.equal(-1);
      expect(el.modelValue).to.equal('Foo');
      expect(_inputNode.value).to.equal('Foo');
    });

    it("doesn't select any similar options after using delete when requireOptionMatch is false", async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .validators=${[new Required()]}>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      el.requireOptionMatch = false;
      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'Art');
      await el.updateComplete;

      await mimicUserTypingAdvanced(el, ['Delete']);
      await el.updateComplete;
      await el.updateComplete;

      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.checkedIndex).to.equal(-1);
      expect(el.modelValue).to.equal('Art');
      expect(_inputNode.value).to.equal('Art');
    });

    it("when removing a letter it won't select the option", async () => {
      // We don't autocomplete when characters are removed
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);
      expect(el.checkedIndex).to.equal(0);

      // Simulate backspace deleting the char at the end of the string
      mimicKeyPress(_inputNode, 'Backspace');
      _inputNode.dispatchEvent(new Event('input'));
      const arr = _inputNode.value.split('');
      arr.splice(_inputNode.value.length - 1, 1);
      _inputNode.value = arr.join('');
      await el.updateComplete;
      el.dispatchEvent(new Event('blur'));

      expect(el.checkedIndex).to.equal(-1);
      expect(el.modelValue instanceof Unparseable).to.be.true;
      expect(el.modelValue.viewValue).to.equal('Artichok');
    });

    it('allows the user to override the parser', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            .parser="${/** @param {string} value */ value => value.replace(/[0-9]/g, '')}"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      el.setCheckedIndex(-1);
      _inputNode.value = 'Foo123';
      el.__shouldAutocompleteNextUpdate = true;
      await el.updateComplete;
      expect(el.modelValue).to.equal('Foo');
      expect(el.formElements[0].checked).to.be.false;
    });

    it('allows custom selections when multi-choice when requireOptionMatch is false', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            multiple-choice
            .validators=${[new Required()]}
            autocomplete="none"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option checked .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      el.requireOptionMatch = false;
      await el.updateComplete;

      const { _inputNode } = getComboboxMembers(el);
      expect(el.modelValue).to.eql(['Chard']);
      expect(el.checkedIndex).to.eql([1]);

      await mimicUserTyping(el, 'Foo');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.modelValue).to.eql(['Chard', 'Foo']);
      expect(el.checkedIndex).to.eql([1]);

      await mimicUserTyping(el, 'Bar');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
    });

    it('allows many custom selections when multi-choice when requireOptionMatch is false', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            multiple-choice
            .validators=${[new Required()]}
            autocomplete="none"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      el.requireOptionMatch = false;
      await el.updateComplete;

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'Foo');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.modelValue).to.eql(['Foo']);
      expect(el.checkedIndex).to.eql([]);

      await mimicUserTyping(el, 'Bar');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.modelValue).to.eql(['Foo', 'Bar']);
      expect(el.checkedIndex).to.eql([]);
    });

    it('allows new options when multi-choice when requireOptionMatch=false and autocomplete="both", without selecting similar values', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            multiple-choice
            .requireOptionMatch=${false}
            autocomplete="both"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await el.updateComplete;

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'Artist');
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.modelValue).to.eql(['Artist']);
    });

    it('allows new options when multi-choice when requireOptionMatch=false and autocomplete="both", when deleting autocomplete values using Backspace', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            multiple-choice
            .requireOptionMatch=${false}
            autocomplete="both"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await el.updateComplete;

      const { _inputNode } = getComboboxMembers(el);
      await mimicUserTyping(el, 'Art');
      await el.updateComplete;
      await mimicUserTypingAdvanced(el, ['Backspace']);
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;

      expect(el.modelValue).to.eql(['Art']);
    });

    it('allows new custom options when multi-choice when requireOptionMatch=false and autocomplete="both", when deleting autocompleted values using Delete', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox
            name="foo"
            multiple-choice
            .requireOptionMatch=${false}
            autocomplete="both"
          >
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await el.updateComplete;

      const { _inputNode } = getComboboxMembers(el);
      el.modelValue = [];

      await mimicUserTyping(el, 'Art');
      await el.updateComplete;
      await mimicUserTypingAdvanced(el, ['Delete']);
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
      expect(el.modelValue).to.eql(['Art']);
    });
  });

  describe('Overlay visibility', () => {
    it('does not show overlay on click', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _comboboxNode } = getComboboxMembers(el);

      expect(el.opened).to.equal(false);
      _comboboxNode.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);
    });

    it('shows overlay on click when filled', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _comboboxNode } = getComboboxMembers(el);
      el.modelValue = 'Art';
      expect(el.opened).to.equal(false);
      _comboboxNode.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const options = el.formElements;
      const { _inputNode } = getComboboxMembers(el);

      expect(el.opened).to.equal(false);

      // step [1]
      _inputNode.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.opened).to.equal(false);

      // step [2]
      await mimicUserTyping(el, 'c');
      await el.updateComplete;
      expect(el.opened).to.equal(true);

      // step [3]
      options[0].click();
      await el.updateComplete;
      expect(el.opened).to.equal(false);
      expect(document.activeElement).to.equal(_inputNode);

      // step [4]
      await el.updateComplete;
      await mimicUserTyping(el, 'c');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
    });

    it('hides (and clears) overlay on [Escape]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');

      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.opened).to.equal(false);
      expect(_inputNode.value).to.equal('');
    });

    it('hides overlay on [Enter]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');

      // N.B. we do only trigger keydown here (and not mimicKeypress (both keyup and down)),
      // because this closely mimics what happens in the browser
      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.equal(false);
      expect(_inputNode.value).to.equal('Artichoke');
    });

    it('hides overlay on [Tab]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');

      // N.B. we do only trigger keydown here (and not mimicKeypress (both keyup and down)),
      // because this closely mimics what happens in the browser
      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.opened).to.equal(false);
      expect(_inputNode.value).to.equal('Artichoke');
    });

    it('keeps overlay open on [Shift]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');

      // N.B. we do only trigger keydown here (and not mimicKeypress (both keyup and down)),
      // because this closely mimics what happens in the browser
      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');
    });

    it('clears checkedIndex on empty text', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);
      expect(_inputNode.value).to.equal('Artichoke');
      expect(el.checkedIndex).to.equal(0);

      // await mimicUserTyping(el, '');
      await sendKeys({ press: 'Backspace' });
      await el.updateComplete;
      el.opened = false;
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(-1);
    });

    it('has the correct Overlay Config defined', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" .showAllOnEmpty="${true}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      // @ts-ignore [allow-protected] in test
      expect(el._defineOverlayConfig().elementToFocusAfterHide).to.equal(undefined);
      // @ts-ignore [allow-protected] in test
      expect(el._defineOverlayConfig().invokerNode).to.equal(el._inputNode);
      // @ts-ignore [allow-protected] in test
      expect(el._defineOverlayConfig().visibilityTriggerFunction).to.equal(undefined);
    });

    // NB: If this becomes a suite, move to separate file
    describe('Subclassers', () => {
      it('allows to control overlay visibility via "_showOverlayCondition": should not display overlay if currentValue length condition is not fulfilled', async () => {
        class ShowOverlayConditionCombobox extends LionCombobox {
          /** @param {{ currentValue: string, lastKey:string }} options */
          _showOverlayCondition(options) {
            return options.currentValue.length > 3 && super._showOverlayCondition(options);
          }
        }
        const tagName = defineCE(ShowOverlayConditionCombobox);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `)
        );

        await mimicUserTyping(el, 'aaa');
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

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `)
        );

        await mimicUserTyping(el, 'aaaa');
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

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
          <${tag} name="foo">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `)
        );

        await mimicUserTyping(el, 'aaaa');
        expect(el.opened).to.be.true;

        await mimicUserTyping(el, 'aaa');
        await el.updateComplete;
        expect(el.opened).to.be.false;
      });
    });

    describe('Accessibility', () => {
      it('sets "aria-posinset" and "aria-setsize" on visible entries', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" multiple-choice>
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const options = el.formElements;
        expect(el.opened).to.equal(false);

        await mimicUserTyping(el, 'art');
        await el.updateComplete;
        expect(el.opened).to.equal(true);

        const visibleOptions = options.filter(o => o.style.display !== 'none');
        expect(visibleOptions.length).to.not.equal(0);
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
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const options = el.formElements;
        expect(el.opened).to.equal(false);

        await mimicUserTyping(el, 'art');
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

      it('dropdown has a label', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" .validators=${[new Required()]}>
              <lion-option checked .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _overlayCtrl } = getComboboxMembers(el);
        expect(_overlayCtrl.contentWrapperNode.getAttribute('aria-label')).to.equal(
          'Combobox options popup',
        );
      });
    });
  });

  // Notice that the LionComboboxInvoker always needs to be used in conjunction with the
  // LionCombobox, and therefore will be tested integrated,
  describe('Invoker component integration', () => {
    describe('Accessibility', () => {
      it('sets role="combobox" on textbox wrapper/listbox sibling', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
              <lion-option .choiceValue="${'20'}">Item 2</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode } = getComboboxMembers(el);

        expect(_comboboxNode.getAttribute('role')).to.equal('combobox');
      });

      it('sets aria-expanded to element with role="combobox" in wai-aria 1.0 and 1.1', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" ._ariaVersion="${'1.0'}">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
              <lion-option .choiceValue="${'20'}">Item 2</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode } = getComboboxMembers(el);

        expect(_comboboxNode.getAttribute('aria-expanded')).to.equal('false');
        el.opened = true;
        await el.updateComplete;
        expect(_comboboxNode.getAttribute('aria-expanded')).to.equal('true');

        const el2 = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" ._ariaVersion="${'1.1'}">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
              <lion-option .choiceValue="${'20'}">Item 2</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode: comboboxNode2 } = getComboboxMembers(el2);

        expect(comboboxNode2.getAttribute('aria-expanded')).to.equal('false');
        el2.opened = true;
        await el2.updateComplete;
        expect(_comboboxNode.getAttribute('aria-expanded')).to.equal('true');
      });

      it('makes sure listbox node is not focusable', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
              <lion-option .choiceValue="${'20'}">Item 2</lion-option>
            </lion-combobox>
          `)
        );
        const { _listboxNode } = getComboboxMembers(el);

        expect(_listboxNode.hasAttribute('tabindex')).to.be.false;
      });
    });
  });

  describe('Selection display', () => {
    class MySelectionDisplay extends LitElement {
      /**
       * @param {import('lit').PropertyValues } changedProperties
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `)
      );
      const { _selectionDisplayNode } = getComboboxMembers(el);

      expect(_selectionDisplayNode).to.equal(el.querySelector('[slot=selection-display]'));
    });

    it('sets a reference to combobox element in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `)
      );
      // @ts-ignore allow protected members
      expect(el._selectionDisplayNode.comboboxElement).to.equal(el);
    });

    it('calls "onComboboxElementUpdated(changedProperties)" on "updated" in _selectionDisplayNode', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
        <lion-combobox name="foo">
          <${selectionDisplayTag} slot="selection-display"></${selectionDisplayTag}>
          <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
        </lion-combobox>
      `)
      );
      // @ts-ignore sinon type error
      const spy = sinon.spy(el._selectionDisplayNode, 'onComboboxElementUpdated');
      el.requestUpdate('modelValue', undefined);
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
          </lion-combobox>
        `)
      );
      expect(el.autocomplete).to.equal('both');
    });

    it('filters options when autocomplete is "both"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql(['Artichoke', 'Chard', 'Chicory']);
    });

    it('completes textbox when autocomplete is "both"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      const { _inputNode } = getComboboxMembers(el);

      expect(_inputNode.value).to.equal('Chard');
      expect(_inputNode.selectionStart).to.equal(2);
      expect(_inputNode.selectionEnd).to.equal(_inputNode.value.length);

      // We don't autocomplete when characters are removed
      await mimicUserTyping(el, 'c'); // The user pressed backspace (number of chars decreased)
      expect(_inputNode.value).to.equal('c');
      expect(_inputNode.selectionStart).to.equal(_inputNode.value.length);
    });

    it('filters options when autocomplete is "list"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="list">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql(['Artichoke', 'Chard', 'Chicory']);
      expect(_inputNode.value).to.equal('ch');
    });

    it('does not filter options when autocomplete is "none"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    it('does not autocomplete on [Enter] when textbox content does not match options', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Mango'}">Mango</lion-option>
            <lion-option .choiceValue="${'Lemon'}">Lemon</lion-option>
            <lion-option .choiceValue="${'Apple'}">Apple</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);
      mimicUserTypingAdvanced(el, ['m', 'a', 'k']);
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Mak');
    });

    it('does not autocomplete on [Enter] when textbox content does not match options and content was cleared via [Backspace]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo">
            <lion-option .choiceValue="${'Mango'}">Mango</lion-option>
            <lion-option .choiceValue="${'Lemon'}">Lemon</lion-option>
            <lion-option .choiceValue="${'Apple'}">Apple</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);
      mimicUserTypingAdvanced(el, ['m', 'o', 'Backspace', 'Backspace', 'm', 'o']);
      await el.updateComplete;
      await el.updateComplete;
      await el.updateComplete;
      await el.updateComplete;
      mimicKeyPress(_inputNode, 'Enter');
      await el.updateComplete;
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Mo');
    });

    it('does not filter options when autocomplete is "inline"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(getFilteredOptionValues(el)).to.eql([
        'Artichoke',
        'Chard',
        'Chicory',
        'Victoria Plum',
      ]);
    });

    it('resets "checkedIndex" when going from matched to unmatched textbox value', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(1);

      await mimicUserTyping(el, 'cho');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(-1);

      // Works for autocomplete 'both' as well.
      const el2 = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await mimicUserTyping(el2, 'ch');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(1);

      // Also works when 'diminishing amount of chars'
      await mimicUserTyping(el2, 'x');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(-1);
    });

    it('resets "checkedIndex" when going from matched to another matched textbox value', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      /** Goes from 2nd option Chard to 3rd option Chicory */
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(1);

      await mimicUserTyping(el, 'chi');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(2);

      const el2 = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await mimicUserTyping(el2, 'ch');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(1);

      // match-mode all ensures the user sees Artichoke option, but it's not
      // auto-completed or auto-selected, because it doesn't start with "cho"
      // See next test for more clarification
      await mimicUserTyping(el2, 'cho');
      await el2.updateComplete;
      expect(el2.checkedIndex).to.equal(-1);
      expect(getFilteredOptionValues(el2)).to.eql(['Artichoke']);
    });

    it('sets "checkedIndex" only if the match, matches from the beginning of the word', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="both">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            <lion-option .choiceValue="${'Daikon'}">Daikon</lion-option>
          </lion-combobox>
        `)
      );

      // first match is Char'd', but better match is 'D'aikon
      await mimicUserTyping(el, 'd');
      await el.updateComplete;
      expect(el.checkedIndex).to.equal(3);
      expect(getFilteredOptionValues(el)).to.eql(['Chard', 'Daikon']);
    });

    it('completes chars inside textbox', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Chard');
      expect(_inputNode.selectionStart).to.equal('ch'.length);
      expect(_inputNode.selectionEnd).to.equal('Chard'.length);

      await mimicUserTypingAdvanced(el, ['i', 'c']);
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Chicory');
      expect(_inputNode.selectionStart).to.equal('chic'.length);
      expect(_inputNode.selectionEnd).to.equal('Chicory'.length);

      // Diminishing chars, but autocompletion
      await mimicUserTypingAdvanced(el, ['Backspace', 'Backspace', 'Backspace']); // Ch
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Ch');
      expect(_inputNode.selectionStart).to.equal('ch'.length);
      expect(_inputNode.selectionEnd).to.equal('ch'.length);
    });

    it('synchronizes textbox on overlay close', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);
      await el.updateComplete;
      expect(_inputNode.value).to.equal('');

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
        await el.updateComplete;
        el.opened = false;
        await el.updateComplete;
        expect(_inputNode.value).to.equal(valueOnClose, autocomplete);
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="none" ._syncToTextboxCondition="${() => false}">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);
      expect(_inputNode.value).to.equal('');

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
        expect(_inputNode.value).to.equal(valueOnClose);
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await mimicUserTyping(el, 'ch'); // ch
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
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(el.activeIndex).to.equal(1);
      expect(el.checkedIndex).to.equal(1);

      await mimicUserTypingAdvanced(el, ['i']);
      await el.updateComplete;
      expect(el.activeIndex).to.equal(2);
      expect(el.checkedIndex).to.equal(2);

      // Diminishing chars, but autocompletion
      await mimicUserTypingAdvanced(el, ['Backspace', 'Backspace', 'Backspace', 'Backspace', 'a']); // a
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
      expect(el.checkedIndex).to.equal(0);
    });

    it('filters options correctly when changing the middle of the word', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="list" match-mode="all">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'char');
      expect(_inputNode.value).to.equal('char');
      await el.updateComplete; // Char

      expect(getFilteredOptionValues(el)).to.eql(['Chard']);

      _inputNode.setSelectionRange(3, 3);
      await mimicUserTypingAdvanced(el, ['Backspace', 'i', 'c', 'o']);
      await el.updateComplete; // Chicor

      expect(_inputNode.value).to.equal('chicor');
      expect(getFilteredOptionValues(el)).to.eql(['Chicory']);
    });

    it('computation of "user intends autofill" works correctly afer autofill', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="inline">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'ch');
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Chard');
      expect(_inputNode.selectionStart).to.equal('Ch'.length);
      expect(_inputNode.selectionEnd).to.equal('Chard'.length);

      // Autocompletion happened. When we go backwards ('Ch[ard]' => 'Ch'), we should not
      // autocomplete to 'Chard' anymore.
      await mimicUserTypingAdvanced(el, ['Backspace']);
      await el.updateComplete;
      expect(_inputNode.value).to.equal('Ch'); // so not 'Chard'
      expect(_inputNode.selectionStart).to.equal('Ch'.length);
      expect(_inputNode.selectionEnd).to.equal('Ch'.length);
    });

    describe('Server side completion support', () => {
      const listboxData = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];

      class MyEl extends LitElement {
        constructor() {
          super();
          /** @type {string[]} */
          this.options = [...listboxData];
        }

        clearOptions() {
          /** @type {string[]} */
          this.options = [];
          this.requestUpdate();
        }

        addOption() {
          this.options.push(`option ${this.options.length + 1}`);
          this.requestUpdate();
        }

        fillAllOptions() {
          this.options = [...listboxData];
          this.requestUpdate();
        }

        get combobox() {
          return /** @type {LionCombobox} */ (this.shadowRoot?.querySelector('#combobox'));
        }

        render() {
          return html`
            <lion-combobox id="combobox" label="Server side completion">
              ${this.options.map(
                option => html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
              )}
            </lion-combobox>
          `;
        }
      }
      const tagName = defineCE(MyEl);
      const wrappingTag = unsafeStatic(tagName);

      it('calls "_handleAutocompletion" after externally changing options', async () => {
        const el = /** @type {MyEl} */ (await fixture(html`<${wrappingTag}></${wrappingTag}>`));
        await el.combobox.registrationComplete;
        // @ts-ignore [allow-protected] in test
        const spy = sinon.spy(el.combobox, '_handleAutocompletion');
        el.addOption();
        await el.updateComplete;
        await el.updateComplete;
        expect(spy).to.have.been.calledOnce;
        el.clearOptions();
        await el.updateComplete;
        await el.updateComplete;
        expect(spy).to.have.been.calledTwice;
      });

      it('should handle dynamic options', async () => {
        // Arrange
        const el = /** @type {MyEl} */ (await fixture(html`<${wrappingTag}></${wrappingTag}>`));
        await el.combobox.registrationComplete;
        const { _inputNode } = getComboboxMembers(el.combobox);

        // Act (start typing)
        await mimicUserTypingAdvanced(el.combobox, ['l']);
        // simulate fetching data from server
        el.clearOptions();
        await el.updateComplete;
        await el.updateComplete;
        el.fillAllOptions();
        await el.updateComplete;
        await el.updateComplete;

        // Assert
        expect(_inputNode.value).to.equal('lorem');
        expect(_inputNode.selectionStart).to.equal(1);
        expect(_inputNode.selectionEnd).to.equal(_inputNode.value.length);
        expect(getFilteredOptionValues(el.combobox)).to.eql(['lorem', 'dolor']);

        // Act (continue typing)
        await mimicUserTypingAdvanced(el.combobox, ['o']);
        // simulate fetching data from server
        el.clearOptions();
        await el.updateComplete;
        await el.updateComplete;
        el.fillAllOptions();
        await el.updateComplete;
        await el.updateComplete;

        // Assert
        expect(_inputNode.value).to.equal('lorem');
        expect(_inputNode.selectionStart).to.equal(2);
        expect(_inputNode.selectionEnd).to.equal(_inputNode.value.length);
        expect(getFilteredOptionValues(el.combobox)).to.eql(['lorem', 'dolor']);

        // We don't autocomplete when characters are removed
        await mimicUserTypingAdvanced(el.combobox, ['Backspace', 'Backspace']);
        expect(_inputNode.value).to.equal('l');
        expect(_inputNode.selectionStart).to.equal(_inputNode.value.length);
      });
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

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
          <${tag} name="foo" opened>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `)
        );
        // This ensures autocomplete would be off originally
        el.autocomplete = 'list';
        await mimicUserTypingAdvanced(el, ['v', 'i']); // so we have options ['Victoria Plum']
        await el.updateComplete;
        expect(el.checkedIndex).to.equal(3);
      });
    });

    it('highlights first occurrence of matching option', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" match-mode="all">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const options = el.formElements;

      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'c');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`<span aria-label="Artichoke">Arti<b>c</b>hoke</span>`);
      expect(options[1]).lightDom.to.equal(`<span aria-label="Chard"><b>C</b>hard</span>`);
      expect(options[2]).lightDom.to.equal(`<span aria-label="Chicory"><b>C</b>hicory</span>`);
      expect(options[3]).lightDom.to.equal(
        `<span aria-label="Victoria Plum">Vi<b>c</b>toria Plum</span>`,
      );

      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`<span aria-label="Artichoke">Arti<b>ch</b>oke</span>`);
      expect(options[1]).lightDom.to.equal(`<span aria-label="Chard"><b>Ch</b>ard</span>`);
      expect(options[2]).lightDom.to.equal(`<span aria-label="Chicory"><b>Ch</b>icory</span>`);
      expect(options[3]).lightDom.to.equal(`Victoria Plum`);

      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'D');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`Artichoke`);
      expect(options[1]).lightDom.to.equal(`<span aria-label="Chard">Char<b>d</b></span>`);
      expect(options[2]).lightDom.to.equal(`Chicory`);
      expect(options[3]).lightDom.to.equal(`Victoria Plum`);
    });

    it('highlights matching complex options', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" match-mode="all">
            <lion-option .choiceValue="${'Artichoke'}">
              <div>Artichoke</div>
              <small>Cardoon</small>
            </lion-option>
            <lion-option .choiceValue="${'Chard'}">
              <div>Chard</div>
              <small>Beet</small>
            </lion-option>
            <lion-option .choiceValue="${'Chicory'}">
              <div>Chicory</div>
              <small>Chicory</small>
            </lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">
              <div>Victoria Plum</div>
              <small>Prunus domestica</small>
            </lion-option>
          </lion-combobox>
        `)
      );
      const options = el.formElements;

      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(
        `<span aria-label=" Artichoke Cardoon "><div>Arti<b>ch</b>oke</div><small>Cardoon</small>`,
      );
      expect(options[1]).lightDom.to.equal(
        `<span aria-label=" Chard Beet "><div><b>Ch</b>ard</div><small>Beet</small>`,
      );
      expect(options[2]).lightDom.to.equal(
        `<span aria-label=" Chicory Chicory "><div><b>Ch</b>icory</div><small><b>Ch</b>icory</small>`,
      );
      expect(options[3]).lightDom.to.equal(
        `<div>Victoria Plum</div><small>Prunus domestica</small>`,
      );
    });

    it('resets removes highlights on reset()', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" match-mode="all">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const options = el.formElements;

      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'c');

      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`<span aria-label="Artichoke">Arti<b>c</b>hoke</span>`);
      el.reset();
      await el.updateComplete;
      expect(options[0]).lightDom.to.equal(`Artichoke`);
    });

    it('synchronizes textbox when autocomplete is "inline" or "both"', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="none">
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      expect(_inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'none';
      el.setCheckedIndex(0);
      expect(_inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'list';
      el.setCheckedIndex(0);
      expect(_inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'inline';
      el.setCheckedIndex(0);
      expect(_inputNode.value).to.equal('Artichoke');

      el.setCheckedIndex(-1);
      el.autocomplete = 'both';
      el.setCheckedIndex(0);
      expect(_inputNode.value).to.equal('Artichoke');
    });

    it('synchronizes last index to textbox when autocomplete is "inline" or "both" when multipleChoice', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" autocomplete="none" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );
      const { _inputNode } = getComboboxMembers(el);

      expect(_inputNode.value).to.eql('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'none';
      el.setCheckedIndex([0]);
      el.setCheckedIndex([1]);
      expect(_inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'list';
      el.setCheckedIndex([0]);
      el.setCheckedIndex([1]);
      expect(_inputNode.value).to.equal('');

      el.setCheckedIndex(-1);
      el.autocomplete = 'inline';
      el.setCheckedIndex([0]);
      expect(_inputNode.value).to.equal('Artichoke');
      el.setCheckedIndex([1]);
      expect(_inputNode.value).to.equal('Chard');

      el.setCheckedIndex(-1);
      el.autocomplete = 'both';
      el.setCheckedIndex([0]);
      expect(_inputNode.value).to.equal('Artichoke');
      el.setCheckedIndex([1]);
      expect(_inputNode.value).to.equal('Chard');
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

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
          <${tag} name="foo" autocomplete="none" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </${tag}>
        `)
        );
        const { _inputNode } = getComboboxMembers(el);

        el.setCheckedIndex(-1);
        el.autocomplete = 'none';
        el.setCheckedIndex([0]);
        expect(_inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'list';
        el.setCheckedIndex([0]);
        expect(_inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'inline';
        el.setCheckedIndex([0]);
        expect(_inputNode.value).to.equal('Artichoke--multi');

        el.setCheckedIndex(-1);
        el.autocomplete = 'both';
        el.setCheckedIndex([0]);
        expect(_inputNode.value).to.equal('Artichoke--multi');
      });

      describe('Override _getTextboxValueFromOption', () => {
        it('allows to override "_getTextboxValueFromOption" and sync to textbox when multiple', async () => {
          class X extends LionCombobox {
            /**
             * Return the value to be used for the input value
             * @overridable
             * @param {?} option
             * @returns {string}
             */
            // eslint-disable-next-line class-methods-use-this
            _getTextboxValueFromOption(option) {
              return option.label;
            }
          }
          const tagName = defineCE(X);
          const tag = unsafeStatic(tagName);

          const el = /** @type {LionCombobox} */ (
            await fixture(html`
            <${tag} name="foo" autocomplete="both" multiple-choice>
              <lion-option .label="${'Artichoke as label'}" .choiceValue="${{
                value: 'Artichoke',
              }}">Artichoke</lion-option>
              <lion-option .label="${'Chard as label'}" .choiceValue="${{
                value: 'Chard',
              }}">Chard</lion-option>
              <lion-option .label="${'Chicory as label'}" .choiceValue="${{
                value: 'Chicory',
              }}">Chicory</lion-option>
              <lion-option .label="${'Victoria Plum as label'}" .choiceValue="${{
                value: 'Victoria Plum',
              }}">Victoria Plum</lion-option>
            </${tag}>
          `)
          );
          const { _inputNode } = getComboboxMembers(el);
          el.setCheckedIndex(-1);

          // Act
          el.setCheckedIndex([0]);

          // Assert
          expect(_inputNode.value).to.equal('Artichoke as label');

          // Act
          el.setCheckedIndex([3]);

          // Assert
          expect(_inputNode.value).to.equal('Victoria Plum as label');
        });

        it('allows to override "_getTextboxValueFromOption" and sync modelValue with textbox', async () => {
          class X extends LionCombobox {
            /**
             * Return the value to be used for the input value
             * @overridable
             * @param {?} option
             * @returns {string}
             */
            // eslint-disable-next-line class-methods-use-this
            _getTextboxValueFromOption(option) {
              if (option && option.label) {
                return option.label;
              }
              return this.modelValue;
            }
          }
          const tagName = defineCE(X);
          const tag = unsafeStatic(tagName);

          const el = /** @type {LionCombobox} */ (
            await fixture(html`
            <${tag} name="foo">
              <lion-option .label="${'Artichoke as label'}" .choiceValue="${{
                value: 'Artichoke',
              }}">Artichoke</lion-option>
              <lion-option .label="${'Chard as label'}" .choiceValue="${{
                value: 'Chard',
              }}" checked>Chard</lion-option>
              <lion-option .label="${'Chicory as label'}" .choiceValue="${{
                value: 'Chicory',
              }}">Chicory</lion-option>
              <lion-option .label="${'Victoria Plum as label'}" .choiceValue="${{
                value: 'Victoria Plum',
              }}">Victoria Plum</lion-option>
            </${tag}>
          `)
          );
          const { _inputNode } = getComboboxMembers(el);

          // Assume
          expect(_inputNode.value).to.equal('Chard as label');

          // Act
          el.modelValue = { value: 'Chicory' };
          await el.updateComplete;

          // Assert
          expect(_inputNode.value).to.equal('Chicory as label');
        });

        it('allows to override "_getTextboxValueFromOption" and clears modelValue and textbox value on clear()', async () => {
          class X extends LionCombobox {
            /**
             * Return the value to be used for the input value
             * @overridable
             * @param {?} option
             * @returns {string}
             */
            // eslint-disable-next-line class-methods-use-this
            _getTextboxValueFromOption(option) {
              if (option && option.label) {
                return option.label;
              }
              return this.modelValue;
            }
          }
          const tagName = defineCE(X);
          const tag = unsafeStatic(tagName);

          const el = /** @type {LionCombobox} */ (
            await fixture(html`
            <${tag} name="foo" .modelValue="${{ value: 'Artichoke' }}">
              <lion-option .label="${'Artichoke as label'}" .choiceValue="${{
                value: 'Artichoke',
              }}">Artichoke</lion-option>
              <lion-option .label="${'Chard as label'}" .choiceValue="${{
                value: 'Chard',
              }}">Chard</lion-option>
              <lion-option .label="${'Chicory as label'}" .choiceValue="${{
                value: 'Chicory',
              }}">Chicory</lion-option>
              <lion-option .label="${'Victoria Plum as label'}" .choiceValue="${{
                value: 'Victoria Plum',
              }}">Victoria Plum</lion-option>
            </${tag}>
          `)
          );
          const { _inputNode } = getComboboxMembers(el);

          // Assume
          expect(_inputNode.value).to.equal('Artichoke as label');

          // Act
          el.clear();

          // Assert
          expect(el.modelValue).to.equal('');
          expect(_inputNode.value).to.equal('');
        });

        it('allows to override "_getTextboxValueFromOption" and syncs textbox to modelValue', async () => {
          class X extends LionCombobox {
            /**
             * Return the value to be used for the input value
             * @overridable
             * @param {?} option
             * @returns {string}
             */
            // eslint-disable-next-line class-methods-use-this
            _getTextboxValueFromOption(option) {
              return option.label;
            }
          }
          const tagName = defineCE(X);
          const tag = unsafeStatic(tagName);

          const el = /** @type {LionCombobox} */ (
            await fixture(html`
            <${tag} name="foo">
              <lion-option .label="${'Artichoke as label'}" .choiceValue="${{
                value: 'Artichoke',
              }}">Artichoke</lion-option>
              <lion-option .label="${'Chard as label'}" .choiceValue="${{
                value: 'Chard',
              }}">Chard</lion-option>
              <lion-option .label="${'Chicory as label'}" .choiceValue="${{
                value: 'Chicory',
              }}">Chicory</lion-option>
              <lion-option .label="${'Victoria Plum as label'}" .choiceValue="${{
                value: 'Victoria Plum',
              }}">Victoria Plum</lion-option>
            </${tag}>
          `)
          );
          const { _inputNode } = getComboboxMembers(el);

          /** @param {string} autocompleteMode */
          async function performChecks(autocompleteMode) {
            await el.updateComplete;

            el.formElements[0].click();

            // FIXME: fix properly for Webkit
            // expect(_inputNode.value).to.equal('Aha', autocompleteMode);
            expect(el.checkedIndex).to.equal(0, autocompleteMode);

            await mimicUserTypingAdvanced(el, ['A', 'r', 't', 'i']);
            await el.updateComplete;
            expect(_inputNode.value).to.equal('Arti', `autocompleteMode is ${autocompleteMode}`);

            await el.updateComplete;
            expect(el.checkedIndex).to.equal(-1, `autocompleteMode is ${autocompleteMode}`);
            _inputNode.value = '';
          }

          el.autocomplete = 'none';
          await performChecks('none');

          el.autocomplete = 'list';
          await performChecks('list');
        });
      });

      it('allows to override "_onFilterMatch" and "_onFilterUmatch"', async () => {
        class X extends LionCombobox {
          /**
           * @overridable
           * @param {LionOption & {__originalInnerHTML?:string}} option
           * @param {string} matchingString
           * @protected
           */
          _onFilterMatch(option, matchingString) {
            Array.from(option.children).forEach(child => {
              if (child.hasAttribute('data-key')) {
                this._highlightMatchedOption(child, matchingString);
              }
            });
            // Alternatively, an extension can add an animation here
            // option.style.display = '';
          }

          /**
           * @overridable
           * @param {LionOption & {__originalInnerHTML?:string}} option
           * @param {string} [curValue]
           * @param {string} [prevValue]
           * @protected
           */
          // eslint-disable-next-line no-unused-vars
          _onFilterUnmatch(option, curValue, prevValue) {
            Array.from(option.children).forEach(child => {
              if (child.hasAttribute('data-key')) {
                this._unhighlightMatchedOption(child);
              }
            });
            // Alternatively, an extension can add an animation here
            // option.style.display = 'none';
          }
        }
        const tagName = defineCE(X);
        const tag = unsafeStatic(tagName);

        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <${tag} name="foo" autocomplete="both">
              <lion-option .choiceValue="${'Artichoke'}">
                <div data-key>Artichoke</div>
                <small>Cardoon</small>
              </lion-option>
              <lion-option .choiceValue="${'Chard'}">
                <div data-key>Chard</div>
                <small>Beet</small>
              </lion-option>
              <lion-option .choiceValue="${'Chicory'}">
                <div data-key>Chicory</div>
                <small>Chicory</small>
              </lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">
                <div data-key>Victoria Plum</div>
                <small>Prunus domestica</small>
              </lion-option>
            </${tag}>
          `)
        );
        const options = el.formElements;

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');

        await el.updateComplete;
        expect(options[0]).lightDom.to.equal(
          `<div data-key><span aria-label="Artichoke">Arti<b>ch</b>oke</span></div><small>Cardoon</small>`,
        );
        expect(options[1]).lightDom.to.equal(
          `<div data-key><span aria-label="Chard"><b>Ch</b>ard</div></span><small>Beet</small>`,
        );
        expect(options[2]).lightDom.to.equal(
          `<div data-key><span aria-label="Chicory"><b>Ch</b>icory</span></div><small>Chicory</small>`,
        );
        expect(options[3]).lightDom.to.equal(
          `<div data-key>Victoria Plum</div><small>Prunus domestica</small>`,
        );

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'D');

        await el.updateComplete;
        expect(options[0]).lightDom.to.equal(`<div data-key>Artichoke</div><small>Cardoon</small>`);
        expect(options[1]).lightDom.to.equal(
          `<div data-key><span aria-label="Chard">Char<b>d</b></div></span><small>Beet</small>`,
        );
        expect(options[2]).lightDom.to.equal(`<div data-key>Chicory</div><small>Chicory</small>`);
        expect(options[3]).lightDom.to.equal(
          `<div data-key>Victoria Plum</div><small>Prunus domestica</small>`,
        );
      });
    });

    describe('Active index behavior', () => {
      it('sets the active index to the closest match on open by default', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
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
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" autocomplete="none">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _inputNode } = getComboboxMembers(el);

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
          elm.setCheckedIndex(-1);
          // eslint-disable-next-line no-param-reassign
          elm.opened = true;
          await elm.updateComplete;
        }

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 1. List Autocomplete with Manual Selection:
        // does not set active at all until user selects
        await setup(el, 'none');

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.true;

        mimicKeyPress(_inputNode, 'Enter');
        expect(el.opened).to.be.false;
        expect(el.activeIndex).to.equal(-1);

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 2. List Autocomplete with Automatic Selection:
        // does not set active at all until user selects
        await setup(el, 'list');

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.opened).to.be.true;
        expect(el.activeIndex).to.equal(-1);

        mimicKeyPress(_inputNode, 'Enter');
        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.false;

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 3. List with Inline Autocomplete (mostly, but with aria-autocomplete="inline")
        await setup(el, 'inline');

        await mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        await el.updateComplete;
        expect(el.opened).to.be.true;

        expect(el.activeIndex).to.equal(1);

        mimicKeyPress(_inputNode, 'Enter');
        await el.updateComplete;
        await el.updateComplete;

        expect(el.activeIndex).to.equal(-1);
        expect(el.opened).to.be.false;

        // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
        // Example 3. List with Inline Autocomplete
        await setup(el, 'both');
        await mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        mimicKeyPress(_inputNode, 'Enter');
        expect(el.activeIndex).to.equal(1);
        expect(el.opened).to.be.false;
      });

      it('sets the active index to the closest match on autocomplete', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" autocomplete="both">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _inputNode } = getComboboxMembers(el);

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(1);

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'chi');
        // Chard no longer matches, so should switch active to Chicory
        await el.updateComplete;

        expect(el.activeIndex).to.equal(2);

        // select artichoke
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'artichoke');
        await el.updateComplete;
        mimicKeyPress(_inputNode, 'Enter');

        await mimicUserTyping(/** @type {LionCombobox} */ (el), '');
        await el.updateComplete;
        // change selection, active index should update to closest match
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'vic');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(3);
      });

      it('supports clearing by [Escape] key and resets active state on all options', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );
        const { _inputNode } = getComboboxMembers(el);

        // Select something
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'cha');
        await el.updateComplete;
        mimicKeyPress(_inputNode, 'Enter');
        expect(el.activeIndex).to.equal(1);

        mimicKeyPress(_inputNode, 'Escape');
        await el.updateComplete;
        expect(_inputNode.textContent).to.equal('');

        el.formElements.forEach(option => expect(option.active).to.be.false);

        // change selection, active index should update to closest match
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'vic');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(3);
      });
    });

    describe('Accessibility', () => {
      it('synchronizes autocomplete option to textbox', async () => {
        let el;
        [el] = await fruitFixture({ autocomplete: 'both' });
        expect(
          getComboboxMembers(/** @type {LionCombobox} */ (el))._inputNode.getAttribute(
            'aria-autocomplete',
          ),
        ).to.equal('both');

        [el] = await fruitFixture({ autocomplete: 'list' });
        expect(
          getComboboxMembers(/** @type {LionCombobox} */ (el))._inputNode.getAttribute(
            'aria-autocomplete',
          ),
        ).to.equal('list');

        [el] = await fruitFixture({ autocomplete: 'none' });
        expect(
          getComboboxMembers(/** @type {LionCombobox} */ (el))._inputNode.getAttribute(
            'aria-autocomplete',
          ),
        ).to.equal('none');
      });

      it('updates aria-activedescendant on textbox node', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" autocomplete="none">
              <lion-option .choiceValue="${'Artichoke'}" id="artichoke-option"
                >Artichoke</lion-option
              >
              <lion-option .choiceValue="${'Chard'}" id="chard-option">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );

        const elProts = getComboboxMembers(el);

        expect(elProts._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          null,
        );
        expect(el.formElements[1].active).to.equal(false);

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el.updateComplete;
        expect(elProts._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          null,
        );
        // el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        mimicKeyPress(elProts._inputNode, 'ArrowDown');
        expect(elProts._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'artichoke-option',
        );
        expect(el.formElements[1].active).to.equal(false);

        const el2 = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" autocomplete="both" match-mode="begin">
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
          `)
        );

        const el2Prots = getComboboxMembers(el2);

        await mimicUserTyping(/** @type {LionCombobox} */ (el2), 'ch');
        await el2.updateComplete;
        expect(el2Prots._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el2.formElements[1].id,
        );
        expect(el2.formElements[1].active).to.equal(true);

        el2.autocomplete = 'list';
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
        await el2.updateComplete;
        expect(el2Prots._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          el2.formElements[1].id,
        );
        expect(el2.formElements[1].active).to.equal(true);
      });

      it('adds aria-label to highlighted options', async () => {
        const [el, options] = await fruitFixture({ autocomplete: 'both', matchMode: 'all' });
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'choke');
        await el.updateComplete;
        const labelledElement = options[0].querySelector('span[aria-label="Artichoke"]');
        expect(labelledElement).to.not.be.null;
        expect(labelledElement.innerText).to.equal('Artichoke');
      });

      it('adds aria-label to highlighted complex options', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" match-mode="all">
              <lion-option .choiceValue="${'Artichoke'}">
                <div>Artichoke</div>
                <small>Cardoon</small>
              </lion-option>
            </lion-combobox>
          `)
        );
        const options = el.formElements;

        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'choke');
        await el.updateComplete;
        const labelledElement = options[0].querySelector('span[aria-label=" Artichoke Cardoon "]');
        expect(labelledElement).to.not.be.null;
        expect(labelledElement.innerText).to.equal('Artichoke\nCardoon');
      });
    });
  });

  describe('Accessibility', () => {
    describe('Aria versions', () => {
      it('[role=combobox] wraps input node in v1.1', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" ._ariaVersion="${'1.1'}">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode, _inputNode } = getComboboxMembers(el);

        expect(_comboboxNode.contains(_inputNode)).to.be.true;
      });

      it('has one input node with [role=combobox] in v1.0', async () => {
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo" ._ariaVersion="${'1.0'}">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            </lion-combobox>
          `)
        );
        const { _comboboxNode, _inputNode } = getComboboxMembers(el);

        expect(_comboboxNode).to.equal(_inputNode);
      });

      it('autodetects aria version and sets it to 1.1 on Chromium browsers', async () => {
        const browserDetectionIsChromiumOriginal = browserDetection.isChromium;

        browserDetection.isChromium = true;
        const el = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            </lion-combobox>
          `)
        );
        const elProts = getComboboxMembers(el);

        expect(elProts._ariaVersion).to.equal('1.1');

        browserDetection.isChromium = false;
        const el2 = /** @type {LionCombobox} */ (
          await fixture(html`
            <lion-combobox name="foo">
              <lion-option .choiceValue="${'10'}" checked>Item 1</lion-option>
            </lion-combobox>
          `)
        );
        const el2Prots = getComboboxMembers(el2);

        expect(el2Prots._ariaVersion).to.equal('1.0');

        // restore...
        browserDetection.isChromium = browserDetectionIsChromiumOriginal;
      });
    });
  });

  describe('Multiple Choice', () => {
    // TODO: possibly later share test with select-rich if it officially supports multipleChoice
    it('does not close listbox on click', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      // activate opened listbox
      await mimicUserTyping(el, 'ch');
      await el.updateComplete;

      expect(el.opened).to.equal(true);
      const visibleOptions = el.formElements.filter(o => o.style.display !== 'none');
      visibleOptions[0].click();
      expect(el.opened).to.equal(true);
    });

    it('does not close listbox on [Enter]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);

      await mimicUserTyping(el, 'art');
      await el.updateComplete;
      expect(el.opened).to.equal(true);

      // N.B. we do only trigger keydown here (and not mimicKeypress (both keyup and down)),
      // because this closely mimics what happens in the browser
      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.equal(true);
    });

    it('clears textbox after selection of a new item on [enter]', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);
      const options = el.formElements;

      await mimicUserTyping(el, 'art');
      await el.updateComplete;

      expect(el.opened).to.equal(true);
      const visibleOptions = () => options.filter(o => o.style.display !== 'none');
      expect(visibleOptions().length).to.equal(1);

      // N.B. we do only trigger keydown here (and not mimicKeypress (both keyup and down)),
      // because this closely mimics what happens in the browser
      _inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.opened).to.equal(true);
      expect(visibleOptions().length).to.equal(0);
      expect(_inputNode.value).to.equal('');
    });

    it('clears textbox after selection of a new item on click', async () => {
      const el = /** @type {LionCombobox} */ (
        await fixture(html`
          <lion-combobox name="foo" multiple-choice>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `)
      );

      const { _inputNode } = getComboboxMembers(el);
      const options = el.formElements;

      await mimicUserTyping(el, 'art');
      await el.updateComplete;

      expect(el.opened).to.equal(true);
      const visibleOptions = () => options.filter(o => o.style.display !== 'none');
      expect(visibleOptions().length).to.equal(1);

      visibleOptions()[0].click();
      expect(el.opened).to.equal(true);
      expect(visibleOptions().length).to.equal(0);
      expect(_inputNode.value).to.equal('');
    });

    it('submits form on [Enter] when listbox is closed', async () => {
      const submitSpy = sinon.spy(e => e.preventDefault());
      const el = /** @type {HTMLFormElement}  */ (
        await fixture(html`
          <form @submit=${submitSpy}>
            <lion-combobox name="foo" multiple-choice>
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
            <button type="submit">submit</button>
          </form>
        `)
      );
      const combobox = /** @type {LionCombobox} */ (el.querySelector('[name="foo"]'));
      const { _inputNode } = getComboboxMembers(combobox);
      await combobox.updateComplete;
      _inputNode.focus();
      await sendKeys({
        press: 'Enter',
      });
      expect(submitSpy.callCount).to.equal(1);
    });

    it('does not submit form on [Enter] when listbox is opened', async () => {
      const submitSpy = sinon.spy(e => e.preventDefault());
      const el = /** @type {HTMLFormElement}  */ (
        await fixture(html`
          <form @submit=${submitSpy}>
            <lion-combobox name="foo" multiple-choice>
              <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
              <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
              <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
              <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
            </lion-combobox>
            <button type="submit">submit</button>
          </form>
        `)
      );
      const combobox = /** @type {LionCombobox} */ (el.querySelector('[name="foo"]'));
      const { _inputNode } = getComboboxMembers(combobox);
      combobox.opened = true;
      await combobox.updateComplete;
      _inputNode.focus();
      await sendKeys({
        press: 'Enter',
      });
      expect(submitSpy.callCount).to.equal(0);
    });
  });

  describe('Match Mode', () => {
    it('has a default value of "all"', async () => {
      const [el] = await fruitFixture();
      expect(el.matchMode).to.equal('all');
    });

    it('will suggest partial matches (in the middle of the word) when set to "all"', async () => {
      const [el] = await fruitFixture();
      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'c');
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
      await mimicUserTyping(/** @type {LionCombobox} */ (el), 'ch');
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
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'Chicory');
        await el.updateComplete;
        expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql(['Chicory']);
        await mimicUserTyping(/** @type {LionCombobox} */ (el), 'Chicor');
        await el.updateComplete;
        expect(getFilteredOptionValues(/** @type {LionCombobox} */ (el))).to.eql([]);
      });
    });
  });
});
