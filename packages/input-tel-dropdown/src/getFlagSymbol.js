/**
 * @param {string} char
 */
function getRegionalIndicatorSymbol(char) {
  return String.fromCodePoint(0x1f1e6 - 65 + char.toUpperCase().charCodeAt(0));
}

/**
 * @param {string} regionCode
 */
export function getFlagSymbol(regionCode) {
  return getRegionalIndicatorSymbol(regionCode[0]) + getRegionalIndicatorSymbol(regionCode[1]);
}
