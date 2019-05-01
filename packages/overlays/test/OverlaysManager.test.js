import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { OverlaysManager } from '../src/OverlaysManager.js';

function createGlobalOverlayControllerMock() {
  return {
    sync: sinon.spy(),
    update: sinon.spy(),
    show: sinon.spy(),
    hide: sinon.spy(),
  };
}

describe('OverlaysManager', () => {
  it('returns the newly added overlay', () => {
    const myOverlays = new OverlaysManager();
    const myController = createGlobalOverlayControllerMock();
    expect(myOverlays.add(myController)).to.equal(myController);
  });
});
