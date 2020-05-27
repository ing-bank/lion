export const withDropdownConfig = () => ({
  placementMode: 'local',

  inheritsReferenceWidth: 'min',
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
