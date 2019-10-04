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
});

export const withModalDialogConfig = () => ({
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,

  placementMode: 'global',
  viewportConfig: {
    placement: 'center',
  },
});

export const withDropdownConfig = () => ({
  inheritsInvokerWidth: true,
  hidesOnOutsideClick: true,

  placementMode: 'local',
  popperConfig: {
    placement: 'bottom-start',
    modifiers: {
      offset: {
        enabled: false,
      },
    },
  },
});
