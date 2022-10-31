import { LitElement } from 'lit';
import { defineCE, expect, fixture, html, oneEvent, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { FocusMixin } from '@lion/ui/form-core.js';

const windowWithOptionalPolyfill =
  /** @type {Window & typeof globalThis & {applyFocusVisiblePolyfill?: function}} */ (window);

/**
 * Checks two things:
 * 1. whether focus-visible should apply (if focus and keyboard interaction present)
 * 2. whether the polyfill is used or not
 * When the polyfill is used, it mocks `.hasAttribute` method, otherwise `.matches` method
 * of focusable element.
 * @param {HTMLElement} focusableEl focusable element
 * @param {{phase: 'focusin'|'focusout', hasKeyboardInteraction: boolean }} options
 * @returns {function} restore function
 */
function mockFocusVisible(focusableEl, { phase, hasKeyboardInteraction }) {
  const focusVisibleApplies = phase === 'focusin' && hasKeyboardInteraction;
  if (!focusVisibleApplies) {
    return () => {};
  }

  /** @type {any} */
  const originalMatches = focusableEl.matches;
  if (typeof windowWithOptionalPolyfill.applyFocusVisiblePolyfill !== 'function') {
    // eslint-disable-next-line no-param-reassign
    focusableEl.matches = selector =>
      selector === ':focus-visible' || originalMatches.call(focusableEl, selector);
    return () => {
      // eslint-disable-next-line no-param-reassign
      focusableEl.matches = originalMatches;
    };
  }

  const originalHasAttribute = focusableEl.hasAttribute;
  // eslint-disable-next-line no-param-reassign
  focusableEl.hasAttribute = attr =>
    attr === 'data-focus-visible-added' || originalHasAttribute.call(focusableEl, attr);
  return () => {
    // eslint-disable-next-line no-param-reassign
    focusableEl.hasAttribute = originalHasAttribute;
  };
}

/**
 * @returns {function} restore function
 */
function mockPolyfill() {
  const originalApplyFocusVisiblePolyfill = windowWithOptionalPolyfill.applyFocusVisiblePolyfill;
  // @ts-ignore
  window.applyFocusVisiblePolyfill = () => {};
  return () => {
    // @ts-ignore
    window.applyFocusVisiblePolyfill = originalApplyFocusVisiblePolyfill;
  };
}

describe('FocusMixin', () => {
  class Focusable extends FocusMixin(LitElement) {
    render() {
      return html`<slot name="input"></slot>`;
    }

    /**
     * @configure FocusMixin
     */
    get _focusableNode() {
      return /** @type {HTMLInputElement} */ (this.querySelector('input'));
    }
  }

  const tagString = defineCE(Focusable);
  const tag = unsafeStatic(tagString);

  it('focuses/blurs the underlaying native element on .focus()/.blur()', async () => {
    const el = /** @type {Focusable} */ (
      await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
    );
    // @ts-ignore [allow-protected] in test
    const { _focusableNode } = el;

    el.focus();
    expect(document.activeElement === _focusableNode).to.be.true;
    el.blur();
    expect(document.activeElement === _focusableNode).to.be.false;
  });

  it('has an attribute focused when focused', async () => {
    const el = /** @type {Focusable} */ (
      await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
    );

    el.focus();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.true;

    el.blur();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.false;
  });

  it('becomes focused/blurred if the native element gets focused/blurred', async () => {
    const el = /** @type {Focusable} */ (
      await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
    );
    // @ts-ignore [allow-protected] in test
    const { _focusableNode } = el;

    expect(el.focused).to.be.false;
    _focusableNode?.focus();
    expect(el.focused).to.be.true;
    _focusableNode?.blur();
    expect(el.focused).to.be.false;
  });

  it('dispatches [focus, blur] events', async () => {
    const el = /** @type {Focusable} */ (
      await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
    );
    setTimeout(() => el.focus());
    const focusEv = await oneEvent(el, 'focus');
    expect(focusEv).to.be.instanceOf(Event);
    expect(focusEv.target).to.equal(el);
    expect(focusEv.bubbles).to.be.false;
    expect(focusEv.composed).to.be.false;

    setTimeout(() => {
      el.focus();
      el.blur();
    });
    const blurEv = await oneEvent(el, 'blur');
    expect(blurEv).to.be.instanceOf(Event);
    expect(blurEv.target).to.equal(el);
    expect(blurEv.bubbles).to.be.false;
    expect(blurEv.composed).to.be.false;
  });

  it('dispatches [focusin, focusout] events with { bubbles: true, composed: true }', async () => {
    const el = /** @type {Focusable} */ (
      await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
    );
    setTimeout(() => el.focus());
    const focusinEv = await oneEvent(el, 'focusin');
    expect(focusinEv).to.be.instanceOf(Event);
    expect(focusinEv.target).to.equal(el);
    expect(focusinEv.bubbles).to.be.true;
    expect(focusinEv.composed).to.be.true;

    setTimeout(() => {
      el.focus();
      el.blur();
    });
    const focusoutEv = await oneEvent(el, 'focusout');
    expect(focusoutEv).to.be.instanceOf(Event);
    expect(focusoutEv.target).to.equal(el);
    expect(focusoutEv.bubbles).to.be.true;
    expect(focusoutEv.composed).to.be.true;
  });

  describe('Having :focus-visible within', () => {
    it('sets focusedVisible to true when focusable element matches :focus-visible', async () => {
      const el = /** @type {Focusable} */ (
        await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
      );
      // @ts-ignore [allow-protected] in test
      const { _focusableNode } = el;

      const restoreMock1 = mockFocusVisible(_focusableNode, {
        phase: 'focusout',
        hasKeyboardInteraction: true,
      });
      _focusableNode.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.focusedVisible).to.be.false;
      restoreMock1();

      const restoreMock2 = mockFocusVisible(_focusableNode, {
        phase: 'focusin',
        hasKeyboardInteraction: false,
      });
      _focusableNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.focusedVisible).to.be.false;
      restoreMock2();

      const restoreMock3 = mockFocusVisible(_focusableNode, {
        phase: 'focusout',
        hasKeyboardInteraction: false,
      });
      _focusableNode.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.focusedVisible).to.be.false;
      restoreMock3();

      const restoreMock4 = mockFocusVisible(_focusableNode, {
        phase: 'focusin',
        hasKeyboardInteraction: true,
      });
      _focusableNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.focusedVisible).to.be.true;
      restoreMock4();
    });

    it('has an attribute focused-visible when focusedVisible is true', async () => {
      const el = /** @type {Focusable} */ (
        await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `)
      );
      // @ts-ignore [allow-protected] in test
      const { _focusableNode } = el;

      const restoreMock1 = mockFocusVisible(_focusableNode, {
        phase: 'focusout',
        hasKeyboardInteraction: true,
      });
      _focusableNode.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.hasAttribute('focused-visible')).to.be.false;
      restoreMock1();

      const restoreMock2 = mockFocusVisible(_focusableNode, {
        phase: 'focusin',
        hasKeyboardInteraction: true,
      });
      _focusableNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await el.updateComplete;
      expect(el.hasAttribute('focused-visible')).to.be.true;
      restoreMock2();
    });

    // For polyfill, see https://github.com/WICG/focus-visible
    describe('Using polyfill', () => {
      const restoreMockPolyfill = mockPolyfill();
      after(() => {
        restoreMockPolyfill();
      });

      it('calls polyfill once per node', async () => {
        class UniqueHost extends LitElement {
          render() {
            return html`<${tag}><input slot="input"></${tag}><${tag}><input slot="input"></${tag}>`;
          }
        }
        const hostTagString = defineCE(UniqueHost);
        const hostTag = unsafeStatic(hostTagString);

        const polySpy = sinon.spy(windowWithOptionalPolyfill, 'applyFocusVisiblePolyfill');
        await fixture(html`<${hostTag}></${hostTag}>`);
        expect(polySpy).to.have.been.calledOnce;
      });

      it('sets focusedVisible to true when focusable element if :focus-visible polyfill is loaded', async () => {
        const el = /** @type {Focusable} */ (
          await fixture(html`
        <${tag}><input slot="input"></${tag}>
      `)
        );

        // @ts-ignore [allow-protected] in test
        const { _focusableNode } = el;

        const restoreMock1 = mockFocusVisible(_focusableNode, {
          phase: 'focusout',
          hasKeyboardInteraction: true,
        });
        const spy1 = sinon.spy(_focusableNode, 'hasAttribute');
        _focusableNode.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.focusedVisible).to.be.false;
        expect(spy1).to.not.have.been.calledWith('data-focus-visible-added');
        spy1.restore();
        restoreMock1();

        const restoreMock2 = mockFocusVisible(_focusableNode, {
          phase: 'focusin',
          hasKeyboardInteraction: false,
        });
        const spy2 = sinon.spy(_focusableNode, 'hasAttribute');
        _focusableNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.focusedVisible).to.be.false;
        expect(spy2).to.have.been.calledWith('data-focus-visible-added');
        spy2.restore();
        restoreMock2();

        const restoreMock3 = mockFocusVisible(_focusableNode, {
          phase: 'focusout',
          hasKeyboardInteraction: false,
        });
        const spy3 = sinon.spy(_focusableNode, 'hasAttribute');
        _focusableNode.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.focusedVisible).to.be.false;
        expect(spy3).to.not.have.been.calledWith('data-focus-visible-added');
        spy3.restore();
        restoreMock3();

        const restoreMock4 = mockFocusVisible(_focusableNode, {
          phase: 'focusin',
          hasKeyboardInteraction: true,
        });
        const spy4 = sinon.spy(_focusableNode, 'hasAttribute');
        _focusableNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        await el.updateComplete;
        expect(el.focusedVisible).to.be.true;
        expect(spy4).to.have.been.called;
        spy4.restore();
        restoreMock4();
      });
    });
  });
});
