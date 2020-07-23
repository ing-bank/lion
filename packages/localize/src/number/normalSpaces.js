/**
 * @param {string} value
 * @return {string} value with forced "normal" space
 */
export function normalSpaces(value) {
  // If non-breaking space (160) or narrow non-breaking space (8239) then return ' '
  return value.charCodeAt(0) === 160 || value.charCodeAt(0) === 8239 ? ' ' : value;
}
