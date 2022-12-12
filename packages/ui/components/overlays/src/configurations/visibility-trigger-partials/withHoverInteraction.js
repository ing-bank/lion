/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

// N.B. Below logic is tested in LionTooltip

/**
 * Use for tooltips and [flyout menus](https://www.w3.org/WAI/tutorials/menus/flyout/).
 * Note that it handles both mouse hover and focus interaction.
 * Provide delayIn and delayOut when the content needs a small delay before being showed
 * @param {{ delayIn?: number, delayOut?: number  }} options
 * @returns {Partial<OverlayConfig>}
 */
export function withHoverInteraction({ delayIn = 0, delayOut = 300 }) {
  return {
    visibilityTriggerFunction: (
      /** @type {{ controller: OverlayController }} */ { controller },
    ) => {
      let isFocused = false;
      let isHovered = false;
      /** @type {NodeJS.Timeout} */
      let delayTimeout;

      function resetActive() {
        isFocused = false;
        isHovered = false;
      }

      /**
       * @param {Event} event
       */
      function handleOpenClosed(event) {
        const { type } = event;
        if (controller._hasDisabledInvoker()) {
          return;
        }
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
          controller.contentNode?.removeEventListener('mouseenter', handleOpenClosed);
          controller.contentNode?.removeEventListener('mouseleave', handleOpenClosed);
          controller.invokerNode?.removeEventListener('mouseenter', handleOpenClosed);
          controller.invokerNode?.removeEventListener('mouseleave', handleOpenClosed);
          controller.invokerNode?.removeEventListener('focusin', handleOpenClosed);
          controller.invokerNode?.removeEventListener('focusout', handleOpenClosed);
        },
      };
    },
  };
}
