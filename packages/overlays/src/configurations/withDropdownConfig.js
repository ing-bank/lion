export const withDropdownConfig = () => ({
  placementMode: 'local',

  inheritsReferenceWidth: 'full',
  hidesOnOutsideClick: true,
  popperConfig: {
    placement: 'bottom-start',
    modifiers: {
      offset: {
        enabled: false,
      },
    },
  },
  handlesAccessibility: true,
});
