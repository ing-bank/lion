import { withClickInteraction } from './visibility-trigger-partials/withClickInteraction.js';

/**
 * @typedef {import('../../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

export const withPopoverConfig = ({ horizontalFallback = true, placement = 'auto' } = {}) =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    inheritsReferenceWidth: 'min',
    hidesOnOutsideClick: true,
    hidesOnEsc: true,
    popperConfig: {
      placement,
      modifiers: [
        {
          name: 'offset',
          enabled: false,
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: horizontalFallback
              ? ['bottom', 'top', 'right', 'left']
              : ['bottom', 'top'],
          },
        },
      ],
    },
    handlesAccessibility: true,
    ...withClickInteraction(),
  });
