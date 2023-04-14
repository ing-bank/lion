/**
 * @typedef {import('../../../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @returns {FormatNumberPart[]}
 */

export function forceTryCurrencyCode(formattedParts, { currency, currencyDisplay } = {}) {
  const result = formattedParts;
  if (currency === 'TRY' && currencyDisplay === 'code') {
    result.map(part => {
      const newPart = part;
      if (part.type === 'currency') {
        newPart.value = 'TL';
      }
      return newPart;
    });
  }
  return result;
}
