import { expect } from '@open-wc/testing';
// import { OverlayController } from '../index.js';
// import { withDropdownConfig } from '../src/DropdownConfig.js';

const OverlayController = null; // wrapper around Global and LocalOverlayController

const withDropdownConfig = () => ({
  isGlobal: false,
  placement: 'bottom',
  handlesUserInteraction: true,
  handlesAccessibility: true,
  placementConfig: {
    horizontalMargin: 0,
    verticalMargin: 0,
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
    expect(controller.handlesUserInteraction).to.equal(true);
    expect(controller.handlesAccessibility).to.equal(true);
    expect(controller.placementConfig.horizontalMargin).to.equal(0);
    expect(controller.placementConfig.verticalMargin).to.equal(0);
  });
});
