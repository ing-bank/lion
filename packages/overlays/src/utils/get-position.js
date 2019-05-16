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
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedHeight
   */
  top: (pc, horizontalIsPrimary, positionedHeight) => {
    if (horizontalIsPrimary) {
      return pc.relEl.offsetTop - positionedHeight + pc.relEl.offsetHeight;
    }
    return pc.relEl.offsetTop - positionedHeight - pc.verticalMargin;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  bottom: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relEl.offsetTop;
    }
    return pc.relEl.offsetTop + pc.relRect.height + pc.verticalMargin;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedWidth
   */
  left: (pc, horizontalIsPrimary, positionedWidth) => {
    if (horizontalIsPrimary) {
      return (
        pc.relEl.offsetLeft -
        (positionedWidth - pc.relRect.width) -
        (pc.relEl.offsetWidth || 0) -
        pc.horizontalMargin
      );
    }
    return pc.relEl.offsetLeft - (positionedWidth - pc.relRect.width);
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  right: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relEl.offsetLeft + (pc.relEl.offsetWidth || 0) + pc.horizontalMargin;
    }
    return pc.relEl.offsetLeft;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedWidth
   */
  center: (pc, horizontalIsPrimary, positionedLength) => {
    if (horizontalIsPrimary) {
      return pc.relEl.offsetTop - (positionedLength - pc.relRect.height) / 2;
    }
    return pc.relEl.offsetLeft - (positionedLength - pc.relRect.width) / 2;
  },
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
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedHeight
   */
  top: (pc, horizontalIsPrimary, positionedHeight) => {
    if (horizontalIsPrimary) {
      return pc.relRect.top - positionedHeight + pc.relRect.height;
    }
    return pc.relRect.top - positionedHeight - pc.verticalMargin;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  bottom: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relRect.top;
    }
    return pc.relRect.top + pc.relRect.height + pc.verticalMargin;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedWidth
   */
  left: (pc, horizontalIsPrimary, positionedWidth) => {
    if (horizontalIsPrimary) {
      return pc.relRect.left - positionedWidth - pc.horizontalMargin;
    }
    return pc.relRect.left - (positionedWidth - pc.relRect.width);
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  right: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relRect.left + pc.relRect.width + pc.horizontalMargin;
    }
    return pc.relRect.left;
  },

  /**
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   * @param {number} positionedWidth
   */
  center: (pc, horizontalIsPrimary, positionedLength) => {
    if (horizontalIsPrimary) {
      return pc.relRect.top - (positionedLength - pc.relRect.height) / 2;
    }
    return pc.relRect.left - (positionedLength - pc.relRect.width) / 2;
  },
};

/**
 * Calculates the available space within the viewport around element we are positioning relatively
 * to for a given direction.
 */
export const getAvailableSpace = {
  /**
   * If horizontal is primary, this is the space between the top of viewport
   * and the bottom of the element.
   * Else, it is the space between the top of the viewport and the top of the element.
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  top: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relRect.bottom - pc.viewportMargin;
    }
    return pc.relRect.top - pc.viewportMargin - pc.verticalMargin;
  },

  /**
   * If horizontal is primary, this is the space between the bottom of viewport
   * and the top of the element.
   * Else, it is the space between the bottom of the viewport and the bottom of the element.
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  bottom: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return (pc.viewport.clientHeight || 0) - pc.relRect.top - pc.viewportMargin;
    }
    return (
      (pc.viewport.clientHeight || 0) - pc.relRect.bottom - pc.viewportMargin - pc.verticalMargin
    );
  },

  /**
   * If horizontal is primary, this is the space between the left of viewport
   * and left side of the element.
   * Else, it is the space between the left of viewport and right side of the element.
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  left: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return pc.relRect.left - pc.viewportMargin - pc.horizontalMargin;
    }
    return pc.relRect.right - pc.viewportMargin;
  },

  /**
   * If horizontal is primary, this is the space between the right of viewport
   * and right side of the element.
   * Else, it is the space between the right of viewport and left side of the element.
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  right: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      return (
        (pc.viewport.clientWidth || 0) - pc.relRect.right - pc.horizontalMargin - pc.viewportMargin
      );
    }
    return (pc.viewport.clientWidth || 0) - pc.relRect.left - pc.viewportMargin;
  },

  /**
   * If horizontal is primary, this is the minimum of 1) the space between the top of the viewport
   * and vertical middle of the element and 2) the space between the bottom side of the viewport
   * and vertical middle of the element.
   * Else, this is the minimum of 1) the space between the left of the viewport
   * and horizontal center of the element and 2) the space between the right side of the viewport
   * and horizontal center middle of the element.
   * @param {PositionContext} pc
   * @param {boolean} horizontalIsPrimary
   */
  center: (pc, horizontalIsPrimary) => {
    if (horizontalIsPrimary) {
      const spaceTop = pc.relRect.bottom - (pc.viewportMargin + pc.relRect.height / 2);
      const spaceBottom =
        (pc.viewport.clientHeight || 0) -
        (pc.viewportMargin + pc.relRect.top + pc.relRect.height / 2);
      return Math.min(spaceTop, spaceBottom) * 2;
    }

    const spaceLeft = pc.relRect.right - (pc.viewportMargin + pc.relRect.width / 2);
    const spaceRight =
      (pc.viewport.clientWidth || 0) - (pc.viewportMargin + pc.relRect.left + pc.relRect.width / 2);
    return Math.min(spaceLeft, spaceRight) * 2;
  },
};

