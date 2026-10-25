import { expect, fixture, html } from '@open-wc/testing';
import { simulateTab } from '../helpers/simulate-tab.js';

/**
 * `simulateTab` rotates the focus within a node - the fallback Lion uses to keep Tab inside an overlay
 * when the platform does not do it for us. A synthetic Tab key event does not move focus in a test, so
 * this helper is what makes that behaviour testable at all.
 */
describe('simulateTab', () => {
  it('moves the focus to the next element, and wraps from the last to the first', async () => {
    const el = /** @type {HTMLElement} */ (
      await fixture(html`
        <div>
          <button type="button" id="one">one</button>
          <button type="button" id="two">two</button>
          <button type="button" id="three">three</button>
        </div>
      `)
    );
    const [one, two, three] = /** @type {HTMLElement[]} */ ([...el.querySelectorAll('button')]);

    one.focus();
    simulateTab(el);
    expect(document.activeElement?.id).to.equal(two.id);

    simulateTab(el);
    expect(document.activeElement?.id).to.equal(three.id);

    // The last element wraps to the first, so the focus cannot leave the node this way.
    simulateTab(el);
    expect(document.activeElement?.id).to.equal(one.id);
  });

  it('takes the first element when the focus is outside the node', async () => {
    const el = /** @type {HTMLElement} */ (
      await fixture(html`
        <div>
          <button type="button" id="a">a</button>
          <button type="button" id="b">b</button>
        </div>
      `)
    );
    const [a, b] = /** @type {HTMLElement[]} */ ([...el.querySelectorAll('button')]);
    b.focus();

    simulateTab(el);
    expect([a.id, b.id]).to.include(document.activeElement?.id);
  });
});
