/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function anchorWidthHandler({ controller }) {
  if (!controller._referenceNode || controller.config.placementMode !== 'local') {
    return;
  }

  return {
    init: () => {
      const referenceWidth = `${controller._referenceNode.getBoundingClientRect().width}px`;
      switch (controller.config.inheritsReferenceWidth) {
        case 'max':
          controller.contentWrapperNode.style.maxWidth = referenceWidth;
          break;
        case 'full':
          controller.contentWrapperNode.style.width = referenceWidth;
          break;
        case 'min':
          controller.contentWrapperNode.style.minWidth = referenceWidth;
          controller.contentWrapperNode.style.width = 'auto';
          break;
        /* no default */
      }
    },
  };
}
