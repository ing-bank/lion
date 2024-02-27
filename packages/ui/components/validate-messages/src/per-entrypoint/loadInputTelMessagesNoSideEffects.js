/* eslint-disable import/no-extraneous-dependencies */
import { PhoneNumber } from '@lion/ui/input-tel.js';
import { loadValidateNamespace } from '../getLocalizedMessage.js';

/**
 * @typedef {import('../../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('@lion/ui/localize.js').LocalizeManager} LocalizeManager
 */

let isLoaded = false;

/**
 * @param {{localize: LocalizeManager}} opts allow multiple lion/extension lib versions to provide their deduped instance of LocalizeManager
 */
export function loadInputTelMessagesNoSideEffects({ localize }) {
  if (isLoaded === true) return;

  /** @param {FeedbackMessageData} data */
  // @ts-ignore
  PhoneNumber.getMessage = async data => {
    await loadValidateNamespace({ localize });
    const { type, outcome } = data;
    if (outcome === 'too-long') {
      // TODO: get max-length of country and use MaxLength validator
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    if (outcome === 'too-short') {
      // TODO: get min-length of country and use MinLength validator
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    // TODO: add a more specific message here
    if (outcome === 'invalid-country-code') {
      return localize.msg(`lion-validate:${type}.Pattern`, data);
    }
    return localize.msg(`lion-validate:${type}.Pattern`, data);
  };

  isLoaded = true;
}
