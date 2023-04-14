import { withClickInteraction } from './visibility-trigger-partials/withClickInteraction.js';

/**
 * @typedef {import('../../types/OverlayConfig.js').OverlayConfig} OverlayConfig
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
    ...withClickInteraction(),
  });
