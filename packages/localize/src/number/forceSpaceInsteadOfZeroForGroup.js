/**
 * @typedef {import('../../types/localizeTypes').FormatNumberPart} FormatNumberPart
 */

/**
 * @desc Intl uses 0 as group separator for bg-BG locale.
 * This should be a ' '
 * @param {FormatNumberPart[]} formattedParts
 * @returns {FormatNumberPart[]} corrected formatted parts
 */
export function forceSpaceInsteadOfZeroForGroup(formattedParts) {
  return formattedParts.map(p => {
    if (p.type === 'group' && p.value === '0') {
      p.value = ' '; // eslint-disable-line no-param-reassign
    }
    return p;
  });
}
