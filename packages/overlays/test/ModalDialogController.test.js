import { expect, html } from '@open-wc/testing';

import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { ModalDialogController } from '../src/ModalDialogController.js';

describe('ModalDialogController', () => {
  let defaultOptions;

  before(() => {
    defaultOptions = {
      contentTemplate: () => html`
        <p>my content</p>
      `,
    };
  });

  it('extends GlobalOverlayController', () => {
    expect(new ModalDialogController(defaultOptions)).to.be.instanceof(GlobalOverlayController);
  });

  it('has correct defaults', () => {
    const ctrl = new ModalDialogController(defaultOptions);
    expect(ctrl.hasBackdrop).to.be.true;
    expect(ctrl.isBlocking).to.be.false;
    expect(ctrl.preventsScroll).to.be.true;
    expect(ctrl.trapsKeyboardFocus).to.be.true;
    expect(ctrl.hidesOnEsc).to.be.true;
  });
});
