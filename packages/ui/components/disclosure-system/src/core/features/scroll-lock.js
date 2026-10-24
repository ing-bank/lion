/**
 * Lock page scrolling while the overlay is open, and restore it exactly afterwards. The scrollbar
 * width is compensated so the page does not shift.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

/**
 * @returns {{ release: () => void }}
 */
export function installScrollLock() {
  const { body } = document;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    const current = Number.parseFloat(getComputedStyle(body).paddingRight || '0');
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }

  return {
    release: () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    },
  };
}
