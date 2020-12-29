import { withHoverInteraction } from './partials/withHoverInteraction.js';

/**
 * @typedef {import('../../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../OverlayController').OverlayController} OverlayController
 */

/**
 *
 * @param {{invokerRelation?: 'description'| 'label', delayIn?: number, delayOut?: number  }} options
 */
export const withTooltipConfig = ({
  invokerRelation = 'description',
  delayIn = 300,
  delayOut = 300,
} = {}) =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    elementToFocusAfterHide: undefined,
    hidesOnEsc: true,
    hidesOnOutsideEsc: true,
    handlesAccessibility: true,
    isTooltip: true,
    invokerRelation,
    ...withHoverInteraction({ delayIn, delayOut }),
  });
