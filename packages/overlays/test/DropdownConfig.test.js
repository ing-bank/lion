import { expect } from '@open-wc/testing';
// import { OverlayController } from '../index.js';
// import { withDropdownConfig } from '../src/DropdownConfig.js';

const OverlayController = null; // wrapper around Global and LocalOverlayController

const withDropdownConfig = () => ({
  isGlobal: false,
  placement: 'bottom',
  hidesOnOutsideClick: true,
  hidesOnEsc: true,
  modifiers: {
    flip: {
      behavior: ['bottom', 'top'],
    },
    offset: {
      enabled: false,
    },
  },
});

// Integration tests for expected defaults
describe('withDropdownConfig', () => {
  it('is a function returning an object', () => {
    expect(typeof withDropdownConfig).to.be('function');
    expect(typeof withDropdownConfig()).to.be('object');
  });

  it('has correct defaults', () => {
    const controller = new OverlayController(withDropdownConfig());
    expect(controller.isGlobal).to.equal(false);
    expect(controller.placement).to.equal('bottom');
    expect(controller.hidesOnOutsideClick).to.equal(true);
    expect(controller.hidesOnEsc).to.equal(true);
    expect(controller.modifiers.flip.behavior).to.equal(['bottom', 'top']);
    expect(controller.modifiers.offset.enabled).to.equal(false);
  });

  it('has the same contentNode width as the invokerNode', () => {
    const controller = new OverlayController(withDropdownConfig());
    expect(controller.contentNode.style.width).to.equal(controller.invokerNode.style.width);
  });
});
