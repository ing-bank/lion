/**
 * To get the absolute value of a number.
 *
 * @param n
 * @returns {string}
 */
export function pad(n) {
  const v = Math.abs(n);

  return String(v < 10 ? `0${v}` : v);
}
