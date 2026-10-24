/**
 * A backdrop for content that sits above the page.
 *
 * Where the platform has a top layer, `::backdrop` already exists, so this feature only marks the
 * content (`[data-backdrop]`) and lets the stylesheet paint it — no duplicate element, no z-index
 * fights. On a plain element (no top layer) there is nothing to paint, so a backdrop node is inserted
 * and clicking it dismisses when `lightDismiss` is set.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installBackdrop(disclosure, descriptor) {
  const { content, element } = disclosure;
  if (!content) return { release: () => {} };
  // keep the narrowed reference: the closure below must not see the optional type again
  const node = content;

  const usesTopLayer = content instanceof HTMLDialogElement || content.hasAttribute('popover');
  if (usesTopLayer) {
    content.setAttribute('data-backdrop', '');
    return {
      release: () => content.removeAttribute('data-backdrop'),
    };
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'disclosure-backdrop';
  backdrop.setAttribute('part', 'backdrop');

  /**
   * @param {PointerEvent} event
   * @returns {void}
   */
  function onClick(event) {
    if (!descriptor.lightDismiss) return;
    if (event.composedPath().includes(node)) return;
    disclosure.hide();
  }

  backdrop.addEventListener('pointerdown', onClick);
  element?.insertBefore(backdrop, content);

  return {
    release: () => {
      backdrop.removeEventListener('pointerdown', onClick);
      backdrop.remove();
    },
  };
}
