import { expect } from '@open-wc/testing';

// TODO: create OverlayController
import { LocalOverlayController as OverlayController } from '../src/LocalOverlayController.js';
import { DropdownConfig } from '../src/DropdownConfig.js';

describe('DropdownConfig', () => {
  it('is an object', () => {
    expect(DropdownConfig).to.be.a('object');
  });

  it('has correct defaults', () => {
    const controller = new OverlayController({ ...DropdownConfig });
    // expect(controller.isGlobal).to.equal(false);
    expect(controller.hidesOnOutsideClick).to.equal(true);
    expect(controller.hidesOnEsc).to.equal(true);
    expect(controller.inheritsReferenceObjectWidth).to.equal(true);
    expect(controller.popperConfig.placement).to.equal('bottom-start');
    expect(controller.popperConfig.modifiers.flip.behavior).to.deep.equal([
      'bottom-start',
      'top-start',
    ]);
    expect(controller.popperConfig.modifiers.offset.enabled).to.equal(false);
  });

  it('has the same contentNode minWidth as the invokerNode width by default', () => {
    const controller = new OverlayController({ ...DropdownConfig });
    expect(controller.contentNode.style.minWidth).to.equal(controller.invokerNode.style.width);
  });

  it('can set the contentNode maxWidth as the invokerNode width', () => {
    const controller = new OverlayController({
      ...DropdownConfig,
      inheritsReferenceObjectWidth: 'max',
    });
    expect(controller.contentNode.style.maxWidth).to.equal(controller.invokerNode.style.width);
  });

  it('can set the contentNode width as the invokerNode width', () => {
    const controller = new OverlayController({
      ...DropdownConfig,
      inheritsReferenceObjectWidth: 'full',
    });
    expect(controller.contentNode.style.width).to.equal(controller.invokerNode.style.width);
  });
});
