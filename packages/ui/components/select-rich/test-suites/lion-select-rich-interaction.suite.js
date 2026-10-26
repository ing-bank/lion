import { html } from 'lit/static-html.js';
import { unsafeStatic, expect, triggerBlurFor, triggerFocusFor, fixture } from '@open-wc/testing';
import { Required } from '@lion/ui/form-core.js';
import { browserDetection } from '@lion/ui/core.js';
import sinon from 'sinon';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-select-rich.js';
import { getSelectRichMembers } from '@lion/ui/select-rich-test-helpers.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionSelectRich.js').LionSelectRich} LionSelectRich
 * @typedef {import('../../listbox/src/LionOption.js').LionOption} LionOption
 */

/**
 * @param {HTMLElement} el
 * @param {string} key
 * @param {string} code
 */
function mimicKeyPress(el, key, code = '') {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, code }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key, code }));
}

/**
 * @param {LionOption[]} options
 * @param {number} selectedIndex
 */
function expectOnlyGivenOneOptionToBeChecked(options, selectedIndex) {
  /**
   * @param {{ classes?: Record<string, CustomElementConstructor>,  checked: any; }} option
   * @param {any} i
   */
  options.forEach((option, i) => {
    if (i === selectedIndex) {
      expect(option.checked).to.be.true;
    } else {
      expect(option.checked).to.be.false;
    }
  });
}

/**
 * Runs the `lion-select-rich` behavioural suite, moved out of `test/lion-select-rich-interaction.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your registered
 * tag; see docs/guides/principles/test-suites.md.
 * @param {{ classes?: Record<string, CustomElementConstructor>, optionTagString?: string, optionsTagString?: string, tagString?: string }} [customConfig]
 */
