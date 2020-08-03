import { getGroupSeparator } from './getGroupSeparator.js';
import { forceAddGroupSeparators } from './forceAddGroupSeparators.js';
import { forceCurrencyToEnd } from './forceCurrencyToEnd.js';
import { forceNormalSpaces } from './forceNormalSpaces.js';
import { forceSpaceBetweenCurrencyCodeAndNumber } from './forceSpaceBetweenCurrencyCodeAndNumber.js';
import { forceYenSymbol } from './forceYenSymbol.js';
import { forceSpaceInsteadOfZeroForGroup } from './forceSpaceInsteadOfZeroForGroup.js';
import { forceTryCurrencyCode } from './forceTryCurrencyCode.js';
import { forceENAUSymbols } from './forceENAUSymbols.js';

/**
 * Function with all fixes on localize
 *
 * @typedef {import('../../types/LocalizeMixinTypes').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {Object} [options]
 * @param {string} [options.style]
 * @param {string} [options.currency]
 * @param {string} [options.currencyDisplay]
 * @param {string} _locale
 * @returns {FormatNumberPart[]}
 */
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
    // Force missing Japanese Yen symbol
    if (_locale === 'fr-FR' || _locale === 'fr-BE') {
      normalize = forceYenSymbol(normalize, options);
    }
    if (_locale === 'tr-TR') {
      normalize = forceTryCurrencyCode(normalize, options);
      if (options.currencyDisplay === 'code') {
        normalize = forceCurrencyToEnd(normalize);
      }
    }
    if (_locale === 'en-AU') {
      normalize = forceENAUSymbols(normalize, options);
    }
  }
  return normalize;
}
