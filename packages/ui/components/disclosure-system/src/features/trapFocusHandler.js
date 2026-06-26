/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

import { getFocusableElements } from '../utils/get-focusable-elements.js';

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function trapFocusHandler({ controller }) {
  let isShiftPressed = false;

  /**
   * @param {KeyboardEvent} event
   */
  function isShiftPressedOnKeyDownHandler(event) {
    if (event.key === 'Shift') {
      isShiftPressed = true;
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  function isShiftPressedOnKeyUpHandler(event) {
    if (event.key === 'Shift') {
      isShiftPressed = false;
    }
  }

  function handleShiftKeyPress() {
    window.addEventListener('keydown', isShiftPressedOnKeyDownHandler);
    window.addEventListener('keyup', isShiftPressedOnKeyUpHandler);
  }

  function stopHandlingShiftKeyPress() {
    window.removeEventListener('keydown', isShiftPressedOnKeyDownHandler);
    window.removeEventListener('keyup', isShiftPressedOnKeyUpHandler);
  }

  // TODO: make configurable?
  function getInitialElementToFocus() {
    const focusableElements = getFocusableElements(controller.contentNode);
    // Initial focus goes to first element with autofocus, or `contentNode`
    return focusableElements.find(e => e.hasAttribute('autofocus')) || controller.contentNode;
  }

  /**
   * When a `dialog` element gets focused, we focus programmatically something
   * else inside dialog for better a11y. A dialog element gets focused natively in these cases:
   * 1) When called by `showModal()` first time
   * 2) When focus is rotating. That is when a user navigates using Tab key through
   * all the dialog's focusable elements, then the focus goes to the browser's URL,
   * all its tabs and then the focus goes back to the dialog element
   * 3) Same as in the point #2, but when a user navigates backward by hitting `Shift + Tab`.
   * In this case we do not intercept and let the focus pass through. Otherwise the focus
   * will never leaves the dialog
   *
   * Note, Chrome does not focus `Dialog` element when Tabbing. When dialog is opened first time,
   * it focuses the contentNode if that has `tabindex` set. But the second time when we
   * move to the dialog from URL bar, nor the dialog element, nor the `contentNode` are focused.
   * Instead the first focusable element is focused right away
   */
  function handleFocusInsideDialog() {
    controller.__wrappingDialogNode?.addEventListener('focus', () => {
      if (!isShiftPressed) {
        getInitialElementToFocus().focus();
      }
    });
  }

  return {
    init: () => {
      controller.contentNode.style.outline = 'none';
      controller.contentNode.tabIndex = -1;

      // N.B. check if still relevant...
      const isContentShadowHost = Boolean(controller.contentNode.shadowRoot);
      if (isContentShadowHost) {
        // eslint-disable-next-line no-console
        console.warn(
          '[overlays]: For best accessibility (compatibility with Safari + VoiceOver), provide a contentNode that is not a host for a shadow root',
        );
      }
    },
    show: () => {
      handleShiftKeyPress();
      handleFocusInsideDialog();
      // @ts-ignore - HTMLDialogElement methods
      controller.__wrappingDialogNode?.close();
      // @ts-ignore - HTMLDialogElement methods
      controller.__wrappingDialogNode?.showModal();
      /**
       * At this moment `#handleFocusInsideDialog` should handle the focus.
       * But for some reason Firefox on the testing setup does not
       * focus the native `dialog` on showModal() and focuses the first
       * focusable element inside the dialog instead. Hence here we focus
       * contentNode explicitly
       */
      getInitialElementToFocus().focus();
    },
    hide: () => {
      stopHandlingShiftKeyPress();
    },
  };
}
