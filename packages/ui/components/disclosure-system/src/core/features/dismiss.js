/**
 * Dismissal on outside interaction, both halves opt-in and visible in the descriptor.
 *
 * The platform light-dismisses `popover="auto"` on pointer input, but it deliberately does *not*
 * dismiss when focus leaves: screen-reader users who leave a popover would otherwise lose the content
 * they were on their way back to (https://www.scottohara.me/blog/2025/03/14/popovers.html). Making
 * dismissal explicit keeps that trade-off in the hands of the component instead of emerging from it.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installDismiss(disclosure, descriptor) {
  const { element, content } = disclosure;

  /**
   * @param {Event} event
   * @returns {boolean} whether the event happened inside the disclosure
   */
  function isInside(event) {
    const path = event.composedPath();
    return Boolean((element && path.includes(element)) || (content && path.includes(content)));
  }

  /**
   * @param {PointerEvent} event
   * @returns {void}
   */
  function onPointerDown(event) {
    if (isInside(event)) return;
    disclosure.hide();
  }

  /**
   * Focus-out dismissal is the controversial half: it is only installed when the descriptor asks for
   * it, so a disclosure that must survive a screen-reader user's detour can say so.
   * @param {FocusEvent} event
   * @returns {void}
   */
  function onFocusOut(event) {
    const next = event.relatedTarget;
    if (
      next &&
      (isInside(/** @type {Event} */ (event)) || element?.contains(/** @type {Node} */ (next)))
    ) {
      return;
    }
    disclosure.hide();
  }

  const listeningToPointer = Boolean(descriptor.lightDismiss);
  const listeningToFocus = Boolean(descriptor.dismissOnFocusOut);
  if (listeningToPointer) document.addEventListener('pointerdown', onPointerDown, true);
  if (listeningToFocus) document.addEventListener('focusout', onFocusOut, true);

  return {
    release: () => {
      if (listeningToPointer) document.removeEventListener('pointerdown', onPointerDown, true);
      if (listeningToFocus) document.removeEventListener('focusout', onFocusOut, true);
    },
  };
}
