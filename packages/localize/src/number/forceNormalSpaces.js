import { normalSpaces } from './normalSpaces.js';

/**
 * Parts with forced "normal" spaces
 *
 * @param {{type: string, value: string}[]} formattedParts
 * @returns {{type: string, value: string}[]}
 */
export function forceNormalSpaces(formattedParts) {
  /** @type {{type: string, value: string}[]} */
  const result = [];
  formattedParts.forEach(part => {
    result.push({
      type: part.type,
      value: normalSpaces(part.value),
    });
  });
  return result;
}
