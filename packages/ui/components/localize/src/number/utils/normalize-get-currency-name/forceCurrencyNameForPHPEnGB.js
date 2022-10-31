/**
 * @param {string} currencyName
 */
export function forceCurrencyNameForPHPEnGB(currencyName) {
  if (currencyName === 'Philippine pesos') {
    // eslint-disable-next-line no-param-reassign
    currencyName = 'Philippine pisos';
  }
  return currencyName;
}
