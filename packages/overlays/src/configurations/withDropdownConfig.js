export const withDropdownConfig = () => ({
  placementMode: 'local',

  inheritsReferenceWidth: true,
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
