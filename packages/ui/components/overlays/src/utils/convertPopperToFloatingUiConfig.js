/**
 * @typedef {Partial<import('@popperjs/core').Modifier<any, any>>} Modifier
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} PopperPlacement
 * @typedef {import('@floating-ui/dom')} FloatingUi
 * @typedef {import('@floating-ui/dom').Middleware} Middleware
 * @typedef {import('@floating-ui/dom').Placement} FloatingUiPlacement
 * @typedef {import('@floating-ui/dom').Strategy} FloatingUiStrategy
 * @typedef {import('@floating-ui/dom').ComputePositionConfig} ComputePositionConfig
 */

/**
 *
 * @param {*} popperModifierOptions
 */
function convertToDetectOverflowOpts(popperModifierOptions) {
  const newOpts = {};
  if (popperModifierOptions?.boundariesElement) {
    newOpts.rootBoundary = popperModifierOptions.boundariesElement;
  }
  if (popperModifierOptions?.padding) {
    newOpts.padding = popperModifierOptions.padding;
  }
  return newOpts;
}

/**
 * @param {Modifier} popperModifier
 * @param {FloatingUi} floatingUi
 */
function convertPreventOverflowModifier(popperModifier, floatingUi) {
  return floatingUi.shift({
    ...convertToDetectOverflowOpts(popperModifier.options),
  });
}

/**
 * @param {Modifier} popperModifier
 * @param {FloatingUi} floatingUi
 */
function convertOffsetModifier(popperModifier, floatingUi) {
  if (typeof popperModifier.options?.offset === 'number') {
    return floatingUi.offset(popperModifier.options?.offset);
  }
  if (Array.isArray(popperModifier.options?.offset)) {
    // @ts-ignore
    const [mainAxis, crossAxis] = popperModifier.options?.offset;
    return floatingUi.offset({ mainAxis, crossAxis });
  }
  console.log('popperModifier', popperModifier);
  return {};
}

/**
 * @param {Modifier} popperModifier
 * @param {FloatingUi} floatingUi
 */
function convertFlipModifier(popperModifier, floatingUi) {
  return floatingUi.flip({
    ...convertToDetectOverflowOpts(popperModifier.options),
  });
}

/**
 * @param {Modifier} popperModifier
 * @param {FloatingUi} floatingUi
 * @param {{ arrowEl: HTMLElement }} extraOptions
 */
function convertArrowModifier(popperModifier, floatingUi, { arrowEl }) {
  return floatingUi.arrow({
    element: arrowEl,
    ...convertToDetectOverflowOpts(popperModifier.options),
  });
}

/**
 * @param {Modifier[]} modifiers
 */
function dedupeAndFilterPopperModifiers(modifiers) {
  /**
   * @type {Modifier[]}
   */
  const deduped = [];
  // The last defined modifier (at the end of array) should take precdence over others
  for (const mod of modifiers.reverse()) {
    const found = deduped.find(m => m.name === mod.name);
    if (!found) {
      deduped.push(mod);
    }
  }
  return deduped.filter(m => m.enabled !== false);
}

/**
 * Backwards compatibility layer that converts the popper config into
 * a set of floating ui middleware.
 * N.B. this conversion is by no means exhaustive: it mainly caters for the default Popper
 * config applied by default in OverlayController
 * @param {PopperOptions} popperConfig
 * @param {{ arrowEl: HTMLElement, floatingUi: FloatingUi }} extraOptions
 * @returns {Promise<Partial<ComputePositionConfig>>}
 */
export async function convertPopperToFloatingUiConfig(popperConfig, { floatingUi, arrowEl }) {
  /** @type {Middleware[]} */
  const middleware = [];

  if (popperConfig.modifiers.length) {
    const dedupedModifiers = dedupeAndFilterPopperModifiers(popperConfig.modifiers);

    for (const popperModifier of dedupedModifiers) {
      switch (popperModifier.name) {
        case 'preventOverflow':
          middleware.push(convertPreventOverflowModifier(popperModifier, floatingUi));
          break;
        case 'offset':
          middleware.push(convertOffsetModifier(popperModifier, floatingUi));
          break;
        case 'flip':
          middleware.push(convertFlipModifier(popperModifier, floatingUi));
          break;
        case 'arrow':
          middleware.push(convertArrowModifier(popperModifier, floatingUi, { arrowEl }));
          break;
        default:
          break;
      }
    }
    console.log({ middleware, dedupedModifiers });
  }

  /** @type {FloatingUiPlacement} */
  let floatingUiPlacement;
  if (popperConfig.placement !== 'auto') {
    floatingUiPlacement = /** @type {FloatingUiPlacement} */ (popperConfig.placement);
  } else {
    floatingUiPlacement = 'bottom';
    middleware.push(floatingUi.autoPlacement());
  }

  return {
    placement: floatingUiPlacement,
    strategy: popperConfig.strategy,
    middleware,
  };
}
