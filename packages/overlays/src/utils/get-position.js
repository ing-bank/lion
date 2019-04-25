/**
 * @typedef {Object} Config Expand/collapse config
 * @property {number} [viewportMargin] space between positioned element and the viewport
 * @property {number} [verticalMargin] space between the positioned element and the element it's
 * positioned relatively to
 * @property {'top left' | 'top right' | 'bottom left' | 'bottom right'} [placement] Preferred
 * placement. Defaults to 'bottom right'
 * @property {'absolute' | 'fixed'} [position] position property. Defaults to absolute
 * @property {number} [minHeight] Minimum height the positioned element should take up
 * @property {number} [minWidth] Minimum width the positioned element should take up
 */

/**
 * @typedef {Object} Viewport the viewport, defaults to the document.documentElement but can be
 * overwritten for testing
 * @property {number} clientHeight height of the viewport
 * @property {number} clientWidth width of the viewport
 */

/**
 * @typedef {Object} RelativeElement stripped down property definition of relative element
 * @property {number} offsetLeft height of the viewport
 * @property {number} offsetTop width of the viewport
 */

/**
 * @typedef {Object} PositionContext
 * @property {RelativeElement} relEl the element being positioned relative to
 * @property {ClientRect} elRect positioned element ClientRect
 * @property {ClientRect} relRect relative element ClientRect
 * @property {number} viewportMargin margin between the positioned element and the viewport
 * @property {number} verticalMargin vertical margin between the
 * positioned element and the relative element
 * @property {number} horizontalMargin horizontal margin between the
 * positioned element and the relative element
 * @property {Viewport} viewport reference to the window, can be overwritten for tests
 */

/** Calculates position relative to the trigger element for a given direction. */
export const calcAbsolutePosition = {
  /**
   * Legend:
   *
   * offsetTop:  distance of top of element to the top of the parent relative/absolutely
   *             positioned context, if any. Otherwise the window.
   * offsetLeft: distance of left of element to the left of parent relative/absolutely
   *             positioned context, if any. Otherwise the window.
   *
   * positionedHeight / Width: the height/width of the positioned element, after taking all
   *                           the calculations and clipping into account
   */

  /**
   * @param {PositionContext} pc
   * @param {number} positionedHeight
   */
  top: (pc, positionedHeight) => pc.relEl.offsetTop - positionedHeight - pc.verticalMargin,

  /** @param {PositionContext} pc */
  bottom: pc => pc.relEl.offsetTop + pc.relRect.height + pc.verticalMargin,

  /**
   * @param {PositionContext} pc
   * @param {number} positionedWidth
   */
  left: (pc, positionedWidth, isCenteredVertically) => {
    if (isCenteredVertically) {
      return (
        pc.relEl.offsetLeft -
        (positionedWidth - pc.relRect.width) -
        (pc.relEl.offsetWidth || 0) -
        pc.horizontalMargin
      );
    }
    return pc.relEl.offsetLeft - (positionedWidth - pc.relRect.width);
  },

  /** @param {PositionContext} pc */
  right: (pc, positionedWidth, isCenteredVertically) => {
    if (isCenteredVertically) {
      return pc.relEl.offsetLeft + (pc.relEl.offsetWidth || 0) + pc.horizontalMargin;
    }
    return pc.relEl.offsetLeft;
  },

  /**
   * @param {PositionContext} pc
   * @param {number} positionedWidth
   */
  centerHorizontal: (pc, positionedWidth) =>
    pc.relEl.offsetLeft - (positionedWidth - pc.relRect.width) / 2,

  /**
   * @param {PositionContext} pc
   */
  centerVertical: (pc, positionedHeight) =>
    pc.relEl.offsetTop - (positionedHeight - pc.relRect.height) / 2,
};

