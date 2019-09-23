import { GlobalOverlayController } from './GlobalOverlayController.js';

export class ModalDialogController extends GlobalOverlayController {
  constructor(params) {
    super({
      hasBackdrop: true,
      preventsScroll: true,
      trapsKeyboardFocus: true,
      hidesOnEsc: true,
      viewportConfig: {
        placement: 'center',
      },
      ...params,
    });
  }
}
