/**
 * To get the absolute value of a number.
 *
 * @param n
 * @returns {string}
 */
export function pad(n) {
  const digitRegex = /^\d+$/;
  const v = digitRegex.test(n) ? Math.abs(n) : n;

  return String(v < 10 ? `0${v}` : v);
}
