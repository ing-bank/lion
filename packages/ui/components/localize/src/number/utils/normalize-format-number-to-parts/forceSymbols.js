/**
 * @typedef {import('../../../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 */

/** @type {Object.<string,string>} */
const CURRENCY_CODE_SYMBOL_MAP = {
  EUR: '€',
  USD: '$',
  JPY: '¥',
};

/**
 * Change the symbols differences in browsers
 *
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @param {string[]} currencyScope
 * @returns {FormatNumberPart[]}
 */
// eslint-disable-next-line default-param-last
export function forceSymbols(formattedParts, { currency, currencyDisplay } = {}, currencyScope) {
  const result = formattedParts;
  if (
    formattedParts.length > 1 &&
    currencyDisplay === 'symbol' &&
    currency &&
    currencyScope.includes(currency)
  ) {
    formattedParts.forEach((part, i) => {
      if (part.type === 'currency' && Object.keys(CURRENCY_CODE_SYMBOL_MAP).includes(currency)) {
        result[i].value = CURRENCY_CODE_SYMBOL_MAP[currency];
      }
    });
  }
  return result;
}

/**
 * Change the symbols for fr-BE differences in browsers
 *
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @param {string[]} currencyScope
 * @returns {FormatNumberPart[]}
 */
export function forceFRBESymbols(
  formattedParts,
  // eslint-disable-next-line default-param-last
  { currency, currencyDisplay } = {},
  currencyScope,
) {
  const result = formattedParts;
  if (
    formattedParts.length > 1 &&
    currencyDisplay === 'symbol' &&
    currency &&
    currencyScope.includes(currency)
  ) {
    formattedParts.forEach((part, i) => {
      if (part.type === 'currency' && Object.keys(CURRENCY_CODE_SYMBOL_MAP).includes(currency)) {
        result[i].value = '$US';
      }
    });
  }
  return result;
}
