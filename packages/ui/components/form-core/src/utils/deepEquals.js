/**
 * Checks if two objects are equal by comparing their JSON stringified values.
 * Small helper function to improve readability of code.
 *
 * @param {object} a
 * @param {object} b
 */
export function deepEquals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
