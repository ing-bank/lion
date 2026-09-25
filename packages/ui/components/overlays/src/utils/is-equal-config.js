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
    return a === b;
  }
  const aObj = /** @type {Record<string, any>} */ (a);
  const bObj = /** @type {Record<string, any>} */ (b);
  const aProps = Object.keys(aObj);
  const bProps = Object.keys(bObj);
  if (aProps.length !== bProps.length) {
    return false;
  }
  const isEqual = /** @param {string} prop */ prop => isEqualConfig(aObj[prop], bObj[prop]);
  return aProps.every(isEqual);
}
