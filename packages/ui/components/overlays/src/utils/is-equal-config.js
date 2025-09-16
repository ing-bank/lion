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
  const aProps = /** @type {Array<keyof OverlayConfig>} */ (Object.keys(a));
  const bProps = /** @type {Array<keyof OverlayConfig>} */ (Object.keys(b));
  if (aProps.length !== bProps.length) {
    return false;
  }
  // @ts-expect-error
  const isEqual = /** @param {keyof OverlayConfig} prop */ prop => isEqualConfig(a[prop], b[prop]);
  return aProps.every(isEqual);
}
