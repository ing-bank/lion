/**
 * @typedef {import('../../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

/**
 * Compares two OverlayConfigs to equivalence. Intended to prevent unnecessary resets.
 * Note that it doesn't cover as many use cases as common implementations, such as Lodash isEqual.
 *
 * @param {Partial<OverlayConfig>} a
 * @param {Partial<OverlayConfig>} b
 * @returns {boolean} Whether the configs are equivalent
 */
export function isEqualConfig(a, b) {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    if (typeof a === 'function' && typeof b === 'function') {
      return /** @type {Function} */ (a).toString() === /** @type {Function} */ (b).toString();
    }
    return a === b;
  }
  if (a instanceof Node && b instanceof Node) {
    return a === b;
  }

  return Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).every(prop =>
    // @ts-ignore - dynamic property access
    isEqualConfig(a[prop], b[prop], prop),
  );
}
