/**
 * Close on `Escape`, lazily loaded only when the descriptor sets `closedby`.
 *
 * `closedby: 'closest'` mirrors the platform's `closedby="closest"`: only a press inside the element
 * closes it. `'any'` closes on any Escape, matching `closedby="any"`.
 *
 * Nested disclosures share one stack (see `shared/stack.js`), so only the topmost one reacts: the
 * platform gives no Escape precedence between stacked layers.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

import { isTopmost, pushToStack, releaseFromStack } from './shared/stack.js';

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installEsc(disclosure, descriptor) {
  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  function handler(event) {
    if (event.key !== 'Escape') return;
    if (descriptor.closedby === 'closest') {
      const { element } = disclosure;
      if (element && !event.composedPath().includes(element)) return;
    }
    // Only the topmost open disclosure reacts: a non-modal tip must not swallow the Escape that
    // belongs to the modal dialog behind it, and a non-modal must not close before the tip on top.
    if (!isTopmost(disclosure)) return;
    disclosure.hide();
  }

  pushToStack(disclosure, Boolean(descriptor.modal));
  document.addEventListener('keydown', handler);
  return {
    release: () => {
      document.removeEventListener('keydown', handler);
      releaseFromStack(disclosure);
    },
  };
}
