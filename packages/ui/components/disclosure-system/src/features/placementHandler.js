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

// TODO: split up local and global?

/**
 * @returns {Promise<PopperModule>}
 */
async function preloadPopper() {
  // @ts-expect-error [external]: import complains about untyped module, but we typecast it ourselves
  return /** @type {* & Promise<PopperModule>} */ (import('@popperjs/core/dist/esm/popper.js'));
}

/** @type {Promise<PopperModule> | undefined} */
let popperModulePromise;

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function placementHandler({ controller }) {
  const placementClass = `overlays__overlay-container--${controller.viewportConfig.placement}`;

  /** @type {() => void} */
  let cleanupContentDomStructure;
  // N.B. for now, we store this on the controller for backward compatibility...
  /** @type {Popper} */
  controller._popper = undefined;

  /** @type {ShadowRoot} */
  let rootNode;

  /** @private */
  async function createPopperInstance() {
    if (controller._popper) {
      controller._popper.destroy();
      controller._popper = undefined;
    }

    if (popperModulePromise !== undefined) {
      const { createPopper } = await popperModulePromise;
      controller._popper = createPopper(controller._referenceNode, controller.contentWrapperNode, {
        ...controller.config?.popperConfig,
      });
    }
  }

  return {
    init: () => {
      cleanupContentDomStructure = initContentDomStructure({ controller });
      rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle, { teardown: true });
    },
    show: async () => {
      if (controller.placementMode === 'global') {
        // TODO: move to init?
        // TODO2: use data attributes for functional styling
        controller.contentWrapperNode.classList.add('overlays__overlay-container');
        controller.contentWrapperNode.classList.add(placementClass);
        controller.contentNode.classList.add('overlays__overlay');
      } else if (controller.config.placementMode === 'local') {
        // Lazily load Popper as soon as the first local overlay is used...
        // TODO: (provide option to) move to init?
        if (!popperModulePromise) {
          popperModulePromise = preloadPopper();
        }

        /**
         * Popper is weird about properly positioning the popper element when it is recreated so
         * we just recreate the popper instance to make it behave like it should.
         * Probably related to this issue: https://github.com/FezVrasta/popper.js/issues/796
         * calling just the .update() function on the popper instance sadly does not resolve this.
         * This is however necessary for initial placement.
         */
        await createPopperInstance();
        controller._popper.forceUpdate();
      }
    },
    hide: () => {
      if (controller.config.placementMode !== 'global') return;
      controller.contentWrapperNode.classList.remove('overlays__overlay-container');
      controller.contentWrapperNode.classList.remove(placementClass);
      controller.contentNode.classList.remove('overlays__overlay');
    },
    teardown: () => {
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle, { teardown: true });

      const shouldWeCleanupCustomStyles = controller.contentWrapperNode !== controller.contentNode;
      if (!shouldWeCleanupCustomStyles) return;

      cleanupContentDomStructure?.();
      controller.contentWrapperNode.removeAttribute('style');
      controller.contentWrapperNode.removeAttribute('class');
    },
  };
}
