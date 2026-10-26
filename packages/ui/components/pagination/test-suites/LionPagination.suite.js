import { fixture as _fixture, expect, unsafeStatic } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';

import '@lion/ui/define/lion-pagination.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionPagination.js').LionPagination} LionPagination
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * Runs the `<lion-pagination>` behavioural suite. Pass `tagString` to run it against your own
 * registered element (see docs/guides/principles/test-suites.md).
 * @param {{ classes?: Record<string, CustomElementConstructor>, tagString?: string }} [customConfig]
 */
export function runPaginationSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-pagination',
    ...customConfig,
  };

  cfg.tagString = resolveSuiteTag(cfg.classes.pagination, cfg.tagString, 'lion-pagination');
  const tag = unsafeStatic(cfg.tagString);
  const fixture = /** @type {(arg: TemplateResult) => Promise<LionPagination>} */ (_fixture);

  describe('Pagination', () => {
    it('has states for count and current', async () => {
      const el = await fixture(html` <${tag} count="4"></${tag}> `);
      expect(el.getAttribute('count')).to.equal('4');
      expect(el.getAttribute('current')).to.equal('1');
      el.count = 8;
      el.current = 2;
      await el.updateComplete;
      expect(el.getAttribute('count')).to.equal('8');
      expect(el.getAttribute('current')).to.equal('2');
    });

    it('disables the previous button if on first page', async () => {
      const el = await fixture(html` <${tag} count="4"></${tag}> `);
      const buttons = Array.from(
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
      );
      expect(buttons[0]).to.has.attribute('disabled');
    });

    it('disables the next button if on last page', async () => {
      const el = await fixture(html` <${tag} count="4" current="4"></${tag}> `);
      const buttons = Array.from(
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
      );
      expect(buttons[buttons.length - 1]).to.has.attribute('disabled');
    });

    describe('User interaction', () => {
      it('can go to previous page with previous button', async () => {
        const el = await fixture(html` <${tag} count="6" current="2"></${tag}> `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        buttons[0].click();
        expect(el.current).to.equal(1);
      });

      it('can go to next page with next button', async () => {
        const el = await fixture(html` <${tag} count="6" current="2"></${tag}> `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        buttons[buttons.length - 1].click();
        expect(el.current).to.equal(3);
      });

      it('goes to the page when clicking on its button', async () => {
        const el = await fixture(html` <${tag} count="6" current="2"></${tag}> `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        buttons[5].click();
        expect(el.current).to.equal(5);
      });

      it('fires current-changed event when interacting with the pagination', async () => {
        const changeSpy = sinon.spy();
        const el = await fixture(html`
          <${tag} count="6" current="2" @current-changed=${changeSpy}></${tag}>
        `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        const previous = buttons[0];
        const next = buttons[buttons.length - 1];
        const page5 = buttons[5];

        previous.click();
        expect(changeSpy).to.have.callCount(1);

        next.click();
        expect(changeSpy).to.have.callCount(2);

        page5.click();
        expect(changeSpy).to.have.callCount(3);

        el.current = 3;
        expect(changeSpy).to.have.callCount(4);
      });

      it('does NOT fire current-changed event when clicking on a current page number', async () => {
        const changeSpy = sinon.spy();
        const el = await fixture(html`
          <${tag} count="6" current="2" @current-changed=${changeSpy}></${tag}>
        `);
        const page2 = /** @type {HTMLElement} */ (
          el.shadowRoot?.querySelector("button[aria-current='true']")
        );
        page2.click();
        expect(changeSpy).to.not.be.called;
        expect(el.current).to.equal(2);
      });

      it('should announce next and previous page using `next()` and `previous()`', async () => {
        const el = await fixture(html` <${tag} count="6" current="2"></${tag}> `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        expect(buttons[2].getAttribute('aria-live')).to.equal('polite');
        el.next();
        await el.updateComplete;
        expect(buttons[3].getAttribute('aria-live')).to.equal('polite');
        expect(buttons[2].getAttribute('aria-live')).to.equal('off');
        el.previous();
        await el.updateComplete;
        expect(buttons[3].getAttribute('aria-live')).to.equal('off');
        expect(buttons[2].getAttribute('aria-live')).to.equal('polite');
      });

      it('should goto next and previous page using `next()` and `previous()`', async () => {
        const el = await fixture(html` <${tag} count="6" current="2"></${tag}> `);
        el.next();
        expect(el.current).to.equal(3);
        el.previous();
        expect(el.current).to.equal(2);
      });

      it('should goto first and last page using `first()` and `last()`', async () => {
        const el = await fixture(html` <${tag} count="5" current="2"></${tag}> `);
        expect(el.current).to.equal(2);
        el.first();
        expect(el.current).to.equal(1);
        el.last();
        expect(el.current).to.equal(5);
      });

      it('should goto 7 page using `goto()`', async () => {
        const el = await fixture(html` <${tag} count="10" current="2"></${tag}> `);
        expect(el.current).to.equal(2);
        el.goto(7);
        expect(el.current).to.equal(7);
      });
    });

    describe('Accessibility', () => {
      it('sets aria-current to the current page', async () => {
        const el = await fixture(html` <${tag} count="3"></${tag}> `);
        const buttons = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
        );
        // button[0] is the previous button
        expect(buttons[1].getAttribute('aria-current')).to.equal('true');
        expect(buttons[2].getAttribute('aria-current')).to.equal('false');
        expect(buttons[3].getAttribute('aria-current')).to.equal('false');

        el.current = 2;
        await el.updateComplete;
        expect(buttons[1].getAttribute('aria-current')).to.equal('false');
        expect(buttons[2].getAttribute('aria-current')).to.equal('true');
        expect(buttons[3].getAttribute('aria-current')).to.equal('false');
      });
    });

    describe('Ellipsis display', () => {
      it('should not show ellipsis when count is visiblePages + 1 (count=6, visiblePages=5)', async () => {
        const el = await fixture(html` <${tag} count="6" current="1"></${tag}> `);
        const navItems = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('li'),
        );
        // Check that no ellipsis is rendered (no <span> elements with '...')
        const spans = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('li span'),
        );
        expect(spans.length).to.equal(0);

        // There should be 8 nav items: previous button + 6 page buttons + next button
        expect(navItems.length).to.equal(8);
      });

      it('should not show ellipsis when count is visiblePages + 2 (count=7, visiblePages=5)', async () => {
        const el = await fixture(html` <${tag} count="7" current="1"></${tag}> `);
        // Check that no ellipsis is rendered (no <span> elements with '...')
        const spans = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('li span'),
        );
        expect(spans.length).to.equal(0);

        // There should be 9 nav items: previous button + 7 page buttons + next button
        const navItems = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('li'),
        );
        expect(navItems.length).to.equal(9);
      });

      it('should show ellipsis when count is visiblePages + 3 (count=8, visiblePages=5)', async () => {
        const el = await fixture(html` <${tag} count="8" current="1"></${tag}> `);
        // Check that ellipsis is rendered (should have <span> elements with '...')
        const spans = Array.from(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('li span'),
        );
        expect(spans.length).to.be.greaterThan(0);

        // Verify the ellipsis contains '...'
        const ellipsisText = Array.from(spans).map(span => span.textContent);
        expect(ellipsisText).to.include('...');
      });
    });
  });
}
