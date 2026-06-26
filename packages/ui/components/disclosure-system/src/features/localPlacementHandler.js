import { initContentDomStructure } from './shared/initContentDomStructure.js';
import { _adoptStyleUtils } from '../utils/adopt-styles.js';

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
export function localPlacementHandler({ controller }) {
  /** @type {() => void} */
  let cleanupContentDomStructure;
  // N.B. for now, we store this on the controller for backward compatibility...
  /** @type {Popper} */
  // @ts-ignore
  controller._popper = undefined;

  /** @private */
  async function createPopperInstance() {
    // @ts-ignore
    if (controller._popper) {
      // @ts-ignore
      controller._popper.destroy();
      // @ts-ignore
      controller._popper = undefined;
    }

    if (popperModulePromise !== undefined) {
      const { createPopper } = await popperModulePromise;
      // @ts-ignore
      controller._popper = createPopper(controller._referenceNode, controller.contentWrapperNode, {
        ...controller.config?.popperConfig,
      });
    }
  }

  return {
    init: () => {
      cleanupContentDomStructure = initContentDomStructure({ controller });
      // Lazily load Popper as soon as the first local overlay is used...
      if (!popperModulePromise) {
        popperModulePromise = preloadPopper();
      }
    },
    show: async () => {
      /**
       * Popper is weird about properly positioning the popper element when it is recreated so
       * we just recreate the popper instance to make it behave like it should.
       * Probably related to this issue: https://github.com/FezVrasta/popper.js/issues/796
       * calling just the .update() function on the popper instance sadly does not resolve this.
       * This is however necessary for initial placement.
       */
      await createPopperInstance();
      // @ts-ignore
      controller._popper.forceUpdate();
    },
    teardown: () => {
      const shouldWeCleanupCustomStyles = controller.contentWrapperNode !== controller.contentNode;
      if (!shouldWeCleanupCustomStyles) return;

      cleanupContentDomStructure?.();
    },
  };
}
