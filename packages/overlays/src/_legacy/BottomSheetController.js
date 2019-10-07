import { GlobalOverlayController } from './GlobalOverlayController.js';

export class BottomSheetController extends GlobalOverlayController {
  constructor(params) {
    super({
      hasBackdrop: true,
      preventsScroll: true,
      trapsKeyboardFocus: true,
      hidesOnEsc: true,
      viewportConfig: {
        placement: 'bottom',
      },
      ...params,
    });
  }

  onContentUpdated() {
    super.onContentUpdated();
    this.contentNode.classList.add('global-overlays__overlay--bottom-sheet');
  }
}
