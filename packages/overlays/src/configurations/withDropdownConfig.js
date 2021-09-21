/**
 * @typedef {import('../../types/OverlayConfig').OverlayConfig} OverlayConfig
 */

export const withDropdownConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    inheritsReferenceWidth: 'min',
    hidesOnOutsideClick: true,
    hidesOnOutsideEsc: true,
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
  });
