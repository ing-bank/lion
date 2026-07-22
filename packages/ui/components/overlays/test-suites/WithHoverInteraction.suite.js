import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

/**
 * @typedef {import('lit').LitElement & {_overlayCtrl: import('../src/OverlayController.js').OverlayController}} HoverInteractionEl
 * @typedef {{ tagString: string; invokerTagString: string; suffix?: string }} WithHoverInteractionConfig
 */

/**
 * @param {WithHoverInteractionConfig} config
 */
export function runWithHoverInteractionSuite({ tagString, invokerTagString, suffix = '' }) {
  const tag = unsafeStatic(tagString);
  const invokerTag = unsafeStatic(invokerTagString);

  describe(`inherited withHoverInteraction behavior (touch)${suffix}`, () => {
    /** @type {sinon.SinonFakeTimers} */
    let clock;
    /** @type {typeof window.matchMedia} */
    let originalMatchMedia;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      originalMatchMedia = window.matchMedia;
      window.matchMedia = query =>
        /** @type {MediaQueryList} */ ({
          matches: query === '(hover: hover)' ? false : originalMatchMedia(query).matches,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        });
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
      clock.restore();
    });

    it('opens after holding for longpressDuration (500ms)', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
      );
      clock.runAll();
      await Promise.resolve();

      expect(el._overlayCtrl.isShown).to.equal(true);
    });

    it('stays hidden on brief touch: pointerup cancels the timer', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
      );
      invoker.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }));
      clock.tick(500);
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('ignores non-touch pointer events (mouse)', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'mouse', bubbles: true }),
      );
      clock.tick(500);
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('auto-closes after longpressDuration once press ends', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
      );
      clock.runAll();
      await Promise.resolve();
      expect(el._overlayCtrl.isShown).to.equal(true);

      invoker.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }));
      await clock.tickAsync(501);
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('disables text selection on the invoker on init and restores it on teardown', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      const getUserSelect = () =>
        invoker.style.getPropertyValue('user-select') ||
        invoker.style.getPropertyValue('-webkit-user-select');
      expect(getUserSelect()).to.equal('none');

      el._overlayCtrl.teardown();
      expect(getUserSelect()).to.equal('');
    });

    it('does not open on tap-triggered focusin', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(new Event('focusin', { bubbles: true }));
      clock.tick(300);
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('suppresses focusin that immediately follows a touch pointerdown', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
      );
      invoker.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }));
      invoker.dispatchEvent(new Event('focusin', { bubbles: true }));
      clock.tick(1);
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('suppresses click after completed longpress', async () => {
      const el = /** @type {HoverInteractionEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">Tooltip content</div>
          <${invokerTag} slot="invoker">Invoker</${invokerTag}>
        </${tag}>
      `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      let clickTriggered = false;

      invoker.addEventListener('click', () => {
        clickTriggered = true;
      });

      invoker.dispatchEvent(
        new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
      );
      clock.runAll();
      await Promise.resolve();

      invoker.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(clickTriggered).to.equal(false);
    });
  });
}
