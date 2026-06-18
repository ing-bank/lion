/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{ content: HTMLElement; activeElementRightBeforeHide: Element|null; elementToFocusAfterHide: HTMLElement}} opts
 * @returns {void}
 */
function restoreFocus({ content, activeElementRightBeforeHide, elementToFocusAfterHide }) {
  // We only are allowed to move focus if we (still) 'own' the active element.
  // Otherwise, we assume the 'outside world' has purposefully taken over
  const hasActiveElementOwnership =
    activeElementRightBeforeHide instanceof HTMLElement &&
    content.contains(activeElementRightBeforeHide);

  if (!hasActiveElementOwnership) return;

  if (elementToFocusAfterHide instanceof HTMLElement) {
    elementToFocusAfterHide.focus();
    elementToFocusAfterHide.scrollIntoView({ block: 'nearest' });
  } else {
    /** @type {HTMLElement} */ (activeElementRightBeforeHide).blur();
  }
}

/**
 * @param {{ controller: OverlayController; content: HTMLElement }} visibilityToggleContext
 */
export function focusHandler({ controller, content }) {
  /** @type {Element | null} */
  let activeElementRightBeforeHide = null;
  return {
    'before-hide': () => {
      // Save the current activeElement so we know if the user set focus to another element than the invoker of the dialog
      // while the dialog was open.
      // We need this in the restoreFocus method to determine if we should focus elementToFocusAfterHide when the
      // dialog is closed or keep focus on the element that the user deliberately gave focus
      activeElementRightBeforeHide = /** @type {ShadowRoot} */ (content.getRootNode())
        .activeElement;
    },

    hide: () => {
      const elementToFocusAfterHide =
        // @ts-ignore
        controller.__elementToFocusAfterHide || controller.config.elementToFocusAfterHide;

      // @ts-ignore
      restoreFocus({ content, activeElementRightBeforeHide, elementToFocusAfterHide });
    },
  };
}
