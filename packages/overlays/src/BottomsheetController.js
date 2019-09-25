import { GlobalOverlayController } from './GlobalOverlayController.js';

export class BottomsheetController extends GlobalOverlayController {
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
}
