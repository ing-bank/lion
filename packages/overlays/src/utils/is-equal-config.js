/**
 * @typedef {import('../../types/OverlayConfig').OverlayConfig} OverlayConfig
 */

/**
 * Compares two OverlayConfigs to equivalence. Intended to prevent unnecessary resets.
 * Note that it doesn't cover as many use cases as common implementations, such as Lodash isEqual.
 *
 * @param {OverlayConfig} a
 * @param {OverlayConfig} b
 * @returns {boolean} Whether the configs are equivalent
 */
export function isEqualConfig(a, b) {
  if (typeof a !== 'object' || typeof a !== 'object') {
    return a === b;
  }
  const aProps = Object.keys(a);
  const bProps = Object.keys(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  const isEqual = /** @param {string} prop */ prop => isEqualConfig(a[prop], b[prop]);
  return aProps.every(isEqual);
}
