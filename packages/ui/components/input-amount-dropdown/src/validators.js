import { IsNumber, Validator } from '@lion/ui/form-core.js';
import { currencyUtil } from './currencyUtil.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 */

export class CurrencyAndAmount extends Validator {
  static validatorName = 'CurrencyAndAmount';

  /**
   * @param {import('../types/index.js').AmountDropdownModelValue} modelValue telephone number without country prefix
   */
  // eslint-disable-next-line class-methods-use-this
  execute(modelValue) {
    // @ts-expect-error - cannot cast string to CurrencyCode outside a TS file
    const validCurrencyCode = currencyUtil.allCurrencies.has(modelValue?.currency);
    const isNumber = new IsNumber().execute(modelValue.amount);

    return validCurrencyCode && isNumber;
  }
}
