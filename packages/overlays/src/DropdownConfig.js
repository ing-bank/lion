export const DropdownConfig = {
  isGlobal: false,
  hidesOnOutsideClick: true,
  hidesOnEsc: true,
  inheritsReferenceObjectWidth: true,
  popperConfig: {
    placement: 'bottom-start',
    modifiers: {
      flip: {
        behavior: ['bottom-start', 'top-start'],
      },
      offset: {
        enabled: false,
      },
    },
  },
};
