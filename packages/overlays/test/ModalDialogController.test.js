/* eslint-env mocha */

import { expect } from '@open-wc/testing';

import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { ModalDialogController } from '../src/ModalDialogController.js';

describe('ModalDialogController', () => {
  it('extends GlobalOverlayController', () => {
    expect(new ModalDialogController()).to.be.instanceof(GlobalOverlayController);
  });

  it('has correct defaults', () => {
    const controller = new ModalDialogController();
    expect(controller.hasBackdrop).to.equal(true);
    expect(controller.isBlocking).to.equal(false);
    expect(controller.preventsScroll).to.equal(true);
    expect(controller.trapsKeyboardFocus).to.equal(true);
    expect(controller.hidesOnEsc).to.equal(true);
  });
});
