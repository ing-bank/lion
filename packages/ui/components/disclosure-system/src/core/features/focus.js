/**
 * Modal behaviour: keep the keyboard inside the content while it is open and hand focus back when it
 * closes. The modal-ness of a native dialog is the core's job (it calls `showModal()` when the
 * descriptor says `modal`); this feature adds the Tab cycle and the focus restoration.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installFocus(disclosure, descriptor) {
  const { content } = disclosure;
  if (!content) return { release: () => {} };

  const previouslyFocused = /** @type {HTMLElement | undefined} */ (
    document.activeElement ?? undefined
  );
  const focusables = () =>
    [...content.querySelectorAll(focusableSelector)].filter(
      node => /** @type {HTMLElement} */ (node).offsetParent !== null,
    );

  const initial =
    descriptor.elementToFocus ?? /** @type {HTMLElement | undefined} */ (focusables()[0]);
  (initial ?? content).focus?.();

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  function onKeydown(event) {
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (items.length === 0) return;
    const first = /** @type {HTMLElement} */ (items[0]);
    const last = /** @type {HTMLElement} */ (items[items.length - 1]);
    const active = /** @type {HTMLElement} */ (document.activeElement);
    if (event.shiftKey && (active === first || !content?.contains(active))) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && active === last) {
      first.focus();
      event.preventDefault();
    }
  }

  document.addEventListener('keydown', onKeydown, true);
  return {
    release: () => {
      document.removeEventListener('keydown', onKeydown, true);
      previouslyFocused?.focus?.();
    },
  };
}
