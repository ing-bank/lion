/**
 * @typedef {import('../../types/localizeTypes').FormatNumberPart} FormatNumberPart
 */

import { normalSpaces } from './normalSpaces.js';

/**
 * Parts with forced "normal" spaces
 *
 * @param {FormatNumberPart[]} formattedParts
 * @returns {FormatNumberPart[]}
 */
export function forceNormalSpaces(formattedParts) {
  /** @type {FormatNumberPart[]} */
  const result = [];
  formattedParts.forEach(part => {
    result.push({
      type: part.type,
      value: normalSpaces(part.value),
    });
  });
  return result;
}