/** Calculates position relative to the trigger element for a given direction. */
export const calcFixedPosition = {
  /**
   * Legend:
   *
   * top:  distance of top of element to the top of the document
   * top:  distance of top of element to the top of the document
   *
   * positionedHeight / Width: the height/width of the positioned element, after taking all
   *                           the calculations and clipping into account
   */

  /**
   * @param {PositionContext} pc
   * @param {number} positionedHeight
   */
  top: (pc, positionedHeight) => pc.relRect.top - positionedHeight - pc.verticalMargin,

  /** @param {PositionContext} pc */
  bottom: pc => pc.relRect.top + pc.relRect.height + pc.verticalMargin,

  /**
   * @param {PositionContext} pc
   * @param {number} positionedWidth
   */
  left: (pc, positionedWidth, isCenteredVertically) => {
    if (isCenteredVertically) {
      return pc.relRect.left - positionedWidth - pc.horizontalMargin;
    }
    return pc.relRect.left - (positionedWidth - pc.relRect.width);
  },

  /** @param {PositionContext} pc */
  right: (pc, positionedWidth, isCenteredVertically) => {
    if (isCenteredVertically) {
      return pc.relRect.left + pc.relRect.width + pc.horizontalMargin;
    }
    return pc.relRect.left;
  },

  /**
   * @param {PositionContext} pc
   * @param {number} positionedWidth
   */
  centerHorizontal: (pc, positionedWidth) =>
    pc.relRect.left - (positionedWidth - pc.relRect.width) / 2,

  /**
   * @param {PositionContext} pc
   * @param {number} positionedHeight
   */
  centerVertical: (pc, positionedHeight) =>
    pc.relRect.top - (positionedHeight - pc.relRect.height) / 2,
};

/**
 * Calculates the available space within the viewport around element we are positioning relatively
 * to for a given direction.
 */
export const getAvailableSpace = {
  /**
   * Legend:
   *
   * top:           distance of top of element to top of viewport
   * left:          distance of left of element to left of viewport
   * bottom:        distance of bottom of element to top of viewport (not bottom of viewport)
   * right:         distance of right of element to left of viewport (not right of viewport)
   * innerHeight:   visible height of viewport
   * innerWidth:    visible width of the viewport
   */

  /** @param {PositionContext} pc */
  top: pc => pc.relRect.top - pc.viewportMargin,

  /** @param {PositionContext} pc */
  bottom: pc => (pc.viewport.clientHeight || 0) - pc.relRect.bottom - pc.viewportMargin,

  /** @param {PositionContext} pc */
  left: (pc, isCenteredVertically) => {
    if (isCenteredVertically) {
      return pc.relRect.left - pc.viewportMargin - pc.horizontalMargin;
    }
    return pc.relRect.right - pc.viewportMargin;
  },

  /** @param {PositionContext} pc */
  right: (pc, isCenteredVertically) => {
    const distanceFromRight = (pc.viewport.clientWidth || 0) - pc.relRect.left;
    if (isCenteredVertically) {
      return (
        distanceFromRight - (pc.relEl.offsetWidth || 0) - pc.viewportMargin - pc.horizontalMargin
      );
    }
    return distanceFromRight - pc.viewportMargin;
  },

  /** @param {PositionContext} pc */
  centerHorizontal: pc => {
    // Center position means you get half the relRect's width as extra space
    // Deduct the viewportMargin from that
    const extraSpace = pc.relRect.width / 2 - pc.viewportMargin;
    const spaceAvailableLeft = pc.relRect.left + extraSpace;
    const spaceAvailableRight = (pc.viewport.clientWidth || 0) - pc.relRect.right + extraSpace;

    return [spaceAvailableLeft, spaceAvailableRight];
  },

  /** @param {PositionContext} pc */
  centerVertical: pc => pc.relRect.top - (pc.viewportMargin + pc.elRect.height / 2),
};

/**
 * Calculates the direction the element should flow to. We first try to position the element in the
 * preferred direction. If this does not fit, we take the direction which has the most available
 * space.
 *
 * @param {number} minSpace
 * @param {string} prefDir
 * @param {{ name: string, space: number }} dirA
 * @param {{ name: string, space: number }} dirB
 * @param {{ name: string, space: number }} dirC
 */
