/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @deprecated use pseudo element instead
 * Sets up backdrop on the given overlay. If there was a backdrop on another element
 * it is removed. Otherwise this is the first time displaying a backdrop, so a animation-in
 * animation is played.
 * N.B. can be used in conjunction with placementMode: 'global' and placementMode: 'local'
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function backdropHandler({ controller }) {
  const backdropNode = controller.config?.backdropNode || document.createElement('div');
  // @ts-ignore
  controller.__backdropNode = backdropNode;

  return {
    init: () => {
      backdropNode.classList.add(`overlays__backdrop`);
      // @ts-ignore
      controller.__wrappingDialogNode.prepend(backdropNode);
    },
    show: () => {
      backdropNode.classList.add(`overlays__backdrop--visible`);
      backdropNode.classList.add(`overlays__backdrop--animation-in`);
    },
    hide: () => {
      backdropNode.classList.remove(`overlays__backdrop--visible`);
      backdropNode.classList.remove(`overlays__backdrop--animation-in`);
    },
    teardown: () => {
      backdropNode.classList.remove(`overlays__backdrop--visible`);
      backdropNode.classList.remove(`overlays__backdrop--animation-in`);
    },
  };
}
