/* eslint-disable no-param-reassign -- the feature handlers configure the controller they are given;
   writing its private dom/bookkeeping fields is part of that contract */

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function anchorWidthHandler({ controller }) {
  const referenceNode = controller._referenceNode;
  if (!referenceNode || controller.config.placementMode !== 'local') {
    return undefined;
  }

  return {
    init: () => {
      const referenceWidth = `${referenceNode.getBoundingClientRect().width}px`;
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
