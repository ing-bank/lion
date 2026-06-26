import { overlayShadowDomStyle as overlayViewportStyle } from '../overlayShadowDomStyle.js';
import { _adoptStyleUtils } from '../utils/adopt-styles.js';
import { initContentDomStructure } from './shared/initContentDomStructure.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayPhase} OverlayPhase
 * @typedef {import('@lion/ui/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} Placement
 * @typedef {import('@popperjs/core').createPopper} Popper
 * @typedef {{ createPopper: Popper }} PopperModule
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function globalPlacementHandler({ controller }) {
  const placementClass = `overlays__overlay-container--${controller.viewportConfig.placement}`;

  /** @type {() => void} */
  let cleanupContentDomStructure;

  /** @type {ShadowRoot} */
  let rootNode;

  return {
    init: () => {
      cleanupContentDomStructure = initContentDomStructure({ controller });
      rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle, { teardown: false });
    },
    show: async () => {
      // TODO: move to init?
      // TODO2: use data attributes for functional styling
      controller.contentWrapperNode.classList.add('overlays__overlay-container');
      controller.contentWrapperNode.classList.add(placementClass);
      controller.contentNode.classList.add('overlays__overlay');
    },
    hide: () => {
      controller.contentWrapperNode.classList.remove('overlays__overlay-container');
      controller.contentWrapperNode.classList.remove(placementClass);
      controller.contentNode.classList.remove('overlays__overlay');
    },
    teardown: () => {
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle, { teardown: true });

      const shouldWeCleanupCustomStyles = controller.contentWrapperNode !== controller.contentNode;
      if (!shouldWeCleanupCustomStyles) return;

      cleanupContentDomStructure?.();
    },
  };
}