export function runSelectRichInteractionSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-select-rich',
    ...customConfig,
  };
  cfg.tagString = resolveSuiteTag(cfg.classes.host, cfg.tagString, 'lion-select-rich');
  const tag = unsafeStatic(cfg.tagString);
  const tagNameOptions = resolveSuiteTag(cfg.classes.options, cfg.optionsTagString, 'lion-options');
  const tagOptions = unsafeStatic(tagNameOptions);
  const tagNameOption = resolveSuiteTag(cfg.classes.option, cfg.optionTagString, 'lion-option');
  const tagOption = unsafeStatic(tagNameOption);

  describe('lion-select-rich interactions', () => {
    describe('Scrolling active options', () => {
      afterEach(() => {
        sinon.restore();
      });

      it('does not scroll while typing a selection from the closed invoker', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="windows/linux">
              <${tagOption} .choiceValue=${'red'}>Red</${tagOption}>
              <${tagOption} .choiceValue=${'teal'}>Teal</${tagOption}>
            </${tag}>
          `)
        );
        const scrollSpy = sinon.spy(Element.prototype, 'scrollIntoView');

        mimicKeyPress(el, 't', 'KeyT');
        await el.updateComplete;

        expect(el.opened).to.be.false;
        expect(el.checkedIndex).to.equal(1);
        expect(scrollSpy.callCount).to.equal(0);
      });

      it('scrolls the selected option on opening and the active option on keyboard navigation', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac">
              <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
              <${tagOption} .choiceValue=${20} checked>Item 2</${tagOption}>
              <${tagOption} .choiceValue=${30}>Item 3</${tagOption}>
            </${tag}>
          `)
        );
        const { _overlayCtrl, _listboxNode } = getSelectRichMembers(el);
        const scrollSpy = sinon.spy(Element.prototype, 'scrollIntoView');

        await _overlayCtrl.show();
        await el.updateComplete;

        expect(el.opened).to.be.true;
        expect(scrollSpy.calledOn(el.formElements[1])).to.be.true;
        scrollSpy.resetHistory();

        mimicKeyPress(_listboxNode, 'ArrowDown');
        await el.updateComplete;

        expect(el.activeIndex).to.equal(2);
        expect(scrollSpy.calledOn(el.formElements[2])).to.be.true;
      });
    });

    describe('Interaction mode', () => {
      it('autodetects interactionMode if not defined', async () => {
        const originalIsMac = browserDetection.isMac;

        browserDetection.isMac = true;
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag}><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></${tag}>
          `)
        );
        expect(el.interactionMode).to.equal('mac');
        const el2 = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="windows/linux"
              ><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></lion-select-rich
            >
          `)
        );
        expect(el2.interactionMode).to.equal('windows/linux');

        browserDetection.isMac = false;
        const el3 = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag}><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></${tag}>
          `)
        );
        expect(el3.interactionMode).to.equal('windows/linux');
        const el4 = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac"
              ><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></lion-select-rich
            >
          `)
        );
        expect(el4.interactionMode).to.equal('mac');
        browserDetection.isMac = originalIsMac;
      });

      it('derives selectionFollowsFocus and navigateWithinInvoker from interactionMode', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="windows/linux"
              ><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></lion-select-rich
            >
          `)
        );
        expect(el.selectionFollowsFocus).to.be.true;
        expect(el.navigateWithinInvoker).to.be.true;

        const el2 = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac"
              ><${tagOption} .choiceValue=${10}>Item 1</${tagOption}></lion-select-rich
            >
          `)
        );
        expect(el2.selectionFollowsFocus).to.be.false;
        expect(el2.navigateWithinInvoker).to.be.false;
      });
    });

    describe('Invoker Keyboard navigation Mac', () => {
      it('opens dropdown with [ArrowDown] [ArrowUp] keys or navigates through the listbox options', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac">
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
                <${tagOption} .choiceValue=${20}>Item 2</${tagOption}>
                <${tagOption} .choiceValue=${30}>Item 3</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        const options = el.formElements;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));

        expect(el.opened).to.be.true;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.opened = false;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
        expect(el.opened).to.be.true;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);
      });

      it('does not open dropdown with [ArrowLeft] [ArrowRight] keys or navigates through the listbox options', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac">
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
                <${tagOption} .choiceValue=${20}>Item 2</${tagOption}>
                <${tagOption} .choiceValue=${30}>Item 3</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        const options = el.formElements;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));

        expect(el.opened).to.be.false;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
        expect(el.opened).to.be.false;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);
      });

      it('checks a value with [character] keys while listbox unopened', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="mac">
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${'red'}>Red</${tagOption}>
                <${tagOption} .choiceValue=${'teal'}>Teal</${tagOption}>
                <${tagOption} .choiceValue=${'turquoise'}>Turquoise</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        // @ts-ignore [allow-private] in test
        mimicKeyPress(el, 't', 'KeyT');
        expect(el.checkedIndex).to.equal(1);

        mimicKeyPress(el, 'u', 'KeyU');
        expect(el.checkedIndex).to.equal(2);
      });
    });

    describe('Invoker Keyboard navigation Windows/Linux', () => {
      it('navigation through list with [ArrowDown] [ArrowUp] keys checks the option while listbox unopened', async () => {
        let isTriggeredByUser;
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag}
              interaction-mode="windows/linux"
              @model-value-changed="${(/** @type {CustomEvent} */ event) => {
                isTriggeredByUser = event.detail.isTriggeredByUser;
              }}"
            >
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
                <${tagOption} .choiceValue=${20}>Item 2</${tagOption}>
                <${tagOption} .choiceValue=${30}>Item 3</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        const options = el.formElements;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
        expect(el.checkedIndex).to.equal(1);
        expectOnlyGivenOneOptionToBeChecked(options, 1);
        expect(isTriggeredByUser).to.be.true;

        isTriggeredByUser = false;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);
        expect(isTriggeredByUser).to.be.true;
      });

      it('navigation through list with [ArrowLeft] [ArrowRight] keys checks the option while listbox unopened', async () => {
        let isTriggeredByUser;
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag}
              interaction-mode="windows/linux"
              @model-value-changed="${(/** @type {CustomEvent} */ event) => {
                isTriggeredByUser = event.detail.isTriggeredByUser;
              }}"
            >
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
                <${tagOption} .choiceValue=${20}>Item 2</${tagOption}>
                <${tagOption} .choiceValue=${30}>Item 3</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        const options = el.formElements;
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
        expect(el.checkedIndex).to.equal(1);
        expectOnlyGivenOneOptionToBeChecked(options, 1);
        expect(isTriggeredByUser).to.be.true;

        isTriggeredByUser = false;

        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
        expect(el.checkedIndex).to.equal(0);
        expectOnlyGivenOneOptionToBeChecked(options, 0);
        expect(isTriggeredByUser).to.be.true;
      });

      it('checks a value with [character] keys while listbox unopened', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} interaction-mode="windows/linux">
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${'red'}>Red</${tagOption}>
                <${tagOption} .choiceValue=${'teal'}>Teal</${tagOption}>
                <${tagOption} .choiceValue=${'turquoise'}>Turquoise</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );

        // @ts-ignore [allow-private] in test
        mimicKeyPress(el, 't', 'KeyT');
        expect(el.checkedIndex).to.equal(1);

        mimicKeyPress(el, 'u', 'KeyU');
        expect(el.checkedIndex).to.equal(2);
      });
    });

    describe('Disabled', () => {
      it('invoker cannot be focused if disabled', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} disabled>
              <${tagOptions} slot="input"></${tagOptions}>
            </${tag}>
          `)
        );
        const { _invokerNode } = getSelectRichMembers(el);
        expect(_invokerNode.tabIndex).to.equal(-1);
      });

      it('cannot be opened via click if disabled', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} disabled>
              <${tagOptions} slot="input"></${tagOptions}>
            </${tag}>
          `)
        );
        const { _invokerNode, _overlayCtrl } = getSelectRichMembers(el);
        _invokerNode.click();
        await _overlayCtrl._showComplete;
        expect(el.opened).to.be.false;
      });

      it('reflects disabled attribute to invoker', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} disabled>
              <${tagOptions} slot="input"></${tagOptions}>
            </${tag}>
          `)
        );
        const { _invokerNode } = getSelectRichMembers(el);
        expect(_invokerNode.hasAttribute('disabled')).to.be.true;
        el.removeAttribute('disabled');
        await el.updateComplete;
        expect(_invokerNode.hasAttribute('disabled')).to.be.false;
      });
    });

    describe('Interaction states', () => {
      it('becomes touched if blurred once', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag}>
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${10}>Item 1</${tagOption}>
                <${tagOption} .choiceValue=${20}>Item 2</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );
        const { _invokerNode } = getSelectRichMembers(el);
        expect(el.touched).to.be.false;
        await triggerFocusFor(_invokerNode);
        await triggerBlurFor(_invokerNode);
        expect(el.touched).to.be.true;
      });
    });

    describe('Accessibility', () => {
      it('sets [aria-invalid="true"] to "._invokerNode" when there is an error', async () => {
        const el = /** @type {LionSelectRich} */ (
          await fixture(html`
            <${tag} .validators=${[new Required()]}>
              <${tagOptions} slot="input">
                <${tagOption} .choiceValue=${null}>Please select a value</${tagOption}>
                <${tagOption} .modelValue=${{ value: 10, checked: true }}>Item 1</${tagOption}>
              </${tagOptions}>
            </${tag}>
          `)
        );
        const { _invokerNode } = getSelectRichMembers(el);
        const options = el.formElements;
        await el.feedbackComplete;
        await el.updateComplete;
        expect(_invokerNode.getAttribute('aria-invalid')).to.equal('false');

        options[0].checked = true;
        await el.feedbackComplete;
        await el.updateComplete;
        expect(_invokerNode.getAttribute('aria-invalid')).to.equal('true');

        options[1].checked = true;
        await el.feedbackComplete;
        await el.updateComplete;
        expect(_invokerNode.getAttribute('aria-invalid')).to.equal('false');
      });
    });
  });
}