export function calcDirection(minSpace, prefDir, dirA, dirB, dirC) {
  // Determine order to check direction, preferred direction comes first
  let dirs = [];
  if (prefDir === dirB.name) {
    dirs = [dirB, dirA, dirC];
  } else if (prefDir === dirC.name) {
    dirs = [dirC, dirA, dirB];
  } else {
    dirs = [dirA, dirB, dirC];
  }

  // Check if there is enough space
  // For horizontal center, check both directions, space required is half
  if (Array.isArray(dirs[0].space)) {
    if (dirs[0].space[0] >= minSpace / 2 && dirs[0].space[1] >= minSpace / 2) {
      return dirs[0];
    }
  } else if (dirs[0].space >= minSpace) {
    return dirs[0];
  }

  // Otherwise, take whichever has the most space
  // Horizontal center should always be our last fallback
  /* eslint-disable-next-line arrow-body-style */
  const dirsSort = (a, b) => {
    if (Array.isArray(a.space)) {
      return 1;
    }
    if (Array.isArray(b.space)) {
      return -1;
    }
    return a.space > b.space ? -1 : 1;
  };
  return dirs.sort(dirsSort)[0];
}

/**
 * Distracts the placement to horizontal and vertical
 * By default, uses 'bottom right' as placement
 * @param {string} placement, options are ['top','right','bottom','left','center']
 * and ordered as [vertical horizontal]
 */
export function getPlacement(placement) {
  let vertical;
  let horizontal;
  const placementArgs = placement.split(' ');
  // If only 1 argument is given, assume center for the other one
  if (placementArgs.length === 1) {
    if (placementArgs[0] === 'top' || placementArgs[0] === 'bottom') {
      placementArgs.push('center');
    } else if (placementArgs[0] === 'left' || placementArgs[0] === 'right') {
      placementArgs.unshift('center');
    }
  }
  [vertical, horizontal] = placementArgs;
  if (vertical === 'center') vertical = 'centerVertical';
  if (horizontal === 'center') horizontal = 'centerHorizontal';

  return { vertical, horizontal };
}

/**
 * Calculates the position of the element. We try to position the element above or below and
 * left or right of the trigger element. Preferred direction is evaluated first. If a minWidth
 * or minHeight is given, it is taken into account as well. Otherwise, the element full height
 * or width without restrictions is taken as max.
 *
 * If not enough space is found on any direction, the direction with the most available space is
 * taken.
 *
 * @param {PositionContext} pc
 * @param {Config} config
 */
export function getPosition(pc, config) {
  // Calculate the directions to position into
  const verticalDir = calcDirection(
    config.minHeight || pc.elRect.height,
    getPlacement(config.placement).vertical,
    { name: 'top', space: getAvailableSpace.top(pc) },
    { name: 'bottom', space: getAvailableSpace.bottom(pc) },
    { name: 'centerVertical', space: getAvailableSpace.centerVertical(pc) },
  );

  const isCenteredVertically = verticalDir.name === 'centerVertical';

  const horizontalDir = calcDirection(
    config.minWidth || pc.elRect.width,
    getPlacement(config.placement).horizontal,
    { name: 'left', space: getAvailableSpace.left(pc, isCenteredVertically) },
    { name: 'right', space: getAvailableSpace.right(pc, isCenteredVertically) },
    { name: 'centerHorizontal', space: getAvailableSpace.centerHorizontal(pc) },
  );

  // Max dimensions will be available space for the direction + viewportMargin
  // const maxHeight = verticalDir.space - pc.viewportMargin;
  // const maxWidth = horizontalDir.space - pc.viewportMargin;
  const maxHeight = verticalDir.space;
  let maxWidth;
  if (Array.isArray(horizontalDir.space)) {
    maxWidth = Math.min(horizontalDir.space[0] * 2, horizontalDir.space[1] * 2);
  } else {
    maxWidth = horizontalDir.space;
  }

  // Actual dimensions will be max dimensions or current dimensions if they are already smaller
  const eventualHeight = Math.min(maxHeight, pc.elRect.height);
  const eventualWidth = Math.min(maxWidth, pc.elRect.width);
  const calcPosition = config.position === 'absolute' ? calcAbsolutePosition : calcFixedPosition;
  return {
    maxHeight,
    width: Math.min(eventualWidth, maxWidth),
    top: calcPosition[verticalDir.name](pc, eventualHeight),
    left: calcPosition[horizontalDir.name](pc, eventualWidth, isCenteredVertically),
    verticalDir: verticalDir.name,
    horizontalDir: horizontalDir.name,
  };
}
