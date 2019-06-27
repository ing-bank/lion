/**
 * When in some locales there is no space between currency and amount it is added
 *
 * @param {Array} formattedParts
 * @param {Object} options
 * @returns {*}
 */
export function forceSpaceBetweenCurrencyCodeAndNumber(formattedParts, options) {
  const numberOfParts = formattedParts.length;
  const literalObject = { type: 'literal', value: ' ' };
  if (numberOfParts > 1 && options && options.currency && options.currencyDisplay === 'code') {
    if (formattedParts[0].type === 'currency' && formattedParts[1].type !== 'literal') {
      // currency in front of a number: EUR 1.00
      formattedParts.splice(1, 0, literalObject);
    } else if (
      formattedParts[0].type === 'minusSign' &&
      formattedParts[1].type === 'currency' &&
      formattedParts[2].type !== 'literal'
    ) {
      // currency in front of a negative number: -EUR 1.00
      formattedParts.splice(2, 0, literalObject);
    } else if (
      formattedParts[numberOfParts - 1].type === 'currency' &&
      formattedParts[numberOfParts - 2].type !== 'literal'
    ) {
      // currency in behind a number: 1.00 EUR || -1.00 EUR
      formattedParts.splice(numberOfParts - 1, 0, literalObject);
    }
  }
  return formattedParts;
}
