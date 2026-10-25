import { expect, fixture, html } from '@open-wc/testing';
import { setSiblingsInert, unsetSiblingsInert } from '@lion/ui/overlays.js';

/**
 * `setSiblingsInert` and `unsetSiblingsInert` are public (`@lion/ui/overlays.js`) and had no test:
 * they are what a consumer uses to make the rest of the page unreachable while an overlay is up.
 */
describe('inert-siblings', () => {
  it('marks every sibling inert and aria-hidden, and restores them', async () => {
    const wrapper = await fixture(html`
      <div>
        <p id="before">before</p>
        <div id="overlay">overlay</div>
        <p id="after">after</p>
      </div>
    `);
    const overlay = /** @type {HTMLElement} */ (wrapper.querySelector('#overlay'));
    const before = /** @type {HTMLElement} */ (wrapper.querySelector('#before'));
    const after = /** @type {HTMLElement} */ (wrapper.querySelector('#after'));

    setSiblingsInert(overlay);
    expect(before.hasAttribute('inert')).to.equal(true);
    expect(before.getAttribute('aria-hidden')).to.equal('true');
    expect(after.hasAttribute('inert')).to.equal(true);
    // The overlay itself is left alone.
    expect(overlay.hasAttribute('inert')).to.equal(false);

    unsetSiblingsInert(overlay);
    expect(before.hasAttribute('inert')).to.equal(false);
    expect(before.getAttribute('aria-hidden')).to.equal(null);
    expect(after.hasAttribute('inert')).to.equal(false);
  });

  it('does nothing without a parent', () => {
    const orphan = document.createElement('div');
    expect(() => setSiblingsInert(orphan)).to.not.throw();
    expect(() => unsetSiblingsInert(orphan)).to.not.throw();
  });
});
