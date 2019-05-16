import { expect } from '@open-wc/testing';

import { getPosition, getPlacement } from '../../src/utils/get-position.js';

// Test cases:
// offset top, absolute in absolute

/* positionContext (pc) gets overridden in some tests to make or restrict space for the test */

describe('getPosition()', () => {
  const pc = {
    relEl: {
      offsetTop: 50,
      offsetLeft: 50,
      offsetWidth: 0,
      offsetHeight: 0,
    },
    elRect: {
      height: 50,
      width: 50,
      top: -1,
      right: -1,
      bottom: -1,
      left: -1,
    },
    relRect: {
      height: 50,
      width: 50,
      top: 50,
      right: 100,
      bottom: 100,
      left: 50,
    },
    viewportMargin: 8,
    verticalMargin: 8,
    horizontalMargin: 8,
    viewport: { clientHeight: 200, clientWidth: 200 },
  };
  const config = {
    placement: 'right-of-bottom',
  };

  it('positions bottom right', () => {
    const position = getPosition(pc, config);

    expect(position).to.eql({
      maxHeight: 84,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'right-of-bottom',
    });
  });

  it('positions top right if not enough space', () => {
    const position = getPosition(
      {
        ...pc,
        relEl: { offsetTop: 90, offsetLeft: 50 },
        relRect: {
          height: 50,
          width: 50,
          top: 90,
          right: 100,
          bottom: 150,
          left: 50,
        },
      },
      config,
    );

    expect(position).to.eql({
      maxHeight: 74,
      width: 50,
      top: 32,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'right',
      position: 'right-of-top',
    });
  });

  it('positions bottom left if not enough space', () => {
    const position = getPosition(
      {
        ...pc,
        relEl: { offsetTop: 50, offsetLeft: 150 },
        relRect: {
          height: 50,
          width: 50,
          top: 50,
          right: 200,
          bottom: 100,
          left: 150,
        },
      },
      config,
    );
    expect(position).to.eql({
      maxHeight: 84,
      width: 50,
      top: 108,
      left: 150,
      verticalDir: 'bottom',
      horizontalDir: 'left',
      position: 'left-of-bottom',
    });
  });

  it('takes the preferred direction if enough space', () => {
    const testPc = {
      ...pc,
      relEl: { offsetTop: 90, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 80,
        right: 100,
        bottom: 130,
        left: 50,
      },
    };

    const position = getPosition(testPc, {
      placement: 'right-of-top',
    });

    expect(position).to.eql({
      maxHeight: 64,
      width: 50,
      top: 22,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'right',
      position: 'right-of-top',
    });
  });

  it('distinguishes between primary and secondary in the position argument', () => {
    const testPc = {
      ...pc,
      relEl: { offsetTop: 50, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 50,
        right: 100,
        bottom: 100,
        left: 50,
      },
    };

    let position = getPosition(testPc, {
      placement: 'right-of-bottom',
      position: 'absolute',
    });
    expect(position).to.eql({
      maxHeight: 84,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'right-of-bottom',
    });

    position = getPosition(testPc, {
      placement: 'bottom-of-right',
      position: 'absolute',
    });
    expect(position).to.eql({
      maxHeight: 142,
      width: 50,
      top: 50,
      left: 58,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'bottom-of-right',
    });
  });

  it('handles horizontal center positions with absolute position', () => {
    const testPc = {
      ...pc,
      relEl: { offsetTop: 90, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 80,
        right: 100,
        bottom: 130,
        left: 50,
      },
    };

    const positionTop = getPosition(testPc, {
      placement: 'top',
      position: 'absolute',
    });
    expect(positionTop).to.eql({
      maxHeight: 64,
      width: 50,
      top: 32,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'center',
      position: 'center-of-top',
    });

    const positionBottom = getPosition(pc, {
      placement: 'bottom',
      position: 'absolute',
    });

    expect(positionBottom).to.eql({
      maxHeight: 84,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'center',
      position: 'center-of-bottom',
    });
  });

  it('handles horizontal center positions with fixed position', () => {
    const testPc = {
      ...pc,
      relEl: { offsetTop: 90, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 80,
        right: 100,
        bottom: 130,
        left: 50,
      },
    };

    const positionTop = getPosition(testPc, {
      placement: 'center-of-top',
      position: 'fixed',
    });

    expect(positionTop).to.eql({
      maxHeight: 64,
      width: 50,
      top: 22,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'center',
      position: 'center-of-top',
    });

    const positionBottom = getPosition(pc, {
      placement: 'center-of-bottom',
      position: 'fixed',
    });

    expect(positionBottom).to.eql({
      maxHeight: 84,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'center',
      position: 'center-of-bottom',
    });
  });

  it('handles vertical center positions', () => {
    let testPc = {
      ...pc,
      relEl: { offsetTop: 90, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 90,
        right: 100,
        bottom: 100,
        left: 50,
      },
    };

    const positionRight = getPosition(testPc, {
      placement: 'right',
      position: 'absolute',
    });
    expect(positionRight).to.eql({
      maxHeight: 134,
      width: 50,
      top: 90,
      left: 58,
      verticalDir: 'center',
      horizontalDir: 'right',
      position: 'center-of-right',
    });

    testPc = {
      ...pc,
      relEl: { offsetTop: 90, offsetLeft: 50 },
      relRect: {
        height: 50,
        width: 50,
        top: 90,
        right: 100,
        bottom: 100,
        left: 100,
      },
    };

    const positionLeft = getPosition(testPc, {
      placement: 'left',
    });
    expect(positionLeft).to.eql({
      maxHeight: 134,
      width: 50,
      top: 90,
      left: 42,
      verticalDir: 'center',
      horizontalDir: 'left',
      position: 'center-of-left',
    });
  });

  it('handles vertical margins', () => {
    const position = getPosition({ ...pc, verticalMargin: 50 }, config);

    expect(position).to.eql({
      maxHeight: 42,
      width: 50,
      top: 150,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'right-of-bottom',
    });
  });

  it('handles large viewport margin', () => {
    const position = getPosition({ ...pc, viewportMargin: 50 }, config);

    expect(position).to.eql({
      maxHeight: 42,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'right-of-bottom',
    });
  });

  it('handles no viewport margin', () => {
    const position = getPosition({ ...pc, viewportMargin: 0 }, config);

    expect(position).to.eql({
      maxHeight: 92,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
      position: 'right-of-bottom',
    });
  });
});

describe('getPlacement()', () => {
  it('can overwrite horizontal and vertical placement', () => {
    const placement = getPlacement('left-of-top');
    expect(placement.vertical).to.equal('top');
    expect(placement.horizontal).to.equal('left');
  });

  it('can use center placements both vertically and horizontally', () => {
    const placementVertical = getPlacement('center-of-left');
    expect(placementVertical.vertical).to.equal('center');
    expect(placementVertical.horizontal).to.equal('left');
    const placementHorizontal = getPlacement('center-of-top');
    expect(placementHorizontal.horizontal).to.equal('center');
    expect(placementHorizontal.vertical).to.equal('top');
  });

  it('accepts a single parameter, uses center for the other', () => {
    let placement = getPlacement('top');
    expect(placement.vertical).to.equal('top');
    expect(placement.horizontal).to.equal('center');

    placement = getPlacement('right');
    expect(placement.vertical).to.equal('center');
    expect(placement.horizontal).to.equal('right');
  });
});
