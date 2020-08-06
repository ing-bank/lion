/**
 * Return PascalCased version of the camelCased string
 *
 * @param {string} str
 * @return {string}
 */
export function pascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
