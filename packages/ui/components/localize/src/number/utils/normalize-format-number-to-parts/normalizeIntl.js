import { getGroupSeparator } from '../../getGroupSeparator.js';
import { forceAddGroupSeparators } from './forceAddGroupSeparators.js';
import { forceCurrencyToEnd } from './forceCurrencyToEnd.js';
import { forceNoSpaceBetweenCurrencySymbolAndNumber } from './forceNoSpaceBetweenCurrencySymbolAndNumber.js';
import { forceNormalSpaces } from './forceNormalSpaces.js';
import { forceSpaceBetweenCurrencyCodeAndNumber } from './forceSpaceBetweenCurrencyCodeAndNumber.js';
import { forceSpaceInsteadOfZeroForGroup } from './forceSpaceInsteadOfZeroForGroup.js';
import { forceTryCurrencyCode } from './forceTryCurrencyCode.js';
import { forceFRBESymbols, forceSymbols } from './forceSymbols.js';

/**
 * Normalizes function "formatNumberToParts"
 *
 * @typedef {import('../../../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @param {string} _locale
 * @returns {FormatNumberPart[]}
 */
// eslint-disable-next-line default-param-last
export function normalizeIntl(formattedParts, options = {}, _locale) {
  let normalize = forceNormalSpaces(formattedParts);
  // Dutch and Belgian currency must be moved to end of number
  if (options.style === 'currency') {
    if (options.currencyDisplay === 'code' && _locale.slice(0, 2) === 'nl') {
      normalize = forceCurrencyToEnd(normalize);
    }
    // Add group separator for Bulgarian locale
    if (_locale === 'bg-BG') {
      normalize = forceAddGroupSeparators(normalize, getGroupSeparator());
      normalize = forceSpaceInsteadOfZeroForGroup(normalize);
    }
    // Force space between currency code and number
    if (_locale === 'en-GB' || _locale === 'en-US' || _locale === 'en-AU' || _locale === 'en-PH') {
      normalize = forceSpaceBetweenCurrencyCodeAndNumber(normalize, options);
    }
    if (_locale === 'en-AU') {
      normalize = forceSymbols(normalize, options, ['EUR', 'USD', 'JPY']);
      normalize = forceNoSpaceBetweenCurrencySymbolAndNumber(normalize, options);
    }
    if (_locale === 'en-PH') {
      normalize = forceSymbols(normalize, options, ['USD', 'JPY']);
    }
    if (_locale === 'fr-FR' || _locale === 'fr-BE') {
      normalize = forceSymbols(normalize, options, ['JPY']);
    }
    if (_locale === 'fr-BE') {
      normalize = forceFRBESymbols(normalize, options, ['USD']);
    }
    if (_locale === 'tr-TR') {
      normalize = forceTryCurrencyCode(normalize, options);
      if (options.currencyDisplay === 'code') {
        normalize = forceCurrencyToEnd(normalize);
      }
    }
  }
  return normalize;
}
