import { deepContains } from '../utils/deep-contains.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayPhase} OverlayPhase
 * @typedef {import('@lion/ui/overlays.js').DisclosureControllerLean} DisclosureControllerLean
 * @typedef {import('@lion/ui/overlays.js').OverlaysManager} OverlaysManager
 */

/**
 * @param {{ config: OverlayConfig, controller: DisclosureControllerLean; }} visibilityToggleContext
 */
export function syncChildrenCloseStateHandler({ controller }) {
  return {
    init: () => {
      const shownList =
        controller.manager?.shownList ||
        /** @type {typeof DisclosureControllerLean} */ (controller.constructor).list.filter(
          siblingCtrl => siblingCtrl.opened,
        );

      const visibleChildren = shownList.filter(
        siblingCtrl =>
          siblingCtrl !== controller &&
          deepContains(controller.contentNode, siblingCtrl.contentNode),
      );
      visibleChildren.forEach(siblingCtrl => siblingCtrl.hide());
    },
  };
}
