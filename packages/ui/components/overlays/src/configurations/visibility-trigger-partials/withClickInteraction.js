/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * Use for popovers/dropdowns, (modal) dialogs etc...
 * @returns {Partial<OverlayConfig>}
 */
export function withClickInteraction() {
  return {
    visibilityTriggerFunction: (
      /** @type {{ controller: OverlayController }} */ { controller },
    ) => {
      function handleOpenClosed() {
        if (controller._hasDisabledInvoker()) {
          return;
        }
        controller.toggle();
      }

      return {
        init: () => {
          console.debug(
            'setting up click interaction for overlay',
            controller._contentId,
            controller.invokerNode,
          );
          controller.invokerNode?.addEventListener('click', handleOpenClosed);
        },
        teardown: () => {
          console.debug('tearing down click interaction for overlay', controller._contentId);
          controller.invokerNode?.removeEventListener('click', handleOpenClosed);
        },
      };
    },
  };
}
