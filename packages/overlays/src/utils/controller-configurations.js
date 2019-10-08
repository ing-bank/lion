// Predefined configurations for OverlayController

export const withBottomSheetConfig = () => ({
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  placementMode: 'global',
  viewportConfig: {
    placement: 'bottom',
  },
  handlesAccessibility: true,
});

export const withModalDialogConfig = () => ({
  placementMode: 'global',
  viewportConfig: {
    placement: 'center',
  },

  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  handlesAccessibility: true,
});

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
