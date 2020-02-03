export function forceTryCurrencyCode(formattedParts, options) {
  const result = formattedParts;
  // Chage the currencycode from TRY to TL, for Turkey
  if (options.currency === 'TRY' && options.currencyDisplay === 'code') {
    if (result[0].value === 'TRY') {
      result[0].value = 'TL';
    }
  }
  return result;
}
