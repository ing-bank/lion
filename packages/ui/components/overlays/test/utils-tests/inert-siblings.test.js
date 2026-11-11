import { expect, fixture } from '@open-wc/testing';
import { setSiblingsInert, unsetSiblingsInert } from '@lion/ui/overlays.js';

describe('setSiblingsInert() / unsetSiblingsInert()', () => {
  it('makes all siblings inert and hidden for screen readers, and restores them', async () => {
    const parent = /** @type {HTMLElement} */ (
      await fixture('<div><p id="a"></p><p id="target"></p><p id="b"></p></div>')
    );
    const target = /** @type {HTMLElement} */ (parent.querySelector('#target'));
    const siblings = [parent.querySelector('#a'), parent.querySelector('#b')];

    setSiblingsInert(target);
    siblings.forEach(sibling => {
      expect(sibling).to.have.attribute('inert', '');
      expect(sibling).to.have.attribute('aria-hidden', 'true');
    });
    expect(target).not.to.have.attribute('inert');
    expect(target).not.to.have.attribute('aria-hidden');

    unsetSiblingsInert(target);
    siblings.forEach(sibling => {
      expect(sibling).not.to.have.attribute('inert');
      expect(sibling).not.to.have.attribute('aria-hidden');
    });
  });
});
