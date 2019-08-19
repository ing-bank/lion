export const withDropdownConfig = () => ({
  inheritsReferenceObjectWidth: true,
  hidesOnOutsideClick: true,
  popperConfig: {
    placement: 'bottom-start',
    modifiers: {
      offset: {
        enabled: false,
      },
    },
  },
});