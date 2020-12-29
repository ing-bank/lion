/**
 * @typedef {import('../../../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../../OverlayController').OverlayController} OverlayController
 */

/**
 * Use for popovers/dropdowns, (modal) dialogs etc...
 * @returns {Partial<OverlayConfig>}
 */
export function withClickInteraction() {
  return {
    handlesUserInteraction: (/** @type {{ controller: OverlayController }} */ { controller }) => {
      function handleOpenClosed() {
        if (controller._hasDisabledInvoker()) {
          return;
        }
        controller.toggle();
      }

      return {
        init: () => {
          controller.invokerNode?.addEventListener('click', handleOpenClosed);
        },
        teardown: () => {
          controller.invokerNode?.removeEventListener('click', handleOpenClosed);
        },
      };
    },
  };
}
