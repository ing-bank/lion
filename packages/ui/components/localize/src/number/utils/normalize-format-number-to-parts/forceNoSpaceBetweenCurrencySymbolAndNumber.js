/**
 * Force no space between currency symbol and amount
 *
 * @typedef {import('../../../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @returns {FormatNumberPart[]}
 */
export function forceNoSpaceBetweenCurrencySymbolAndNumber(
  formattedParts,
  { currency, currencyDisplay } = {},
) {
  const result = formattedParts;
  if (formattedParts.length > 1 && currencyDisplay === 'symbol' && currency) {
    formattedParts.forEach((part, i) => {
      if (part.type === 'literal') {
        result[i].value = '';
      }
    });
  }
  return result;
}
