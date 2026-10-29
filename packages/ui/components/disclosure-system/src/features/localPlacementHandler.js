/* eslint-disable no-param-reassign -- the feature handlers configure the controller they are given;
   writing its private dom/bookkeeping fields is part of that contract */

import { initContentDomStructure } from './shared/initContentDomStructure.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayPhase} OverlayPhase
 * @typedef {import('@lion/ui/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} Placement
 * @typedef {typeof import('@popperjs/core').createPopper} Popper
 * @typedef {{ createPopper: Popper }} PopperModule
 */

/**
 * Lazily load Popper. Kept exported so the controller can expose it as a static
 * (`await OverlayController.popperModule`) for consumers that need to know when positioning is ready.
 * @returns {Promise<PopperModule>}
 */
export async function preloadPopper() {
  // @ts-expect-error [external]: import complains about untyped module, but we typecast it ourselves
  return /** @type {* & Promise<PopperModule>} */ (import('@popperjs/core/dist/esm/popper.js'));
}

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

  /**
   * The controller class owns the (shared) popper module promise: popper is loaded once per app.
   * @returns {Promise<PopperModule> | undefined}
   */
  function getPopperModule() {
    // @ts-ignore [static-through-instance]: the constructor exposes the shared static
    return controller.constructor.popperModule;
  }

  /** @private */
  async function createPopperInstance() {
    // @ts-ignore
    if (controller._popper) {
      // @ts-ignore
      controller._popper.destroy();
      // @ts-ignore
      controller._popper = undefined;
    }

    const popperModule = getPopperModule();
    if (popperModule !== undefined) {
      const { createPopper } = await popperModule;
      // @ts-ignore
      controller._popper = createPopper(controller._referenceNode, controller.contentWrapperNode, {
        ...controller.config?.popperConfig,
      });
    }
  }

  return {
    init: () => {
      cleanupContentDomStructure = initContentDomStructure({ controller });
      // N.B. the controller preloads popper (and exposes it as its static `popperModule`) when a
      // local overlay is configured, so there is nothing to load here.
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
