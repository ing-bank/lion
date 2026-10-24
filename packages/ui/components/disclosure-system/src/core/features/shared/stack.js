/**
 * The open stack. Nested disclosures have to agree on who closes first, and the platform leaves that
 * to authors: with a `<div role="dialog">` modal underneath, one Escape press used to close the
 * *dialog* while a toggle-tip was open, taking with it the button the user needed (see
 * https://adrianroselli.com/2023/05/brief-note-on-popovers-with-dialogs.html).
 *
 * Rule: the most recently opened disclosure closes first. A modal disclosure therefore never consumes
 * the Escape that belongs to the non-modal disclosure opened on top of it.
 *
 * @typedef {import('../../DisclosureCore.js').Disclosure} Disclosure
 */

/** @type {{ disclosure: Disclosure, modal: boolean }[]} */
const openStack = [];

/**
 * @param {Disclosure} disclosure
 * @returns {void}
 */
export function releaseFromStack(disclosure) {
  const index = openStack.findIndex(entry => entry.disclosure === disclosure);
  if (index !== -1) openStack.splice(index, 1);
}

/**
 * @param {Disclosure} disclosure
 * @param {boolean} modal
 * @returns {void}
 */
export function pushToStack(disclosure, modal) {
  releaseFromStack(disclosure);
  openStack.push({ disclosure, modal });
}

/**
 * Whether this disclosure is the one an Escape press should close: only the topmost open disclosure
 * reacts.
 * @param {Disclosure} disclosure
 * @returns {boolean}
 */
export function isTopmost(disclosure) {
  const top = openStack[openStack.length - 1];
  return !top || top.disclosure === disclosure;
}

/**
 * @returns {number} the number of open disclosures, for tests and diagnostics
 */
export function stackSize() {
  return openStack.length;
}
