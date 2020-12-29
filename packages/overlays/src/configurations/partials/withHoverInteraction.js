/**
 * @typedef {import('../../../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../../OverlayController').OverlayController} OverlayController
 */

/**
 * Use for tooltips and [flyout menus](https://www.w3.org/WAI/tutorials/menus/flyout/).
 * Note that it handles both mouse hover and focus interaction.
 * Provide delayIn and delayOut when the content needs a small delay before being showed
 * @param {{ delayIn?: number, delayOut?: number  }} options
 * @returns {Partial<OverlayConfig>}
 */
export function withHoverInteraction({ delayIn = 0, delayOut = 300 }) {
  return {
    handlesUserInteraction: (/** @type {{ controller: OverlayController }} */ { controller }) => {
      let isFocused = false;
      let isHovered = false;
      // @ts-expect-error
      let delayTimeout;

      function resetActive() {
        isFocused = false;
        isHovered = false;
      }

      /**
       * @param {Event} event
       */
      function handleOpenClosed({ type, target, currentTarget }) {
        // Ignore all interactions triggered by disabled invokers
        const targetIsInvoker =
          target && controller.invokerNode?.contains(/** @type {Node} */ (target));
        if (targetIsInvoker && controller._hasDisabledInvoker()) {
          return;
        }
        // @ts-expect-error
        clearTimeout(delayTimeout);
        isFocused = type === 'focusout' ? false : isFocused || type === 'focusin';
        isHovered = type === 'mouseleave' ? false : isHovered || type === 'mouseenter';
        const shouldOpen = isFocused || isHovered;
        if (shouldOpen) {
          delayTimeout = setTimeout(() => {
            controller.show();
          }, delayIn);
        } else {
          delayTimeout = setTimeout(() => {
            controller.hide();
          }, delayOut);
        }
      }

      return {
        init: () => {
          controller.addEventListener('hide', resetActive);
          controller.contentNode?.addEventListener('mouseenter', handleOpenClosed);
          controller.contentNode?.addEventListener('mouseleave', handleOpenClosed);
          controller.invokerNode?.addEventListener('mouseenter', handleOpenClosed);
          controller.invokerNode?.addEventListener('mouseleave', handleOpenClosed);
          controller.invokerNode?.addEventListener('focusin', handleOpenClosed);
          controller.invokerNode?.addEventListener('focusout', handleOpenClosed);
        },
        teardown: () => {
          controller.removeEventListener('hide', resetActive);
          controller.invokerNode?.removeEventListener('mouseenter', handleOpenClosed);
          controller.invokerNode?.removeEventListener('mouseleave', handleOpenClosed);
          controller.contentNode?.removeEventListener('mouseenter', handleOpenClosed);
          controller.contentNode?.removeEventListener('mouseleave', handleOpenClosed);
          controller.invokerNode?.removeEventListener('focusin', handleOpenClosed);
          controller.invokerNode?.removeEventListener('focusout', handleOpenClosed);
        },
      };
    },
  };
}
