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
