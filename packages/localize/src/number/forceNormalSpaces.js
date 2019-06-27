import { normalSpaces } from './normalSpaces.js';

/**
 * @param {Array} formattedParts
 * @return {Array} parts with forced "normal" spaces
 */
export function forceNormalSpaces(formattedParts) {
  const result = [];
  formattedParts.forEach(part => {
    result.push({
      type: part.type,
      value: normalSpaces(part.value),
    });
  });
  return result;
}
