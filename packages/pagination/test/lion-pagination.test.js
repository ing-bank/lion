import { html, fixture as _fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import '../lion-pagination.js';

/**
 * @typedef {import('../src/LionPagination').LionPagination} LionPagination
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionPagination>} */ (_fixture);

describe('Pagination', () => {
  it('has states for count and current', async () => {
    const el = await fixture(html` <lion-pagination count="4"></lion-pagination> `);
    expect(el.getAttribute('count')).to.equal('4');
    expect(el.getAttribute('current')).to.equal('1');
    el.count = 8;
    el.current = 2;
    await el.updateComplete;
    expect(el.getAttribute('count')).to.equal('8');
    expect(el.getAttribute('current')).to.equal('2');
  });

  it('disables the previous button if on first page', async () => {
    const el = await fixture(html` <lion-pagination count="4"></lion-pagination> `);
    const buttons = Array.from(
      /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
    );
    expect(buttons[0]).to.has.attribute('disabled');
  });

  it('disables the next button if on last page', async () => {
    const el = await fixture(html` <lion-pagination count="4" current="4"></lion-pagination> `);
    const buttons = Array.from(
      /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
    );
    expect(buttons[buttons.length - 1]).to.has.attribute('disabled');
  });

  describe('User interaction', () => {
    it('can go to previous page with previous button', async () => {
      const el = await fixture(html` <lion-pagination count="6" current="2"></lion-pagination> `);
      const buttons = Array.from(
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
      );
      buttons[0].click();
      expect(el.current).to.equal(1);
    });

    it('can go to next page with next button', async () => {
      const el = await fixture(html` <lion-pagination count="6" current="2"></lion-pagination> `);
      const buttons = Array.from(
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
      );
      buttons[buttons.length - 1].click();
      expect(el.current).to.equal(3);
    });

    it('goes to the page when clicking on its button', async () => {
      const el = await fixture(html` <lion-pagination count="6" current="2"></lion-pagination> `);
      const buttons = Array.from(
        /** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'),
      );
      buttons[5].click();
      expect(el.current).to.equal(5);
    });

    it('fires current-changed event when interacting with the pagination', async () => {
      const changeSpy = sinon.spy();
      const el = await fixture(html`
        <lion-pagination count="6" current="2" @current-changed=${changeSpy}></lion-pagination>
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
        <lion-pagination count="6" current="2" @current-changed=${changeSpy}></lion-pagination>
      `);
      const page2 = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector(
        "button[aria-current='true']",
      ));
      page2.click();
      expect(changeSpy).to.not.be.called;
      expect(el.current).to.equal(2);
    });

    it('should goto next and previous page using `next()` and `previous()`', async () => {
      const el = await fixture(html` <lion-pagination count="6" current="2"></lion-pagination> `);
      el.next();
      expect(el.current).to.equal(3);
      el.previous();
      expect(el.current).to.equal(2);
    });

    it('should goto first and last page using `first()` and `last()`', async () => {
      const el = await fixture(html` <lion-pagination count="5" current="2"></lion-pagination> `);
      expect(el.current).to.equal(2);
      el.first();
      expect(el.current).to.equal(1);
      el.last();
      expect(el.current).to.equal(5);
    });

    it('should goto 7 page using `goto()`', async () => {
      const el = await fixture(html` <lion-pagination count="10" current="2"></lion-pagination> `);
      expect(el.current).to.equal(2);
      el.goto(7);
      expect(el.current).to.equal(7);
    });
  });

  describe('Accessibility', () => {
    it('sets aria-current to the current page', async () => {
      const el = await fixture(html` <lion-pagination count="3"></lion-pagination> `);
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
});
