import { withClickInteraction } from './visibility-trigger-partials/withClickInteraction.js';

/**
 * @typedef {import('../../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

export const withDropdownConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    inheritsReferenceWidth: 'min',
    hidesOnOutsideClick: true,
    hidesOnEsc: true,
    popperConfig: {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          enabled: false,
        },
      ],
    },
    handlesAccessibility: true,
    ...withClickInteraction(),
  });
