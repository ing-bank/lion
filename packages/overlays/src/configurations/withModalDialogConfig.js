/**
 * @typedef {import('../../types/OverlayConfig').OverlayConfig} OverlayConfig
 */

export const withModalDialogConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'global',
    viewportConfig: {
      placement: 'center',
    },
    hasBackdrop: true,
    preventsScroll: true,
    trapsKeyboardFocus: true,
    hidesOnEsc: true,
    handlesAccessibility: true,
  });
