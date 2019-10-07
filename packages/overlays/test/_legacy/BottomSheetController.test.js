import { expect, html } from '@open-wc/testing';

import { GlobalOverlayController } from '../../src/_legacy/GlobalOverlayController.js';
import { BottomSheetController } from '../../src/_legacy/BottomSheetController.js';

describe('BottomSheetController', () => {
  let defaultOptions;

  before(() => {
    defaultOptions = {
      contentTemplate: () => html`
        <p>my content</p>
      `,
    };
  });

  it('extends GlobalOverlayController', () => {
    expect(new BottomSheetController(defaultOptions)).to.be.instanceof(GlobalOverlayController);
  });

  it('has correct defaults', () => {
    const controller = new BottomSheetController(defaultOptions);
    expect(controller.hasBackdrop).to.equal(true);
    expect(controller.isBlocking).to.equal(false);
    expect(controller.preventsScroll).to.equal(true);
    expect(controller.trapsKeyboardFocus).to.equal(true);
    expect(controller.hidesOnEsc).to.equal(true);
    expect(controller.overlayContainerPlacementClass).to.equal(
      'global-overlays__overlay-container--bottom',
    );
  });
});
