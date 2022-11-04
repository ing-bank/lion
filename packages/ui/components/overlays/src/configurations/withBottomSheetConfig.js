/**
 * @typedef {import('../../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

export const withBottomSheetConfig = () =>
  /** @type {OverlayConfig} */ ({
    hasBackdrop: true,
    preventsScroll: true,
    trapsKeyboardFocus: true,
    hidesOnEsc: true,
    placementMode: 'global',
    viewportConfig: {
      placement: 'bottom',
    },
    handlesAccessibility: true,
  });
