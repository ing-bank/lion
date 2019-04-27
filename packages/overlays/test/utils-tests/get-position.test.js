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
    placement: 'bottom right',
  };

  it('positions bottom right', () => {
    const position = getPosition(pc, config);

    expect(position).to.eql({
      maxHeight: 92,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
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
      maxHeight: 82,
      width: 50,
      top: 32,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'right',
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
      maxHeight: 92,
      width: 50,
      top: 108,
      left: 150,
      verticalDir: 'bottom',
      horizontalDir: 'left',
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
      placement: 'top right',
    });

    expect(position).to.eql({
      maxHeight: 72,
      width: 50,
      top: 22,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'right',
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
      maxHeight: 72,
      width: 50,
      top: 32,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'centerHorizontal',
    });

    const positionBottom = getPosition(pc, {
      placement: 'bottom',
      position: 'absolute',
    });

    expect(positionBottom).to.eql({
      maxHeight: 92,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'centerHorizontal',
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
      placement: 'top center',
      position: 'fixed',
    });

    expect(positionTop).to.eql({
      maxHeight: 72,
      width: 50,
      top: 22,
      left: 50,
      verticalDir: 'top',
      horizontalDir: 'centerHorizontal',
    });

    const positionBottom = getPosition(pc, {
      placement: 'bottom center',
      position: 'fixed',
    });

    expect(positionBottom).to.eql({
      maxHeight: 92,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'centerHorizontal',
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
      maxHeight: 57,
      width: 50,
      top: 90,
      left: 58,
      verticalDir: 'centerVertical',
      horizontalDir: 'right',
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
      maxHeight: 57,
      width: 50,
      top: 90,
      left: 42,
      verticalDir: 'centerVertical',
      horizontalDir: 'left',
    });
  });

  it('handles vertical margins', () => {
    const position = getPosition({ ...pc, verticalMargin: 50 }, config);

    expect(position).to.eql({
      maxHeight: 92,
      width: 50,
      top: 150,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
    });
  });

  it('handles large viewport margin', () => {
    const position = getPosition({ ...pc, viewportMargin: 50 }, config);

    expect(position).to.eql({
      maxHeight: 50,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
    });
  });

  it('handles no viewport margin', () => {
    const position = getPosition({ ...pc, viewportMargin: 0 }, config);

    expect(position).to.eql({
      maxHeight: 100,
      width: 50,
      top: 108,
      left: 50,
      verticalDir: 'bottom',
      horizontalDir: 'right',
    });
  });
});

describe('getPlacement()', () => {
  it('can overwrite horizontal and vertical placement', () => {
    const placement = getPlacement('top left');
    expect(placement.vertical).to.equal('top');
    expect(placement.horizontal).to.equal('left');
  });

  it('can use center placements both vertically and horizontally', () => {
    const placementVertical = getPlacement('center left');
    expect(placementVertical.vertical).to.equal('centerVertical');
    expect(placementVertical.horizontal).to.equal('left');
    const placementHorizontal = getPlacement('top center');
    expect(placementHorizontal.horizontal).to.equal('centerHorizontal');
    expect(placementHorizontal.vertical).to.equal('top');
  });

  it('accepts a single parameter, uses center for the other', () => {
    let placement = getPlacement('top');
    expect(placement.vertical).to.equal('top');
    expect(placement.horizontal).to.equal('centerHorizontal');

    placement = getPlacement('right');
    expect(placement.vertical).to.equal('centerVertical');
    expect(placement.horizontal).to.equal('right');
  });
});
