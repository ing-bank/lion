/* eslint-disable import/no-extraneous-dependencies */
import {
  DefaultSuccess,
  EqualsLength,
  IsDate,
  IsDateDisabled,
  IsEmail,
  IsNumber,
  MaxDate,
  MaxLength,
  MaxNumber,
  MinDate,
  MinLength,
  MinMaxDate,
  MinMaxLength,
  MinMaxNumber,
  MinNumber,
  Pattern,
  Required,
} from '@lion/ui/form-core.js';
import { getLocalizedMessage, loadValidateNamespace } from '../getLocalizedMessage.js';

/**
 * @typedef {import('../../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 */

let isLoaded = false;

/**
 * @param {{localize: LocalizeManager}} opts allow multiple lion/extension lib versions to provide their deduped instance of LocalizeManager
 */
export function loadFormCoreMessagesNoSideEffects({ localize }) {
  console.log('loadFormCoreMessagesNoSideEffects', isLoaded);
  if (isLoaded === true) return;

  /** @param {FeedbackMessageData} data */
  Required.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  EqualsLength.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinLength.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MaxLength.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinMaxLength.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  Pattern.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  IsEmail.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  IsNumber.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinNumber.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MaxNumber.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinMaxNumber.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  IsDate.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinDate.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MaxDate.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  MinMaxDate.getMessage = async data => getLocalizedMessage({ data, localize });
  /** @param {FeedbackMessageData} data */
  IsDateDisabled.getMessage = async data => getLocalizedMessage({ data, localize });

  DefaultSuccess.getMessage = async data => {
    await loadValidateNamespace({ localize });
    const randomKeys = localize.msg('lion-validate:success.RandomOk').split(',');
    const key = randomKeys[Math.floor(Math.random() * randomKeys.length)].trim();
    return localize.msg(`lion-validate:${key}`, data);
  };

  isLoaded = true;
}