/**
 * Calculates the direction the element should flow to. We first try to position the element in the
 * preferred direction. If this does not fit, we take the direction which has the most available
 * space.
 *
 * @param {number} minSpace
 * @param {string} prefDir
 * @param {Object.<string, number>[]} possibleDirs
 */
export function calcDirection(minSpace, prefDir, possibleDirs) {
  const dirs = possibleDirs;
  // Put the preferred direction as the first one in the array
  possibleDirs.forEach(dir => {
    if (prefDir === dir.name) {
      dirs.splice(dirs.indexOf(dir), 1);
      dirs.unshift(dir);
    }
  });

  // Check if there is enough space
  if (dirs[0].space >= minSpace) {
    return dirs[0];
  }

  // Otherwise, take whichever has the most space
  const dirsSort = (a, b) => {
    return a.space > b.space ? -1 : 1;
  };
  return dirs.sort(dirsSort)[0];
}

/**
 * Distills the placement to horizontal and vertical
 * By default, uses 'bottom-of-right' as placement
 * @param {string} placement, options are: [
 *  'left-of-top', 'center-of-top', 'right-of-top',
 *  'left-of-bottom', 'center-of-bottom', 'right-of-bottom',
 *  'top-of-right', 'center-of-right', 'bottom-of-right',
 *  'top-of-left', 'center-of-left', 'bottom-of-left',
 * ]
 * @return {Object.<string, string, boolean>} object containing vertical argument, horizontal
 * argument and whether the horizontal argument is the primary argument or the secondary.
 */
export function getPlacement(placement) {
  let primary;
  let secondary;
  let horizontal;
  let vertical;
  let horizontalIsPrimary;

  // Parsing the placement string into primary / secondary
  const placementArgs = placement.split('-');
  if (placementArgs.length === 1) {
    [primary] = placementArgs;
    secondary = 'center';
  } else {
    placementArgs.splice(1, 1);
    [secondary, primary] = placementArgs;
  }

  // Extracting horizontal / vertical from primary / secondary
  if (['left', 'right'].includes(primary)) {
    horizontalIsPrimary = true;
    horizontal = primary;
    vertical = secondary;
  } else {
    horizontalIsPrimary = false;
    horizontal = secondary;
    vertical = primary;
  }

  return { vertical, horizontal, horizontalIsPrimary };
}

/**
 * Calculates the position of the element. We try to position the element above or below and
 * left or right of the trigger element. Preferred direction is evaluated first. If a minWidth
 * or minHeight is given, it is taken into account as well. Otherwise, the element full height
 * or width without restrictions is taken as max.
 *
 * If not enough space is found on the preferred direction, the direction with
 * the most available space is taken.
 *
 * @param {PositionContext} pc
 * @param {Config} config
 */
export function getPosition(pc, config) {
  const { vertical, horizontal, horizontalIsPrimary } = getPlacement(config.placement);

  const possibleVerticalPositions = [
    { name: 'top', space: getAvailableSpace.top(pc, horizontalIsPrimary) },
    { name: 'bottom', space: getAvailableSpace.bottom(pc, horizontalIsPrimary) },
  ];
  // When horizontal is the primary argument, a vertical center is possible
  if (horizontalIsPrimary) {
    possibleVerticalPositions.push({
      name: 'center',
      space: getAvailableSpace.center(pc, horizontalIsPrimary),
    });
  }
  const verticalDir = calcDirection(
    config.minHeight || pc.elRect.height,
    vertical,
    possibleVerticalPositions,
  );

  const possibleHorizontalPositions = [
    { name: 'left', space: getAvailableSpace.left(pc, horizontalIsPrimary) },
    { name: 'right', space: getAvailableSpace.right(pc, horizontalIsPrimary) },
  ];
  // When horizontal is the secondary argument, a horizontal center is possible
  if (!horizontalIsPrimary) {
    possibleHorizontalPositions.push({
      name: 'center',
      space: getAvailableSpace.center(pc, horizontalIsPrimary),
    });
  }
  const horizontalDir = calcDirection(
    config.minWidth || pc.elRect.width,
    horizontal,
    possibleHorizontalPositions,
  );

  const maxHeight = verticalDir.space;
  const maxWidth = horizontalDir.space;

  // Actual dimensions will be max dimensions or current dimensions if they are already smaller
  const eventualHeight = Math.min(maxHeight, pc.elRect.height);
  const eventualWidth = Math.min(maxWidth, pc.elRect.width);

  const calcPosition = config.position === 'absolute' ? calcAbsolutePosition : calcFixedPosition;

  const returnPosition = horizontalIsPrimary
    ? `${verticalDir.name}-of-${horizontalDir.name}`
    : `${horizontalDir.name}-of-${verticalDir.name}`;

  return {
    maxHeight: Math.round(maxHeight),
    width: Math.ceil(Math.min(eventualWidth, maxWidth)),
    top: Math.round(calcPosition[verticalDir.name](pc, horizontalIsPrimary, eventualHeight)),
    left: Math.round(calcPosition[horizontalDir.name](pc, horizontalIsPrimary, eventualWidth)),
    verticalDir: verticalDir.name,
    horizontalDir: horizontalDir.name,
    position: returnPosition,
  };
}
