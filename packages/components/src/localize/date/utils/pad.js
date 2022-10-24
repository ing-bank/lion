/**
 * To get the absolute value of a number.
 *
 * @param  {string} n - number in string format
 * @returns {string}
 */
export function pad(n) {
  const digitRegex = /^\d+$/;
  const v = digitRegex.test(String(n)) ? Math.abs(Number(n)) : n;
  return String(v < 10 ? `0${v}` : v);
}
