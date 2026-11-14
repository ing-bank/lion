import { expect, fixture } from '@open-wc/testing';
import { simulateTab } from '../../src/utils/simulate-tab.js';

describe('simulateTab()', () => {
  it('moves focus to the next focusable element and wraps around after the last one', async () => {
    const node = /** @type {HTMLElement} */ (
      await fixture('<div><button id="first">1</button><button id="last">2</button></div>')
    );
    const first = /** @type {HTMLElement} */ (node.querySelector('#first'));
    const last = /** @type {HTMLElement} */ (node.querySelector('#last'));

    first.focus();
    simulateTab(node);
    expect(document.activeElement).to.equal(last);

    simulateTab(node);
    expect(document.activeElement).to.equal(first);
  });
});
