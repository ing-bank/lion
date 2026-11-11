/**
 * Generates random unique identifier (for dom elements)
 * @param {string} prefix
 * @return {string} unique id
 */
export function uuid(prefix = '') {
  const elementName = prefix.length > 0 ? `${prefix}-` : '';
  return `${elementName}${Math.random().toString(36).slice(2, 12)}`;
}
