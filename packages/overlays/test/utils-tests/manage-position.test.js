import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { managePosition } from '../../src/utils/manage-position.js';

describe('managePosition()', () => {
  let positionedBoundingRectCalls = 0;
  let relativeBoundingRectCalls = 0;
  let positionHandler;

  const windowMock = {
    innerHeight: 200,
    innerWidth: 200,
  };
  const positioned = {
    setAttribute: sinon.stub(),
    removeAttribute: sinon.stub(),
    style: {
      removeProperty: sinon.stub(),
    },
    getBoundingClientRect() {
      positionedBoundingRectCalls += 1;
      return {
        height: 50,
        width: 50,
      };
    },
  };

  const relative = {
    setAttribute: sinon.stub(),
    removeAttribute: sinon.stub(),
    style: {
      removeProperty: sinon.stub(),
    },
    getBoundingClientRect() {
      relativeBoundingRectCalls += 1;
      return {
        height: 50,
        width: 50,
        top: 50,
        right: 100,
        bottom: 100,
        left: 50,
      };
    },
    offsetTop: 50,
    offsetLeft: 50,
    offsetHeight: 50,
    offsetWidth: 50,
  };

  beforeEach(() => {
    relativeBoundingRectCalls = 0;
    positionedBoundingRectCalls = 0;
    positionHandler = managePosition(positioned, relative, {}, windowMock);
  });

  afterEach(() => {
    positionHandler.disconnect();
  });

  it('sets the right styles', () => {
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);
    expect(positioned.style).to.eql({
      removeProperty: positioned.style.removeProperty,
      position: 'absolute',
      zIndex: '10',
      overflow: 'auto',
      boxSizing: 'border-box',
      top: '16px',
      left: '50px',
      maxHeight: '26px',
      width: '50px',
    });

    expect(relative.style).to.eql({
      boxSizing: 'border-box',
      removeProperty: relative.style.removeProperty,
    });
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);
  });

  it('recalculates on resize, only once per animation frame', done => {
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);
    window.dispatchEvent(new CustomEvent('resize'));
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);

    requestAnimationFrame(() => {
      expect(relativeBoundingRectCalls).to.equal(2);
      expect(positionedBoundingRectCalls).to.equal(2);
      window.dispatchEvent(new CustomEvent('resize'));
      expect(relativeBoundingRectCalls).to.equal(2);
      expect(positionedBoundingRectCalls).to.equal(2);
      window.dispatchEvent(new CustomEvent('resize'));
      expect(relativeBoundingRectCalls).to.equal(2);
      expect(positionedBoundingRectCalls).to.equal(2);
      done();
    });
  });

  it('does not recalculate after disconnect', () => {
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);
    positionHandler.disconnect();
    window.dispatchEvent(new CustomEvent('resize'));
    expect(relativeBoundingRectCalls).to.equal(1);
    expect(positionedBoundingRectCalls).to.equal(1);
  });
});
