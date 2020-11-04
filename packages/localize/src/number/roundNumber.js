/**
 * Round the number based on the options
 *
 * @param {number} number
 * @param {string} roundMode
 * @throws {Error} roundMode can only be round|floor|ceiling
 * @returns {number}
 */
export function roundNumber(number, roundMode) {
  switch (roundMode) {
    case 'floor':
      return Math.floor(number);
    case 'ceiling':
      return Math.ceil(number);
    case 'round':
      return Math.round(number);
    default:
      throw new Error('roundMode can only be round|floor|ceiling');
  }
}
